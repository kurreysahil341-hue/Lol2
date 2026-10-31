package com.heysheri.assistant.speech

import android.content.Context
import android.util.Log
import org.json.JSONObject
import org.vosk.Model
import org.vosk.Recognizer
import org.vosk.android.RecognitionListener
import org.vosk.android.SpeechService
import org.vosk.android.StorageService
import java.io.IOException

class VoskSpeechManager(
    private val context: Context,
    private val listener: VoskListener
) : RecognitionListener {

    companion object {
        private const val TAG = "VoskSpeechManager"
        private const val SAMPLE_RATE = 16000.0f
        private const val ASSETS_MODEL_DIR = "model-en-us"
        private const val TARGET_MODEL_NAME = "model"
        val WAKE_WORDS = listOf("hey sheri", "hey sherry", "sheri", "sherry")
    }

    interface VoskListener {
        fun onModelLoading()
        fun onModelReady()
        fun onModelError(error: String)
        fun onListeningStarted()
        fun onListeningStopped()
        fun onWakeWordDetected(fullText: String)
        fun onPartialSpeech(partialText: String)
        fun onFinalSpeech(recognizedText: String)
    }

    private var voskModel: Model? = null
    private var speechService: SpeechService? = null
    private var isModelLoaded: Boolean = false

    fun initModel() {
        listener.onModelLoading()
        
        StorageService.unpack(
            context,
            ASSETS_MODEL_DIR,
            TARGET_MODEL_NAME,
            { model: Model ->
                voskModel = model
                isModelLoaded = true
                Log.d(TAG, "Vosk model unpacked and initialized successfully.")
                listener.onModelReady()
            },
            { exception: IOException ->
                val errorMsg = "Failed to unpack Vosk model: ${exception.localizedMessage}"
                Log.e(TAG, errorMsg, exception)
                listener.onModelError(errorMsg)
            }
        )
    }

    fun startListening() {
        if (!isModelLoaded || voskModel == null) {
            listener.onModelError("Vosk model not loaded yet.")
            return
        }

        if (speechService != null) return

        try {
            val recognizer = Recognizer(voskModel, SAMPLE_RATE)
            speechService = SpeechService(recognizer, SAMPLE_RATE).apply {
                startListening(this@VoskSpeechManager)
            }
            listener.onListeningStarted()
        } catch (e: Exception) {
            Log.e(TAG, "Error starting Vosk SpeechService", e)
            listener.onModelError("Failed to start listening: ${e.message}")
        }
    }

    fun stopListening() {
        speechService?.let {
            it.stop()
            it.shutdown()
            speechService = null
            listener.onListeningStopped()
        }
    }

    fun isListening(): Boolean = speechService != null

    override fun onPartialResult(hypothesis: String?) {
        hypothesis?.let { json ->
            try {
                val jsonObject = JSONObject(json)
                val partial = jsonObject.optString("partial", "").trim().lowercase()

                if (partial.isNotEmpty()) {
                    listener.onPartialSpeech(partial)
                    if (WAKE_WORDS.any { partial.contains(it) }) {
                        listener.onWakeWordDetected(partial)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error parsing partial result JSON", e)
            }
        }
    }

    override fun onResult(hypothesis: String?) {
        hypothesis?.let { json ->
            try {
                val jsonObject = JSONObject(json)
                val text = jsonObject.optString("text", "").trim()
                if (text.isNotEmpty()) {
                    listener.onFinalSpeech(text)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error parsing result JSON", e)
            }
        }
    }

    override fun onFinalResult(hypothesis: String?) {
        onResult(hypothesis)
    }

    override fun onError(exception: java.lang.Exception?) {
        Log.e(TAG, "Vosk recognition error", exception)
        listener.onModelError(exception?.localizedMessage ?: "Unknown speech error")
    }

    override fun onTimeout() {
        speechService?.startListening(this)
    }

    fun onDestroy() {
        stopListening()
        voskModel = null
    }
}