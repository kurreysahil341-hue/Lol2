package com.heysheri.assistant.llm

import android.content.Context
import android.content.SharedPreferences
import android.database.Cursor
import android.net.Uri
import android.os.Environment
import android.provider.OpenableColumns
import android.util.Log
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.InputStream

/**
 * LocalLlmManager:
 * Offline on-device LLM inference using Google MediaPipe GenAI Tasks API.
 * 
 * Features:
 * 1. Safe Model Import from Android Storage (Downloads, SD card, WhatsApp, Google Drive).
 * 2. Multi-Source Discovery: Custom imported path -> Internal storage -> External Downloads -> Assets.
 * 3. Buffered streaming with real-time transfer progress callback for large 1-2GB models.
 * 4. Model format validation (.bin / .task for Gemma 2B & Llama 3.2).
 * 5. Automatic persistent storage of verified model path across app restarts.
 */
class LocalLlmManager(private val context: Context) {

    companion object {
        private const val TAG = "LocalLlmManager"
        const val PREFS_NAME = "sheri_llm_prefs"
        const val KEY_CUSTOM_MODEL_PATH = "custom_imported_model_path"
        const val DEFAULT_MODEL_NAME = "gemma-2b-it-cpu-int4.bin"
        private const val MAX_TOKENS = 512
        private const val TOP_K = 40
        private const val TEMPERATURE = 0.7f
        private const val MIN_MODEL_SIZE_BYTES = 50 * 1024 * 1024L // Min 50 MB
    }

    data class ModelInfo(
        val name: String,
        val path: String,
        val sizeBytes: Long,
        val sizeFormatted: String,
        val isLoaded: Boolean
    )

    interface LlmListener {
        fun onModelLoading()
        fun onModelReady()
        fun onModelError(error: String)
        fun onGeneratingResponse()
        fun onResponseGenerated(responseText: String)
    }

    private val prefs: SharedPreferences by lazy {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    private var llmInference: LlmInference? = null
    private var activeModelPath: String? = null
    private var isInitialized = false

    /**
     * Initializes the LLM by locating the best available model file.
     */
    suspend fun initialize(listener: LlmListener) = withContext(Dispatchers.IO) {
        try {
            listener.onModelLoading()
            val resolvedModel = resolveBestModelFile()

            if (resolvedModel == null || !resolvedModel.exists()) {
                val missingMsg = "No offline LLM model imported yet. Tap Settings -> Import Model to select your downloaded Gemma/Llama file."
                Log.w(TAG, missingMsg)
                isInitialized = false
                withContext(Dispatchers.Main) {
                    listener.onModelError(missingMsg)
                }
                return@withContext
            }

            loadModelFile(resolvedModel)
            withContext(Dispatchers.Main) {
                listener.onModelReady()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize MediaPipe LlmInference", e)
            isInitialized = false
            withContext(Dispatchers.Main) {
                listener.onModelError("LLM Init Error: ${e.localizedMessage}")
            }
        }
    }

    /**
     * Discovers model across multiple locations in priority order:
     * 1. User-imported path in SharedPreferences
     * 2. Internal app models directory: context.filesDir/models/
     * 3. Download directory on device storage (/sdcard/Download/)
     * 4. APK assets folder fallback
     */
    private fun resolveBestModelFile(): File? {
        // 1. Check user imported path in SharedPreferences
        val savedPath = prefs.getString(KEY_CUSTOM_MODEL_PATH, null)
        if (!savedPath.isNullOrEmpty()) {
            val file = File(savedPath)
            if (file.exists() && file.length() > MIN_MODEL_SIZE_BYTES) {
                Log.d(TAG, "Found user imported model: ${file.absolutePath} (${file.length()} bytes)")
                return file
            }
        }

        // 2. Check internal storage models folder
        val modelsDir = File(context.filesDir, "models").apply { if (!exists()) mkdirs() }
        val internalModels = modelsDir.listFiles { _, name ->
            name.endsWith(".bin", true) || name.endsWith(".task", true)
        }
        internalModels?.maxByOrNull { it.lastModified() }?.let {
            if (it.length() > MIN_MODEL_SIZE_BYTES) return it
        }

        // 3. Check default model in root filesDir
        val defaultInternal = File(context.filesDir, DEFAULT_MODEL_NAME)
        if (defaultInternal.exists() && defaultInternal.length() > MIN_MODEL_SIZE_BYTES) {
            return defaultInternal
        }

        // 4. Check external public Download directory
        val downloadFolder = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
        if (downloadFolder != null && downloadFolder.exists()) {
            val downloadMatch = File(downloadFolder, DEFAULT_MODEL_NAME)
            if (downloadMatch.exists() && downloadMatch.length() > MIN_MODEL_SIZE_BYTES) {
                Log.d(TAG, "Found model directly in Downloads folder: ${downloadMatch.absolutePath}")
                return downloadMatch
            }

            val anyLlmInDownload = downloadFolder.listFiles { _, name ->
                name.contains("gemma", true) || name.contains("llama", true)
            }?.firstOrNull { it.extension.lowercase() in listOf("bin", "task") && it.length() > MIN_MODEL_SIZE_BYTES }
            
            if (anyLlmInDownload != null) {
                Log.d(TAG, "Discovered LLM model in Downloads: ${anyLlmInDownload.absolutePath}")
                return anyLlmInDownload
            }
        }

        // 5. Try unpacking from APK assets if bundled
        try {
            val assetList = context.assets.list("") ?: emptyArray()
            if (assetList.contains(DEFAULT_MODEL_NAME)) {
                Log.d(TAG, "Unpacking model bundled in APK assets: $DEFAULT_MODEL_NAME")
                context.assets.open(DEFAULT_MODEL_NAME).use { input ->
                    FileOutputStream(defaultInternal).use { output ->
                        input.copyTo(output)
                    }
                }
                if (defaultInternal.exists() && defaultInternal.length() > MIN_MODEL_SIZE_BYTES) {
                    return defaultInternal
                }
            }
        } catch (_: Exception) {}

        return null
    }

    /**
     * Requirement: Robust Model Import from File Picker (Uri)
     * Handles large 1-2 GB model files with buffered streaming and progress feedback.
     */
    suspend fun importModelFromUri(
        uri: Uri,
        onProgress: (copiedBytes: Long, totalBytes: Long, percent: Int) -> Unit
    ): Result<ModelInfo> = withContext(Dispatchers.IO) {
        var inputStream: InputStream? = null
        var outputStream: FileOutputStream? = null

        try {
            val contentResolver = context.contentResolver
            
            // Query file display name and size from content provider
            var fileName = "imported_llm_${System.currentTimeMillis()}.bin"
            var fileSize: Long = -1

            val cursor: Cursor? = contentResolver.query(uri, null, null, null, null)
            cursor?.use {
                if (it.moveToFirst()) {
                    val nameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)
                    if (nameIndex != -1) fileName = it.getString(nameIndex) ?: fileName
                    if (sizeIndex != -1) fileSize = it.getLong(sizeIndex)
                }
            }

            // Target destination in app's internal sandbox
            val modelsDir = File(context.filesDir, "models").apply { if (!exists()) mkdirs() }
            val cleanFileName = fileName.replace(Regex("[^a-zA-Z0-9._-]"), "_")
            val targetFile = File(modelsDir, cleanFileName)

            inputStream = contentResolver.openInputStream(uri) 
                ?: return@withContext Result.failure(Exception("Cannot open selected file stream."))
            outputStream = FileOutputStream(targetFile)

            val buffer = ByteArray(128 * 1024) // 128 KB buffer for fast IO
            var bytesCopied: Long = 0
            var bytesRead: Int
            var lastReportedPercent = -1

            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                outputStream.write(buffer, 0, bytesRead)
                bytesCopied += bytesRead

                if (fileSize > 0) {
                    val percent = ((bytesCopied * 100) / fileSize).toInt().coerceIn(0, 100)
                    if (percent != lastReportedPercent) {
                        lastReportedPercent = percent
                        withContext(Dispatchers.Main) {
                            onProgress(bytesCopied, fileSize, percent)
                        }
                    }
                }
            }
            outputStream.flush()

            // Validate imported model
            if (targetFile.length() < MIN_MODEL_SIZE_BYTES) {
                targetFile.delete()
                return@withContext Result.failure(
                    Exception("Imported file is too small (${targetFile.length() / (1024 * 1024)} MB). Gemma/Llama models are typically 1 to 2 GB.")
                )
            }

            // Test load with MediaPipe LlmInference
            loadModelFile(targetFile)

            // Save verified model path
            prefs.edit().putString(KEY_CUSTOM_MODEL_PATH, targetFile.absolutePath).apply()

            val info = ModelInfo(
                name = targetFile.name,
                path = targetFile.absolutePath,
                sizeBytes = targetFile.length(),
                sizeFormatted = formatFileSize(targetFile.length()),
                isLoaded = true
            )

            Log.i(TAG, "Model successfully imported and initialized: ${info.name} (${info.sizeFormatted})")
            Result.success(info)

        } catch (e: Exception) {
            Log.e(TAG, "Error importing model from Uri", e)
            Result.failure(e)
        } finally {
            try { inputStream?.close() } catch (_: Exception) {}
            try { outputStream?.close() } catch (_: Exception) {}
        }
    }

    private fun loadModelFile(modelFile: File) {
        close()

        val options = LlmInference.LlmInferenceOptions.builder()
            .setModelPath(modelFile.absolutePath)
            .setMaxTokens(MAX_TOKENS)
            .setTopK(TOP_K)
            .setTemperature(TEMPERATURE)
            .build()

        llmInference = LlmInference.createFromOptions(context, options)
        activeModelPath = modelFile.absolutePath
        isInitialized = true
        Log.i(TAG, "LlmInference loaded successfully from: ${modelFile.absolutePath}")
    }

    suspend fun generateResponse(
        prompt: String,
        listener: LlmListener
    ): String = withContext(Dispatchers.IO) {
        val inference = llmInference
        if (inference == null || !isInitialized) {
            val fallback = "No offline LLM model loaded yet. Tap Settings to import your Gemma/Llama model."
            withContext(Dispatchers.Main) { listener.onResponseGenerated(fallback) }
            return@withContext fallback
        }

        try {
            withContext(Dispatchers.Main) { listener.onGeneratingResponse() }

            val formattedPrompt = """
                <start_of_turn>user
                You are Sheri, a helpful, concise, offline Android voice assistant.
                Answer in 1-2 friendly sentences.
                User: $prompt<end_of_turn>
                <start_of_turn>model
            """.trimIndent()

            val result = inference.generateResponse(formattedPrompt).trim()
            withContext(Dispatchers.Main) { listener.onResponseGenerated(result) }
            result
        } catch (e: Exception) {
            Log.e(TAG, "Error generating LLM response", e)
            val errorMsg = "Sorry, I had trouble processing that query offline."
            withContext(Dispatchers.Main) {
                listener.onModelError(e.localizedMessage ?: "Inference error")
                listener.onResponseGenerated(errorMsg)
            }
            errorMsg
        }
    }

    fun getActiveModelInfo(): ModelInfo? {
        val path = activeModelPath ?: prefs.getString(KEY_CUSTOM_MODEL_PATH, null) ?: return null
        val file = File(path)
        if (!file.exists()) return null

        return ModelInfo(
            name = file.name,
            path = file.absolutePath,
            sizeBytes = file.length(),
            sizeFormatted = formatFileSize(file.length()),
            isLoaded = isInitialized && llmInference != null
        )
    }

    private fun formatFileSize(bytes: Long): String {
        val mb = bytes / (1024.0 * 1024.0)
        return if (mb >= 1024) {
            String.format("%.2f GB", mb / 1024.0)
        } else {
            String.format("%.1f MB", mb)
        }
    }

    fun isReady(): Boolean = isInitialized && llmInference != null

    fun close() {
        try {
            llmInference?.close()
        } catch (_: Exception) {}
        llmInference = null
        isInitialized = false
    }
}