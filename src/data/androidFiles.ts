export interface AndroidFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
  isPrimary?: boolean;
}

export const ACTIVITY_MAIN_XML = `<?xml version="1.0" encoding="utf-8"?>
<!--
    Project: Hey Sheri Voice Assistant
    Layout: res/layout/activity_main.xml
    Theme: Modern Minimalist High-Tech Dark Mode
-->
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/rootLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/bg_dark"
    android:fitsSystemWindows="true">

    <!-- ========================================================= -->
    <!-- 1. STATUS HEADER: Horizontal Top Layout with Indicators   -->
    <!-- ========================================================= -->
    <LinearLayout
        android:id="@+id/layoutStatusHeader"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="20dp"
        android:layout_marginTop="28dp"
        android:layout_marginEnd="20dp"
        android:baselineAligned="false"
        android:gravity="center_vertical"
        android:orientation="horizontal"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent">

        <!-- Foreground Service Status Indicator ("Hey Sheri Active") -->
        <LinearLayout
            android:id="@+id/layoutServiceStatus"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginEnd="6dp"
            android:layout_weight="1"
            android:background="@drawable/bg_status_badge"
            android:gravity="center_vertical"
            android:orientation="horizontal"
            android:paddingStart="12dp"
            android:paddingTop="9dp"
            android:paddingEnd="12dp"
            android:paddingBottom="9dp">

            <!-- Small Green Status Dot Indicator -->
            <View
                android:id="@+id/dotServiceStatus"
                android:layout_width="8dp"
                android:layout_height="8dp"
                android:layout_marginEnd="8dp"
                android:background="@drawable/bg_dot_active" />

            <TextView
                android:id="@+id/tvServiceStatus"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:fontFamily="sans-serif-medium"
                android:maxLines="1"
                android:text="@string/status_service_active"
                android:textColor="@color/text_primary"
                android:textSize="12sp" />
        </LinearLayout>

        <!-- Offline Status Indicator ("Offline Mode Enabled") -->
        <LinearLayout
            android:id="@+id/layoutOfflineStatus"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="6dp"
            android:layout_weight="1"
            android:background="@drawable/bg_status_badge"
            android:gravity="center_vertical"
            android:orientation="horizontal"
            android:paddingStart="12dp"
            android:paddingTop="9dp"
            android:paddingEnd="12dp"
            android:paddingBottom="9dp">

            <!-- Offline Status Shield / Bolt Icon -->
            <ImageView
                android:id="@+id/ivOfflineStatus"
                android:layout_width="14dp"
                android:layout_height="14dp"
                android:layout_marginEnd="8dp"
                android:contentDescription="@string/desc_offline_indicator"
                android:src="@drawable/ic_offline_bolt"
                app:tint="@color/accent_cyan" />

            <TextView
                android:id="@+id/tvOfflineStatus"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:fontFamily="sans-serif-medium"
                android:maxLines="1"
                android:text="@string/status_offline_mode"
                android:textColor="@color/text_secondary"
                android:textSize="12sp" />
        </LinearLayout>
    </LinearLayout>

    <!-- ========================================================= -->
    <!-- 2. MAIN CENTER VIEW: Large Mic & Visualizer Wave Area     -->
    <!-- ========================================================= -->
    <FrameLayout
        android:id="@+id/layoutMicContainer"
        android:layout_width="260dp"
        android:layout_height="260dp"
        app:layout_constraintBottom_toTopOf="@id/tvListeningPrompt"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/layoutStatusHeader"
        app:layout_constraintVertical_bias="0.46"
        app:layout_constraintVertical_chainStyle="packed">

        <!-- Outer Ambient Visualizer Wave Ring (Expands & pulses) -->
        <View
            android:id="@+id/viewWaveOuter"
            android:layout_width="250dp"
            android:layout_height="250dp"
            android:layout_gravity="center"
            android:alpha="0.25"
            android:background="@drawable/bg_wave_ring_outer" />

        <!-- Inner Ambient Visualizer Wave Ring -->
        <View
            android:id="@+id/viewWaveInner"
            android:layout_width="190dp"
            android:layout_height="190dp"
            android:layout_gravity="center"
            android:alpha="0.55"
            android:background="@drawable/bg_wave_ring_inner" />

        <!-- Voice Visualizer Wave Animation Placeholder / Waveform Canvas -->
        <View
            android:id="@+id/visualizerWavePlaceholder"
            android:layout_width="140dp"
            android:layout_height="140dp"
            android:layout_gravity="center"
            android:background="@drawable/bg_visualizer_wave" />

        <!-- Prominent Large Circular Mic Button -->
        <com.google.android.material.floatingactionbutton.FloatingActionButton
            android:id="@+id/btnMic"
            android:layout_width="92dp"
            android:layout_height="92dp"
            android:layout_gravity="center"
            android:contentDescription="@string/desc_voice_assistant_mic"
            app:backgroundTint="@color/accent_cyan"
            app:elevation="10dp"
            app:fabCustomSize="92dp"
            app:maxImageSize="40dp"
            app:rippleColor="@color/accent_cyan_glow"
            app:srcCompat="@drawable/ic_mic"
            app:tint="@color/bg_dark" />
    </FrameLayout>

    <!-- Listening Prompt Text Below the Mic -->
    <TextView
        android:id="@+id/tvListeningPrompt"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="32dp"
        android:layout_marginTop="24dp"
        android:layout_marginEnd="32dp"
        android:gravity="center"
        android:letterSpacing="0.02"
        android:text="@string/prompt_listening"
        android:textColor="@color/text_primary"
        android:textSize="18sp"
        android:fontFamily="sans-serif-medium"
        app:layout_constraintBottom_toTopOf="@id/tvVoiceHint"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/layoutMicContainer" />

    <!-- Secondary Command Hint -->
    <TextView
        android:id="@+id/tvVoiceHint"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="6dp"
        android:gravity="center"
        android:text="@string/hint_voice_commands"
        android:textColor="@color/text_muted"
        android:textSize="13sp"
        android:fontFamily="sans-serif"
        app:layout_constraintBottom_toTopOf="@id/layoutBottomNav"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/tvListeningPrompt" />

    <!-- ========================================================= -->
    <!-- 3. NAVIGATION / ACTION BUTTONS: Home & Settings           -->
    <!-- (Strictly Home & Settings - No Maps button)               -->
    <!-- ========================================================= -->
    <androidx.constraintlayout.widget.ConstraintLayout
        android:id="@+id/layoutBottomNav"
        android:layout_width="0dp"
        android:layout_height="64dp"
        android:layout_marginStart="24dp"
        android:layout_marginEnd="24dp"
        android:layout_marginBottom="28dp"
        android:background="@drawable/bg_bottom_nav_bar"
        android:paddingStart="40dp"
        android:paddingEnd="40dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent">

        <!-- Home Action Button -->
        <ImageButton
            android:id="@+id/btnNavHome"
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:contentDescription="@string/desc_nav_home"
            android:src="@drawable/ic_nav_home"
            app:tint="@color/accent_cyan"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

        <!-- Settings Action Button -->
        <ImageButton
            android:id="@+id/btnNavSettings"
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:contentDescription="@string/desc_nav_settings"
            android:src="@drawable/ic_nav_settings"
            app:tint="@color/text_secondary"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

    </androidx.constraintlayout.widget.ConstraintLayout>

</androidx.constraintlayout.widget.ConstraintLayout>`;

export const CONTACT_CALL_HELPER_KT = `package com.heysheri.assistant.calling

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.provider.ContactsContract
import android.util.Log
import androidx.core.content.ContextCompat

/**
 * ContactCallHelper:
 * 1. Supports Multiple Contacts & Numbers Disambiguation
 * 2. Parses "Number batao" / "Get number" queries to retrieve & speak numbers
 * 3. Direct phone calling via Intent.ACTION_CALL
 */
class ContactCallHelper(private val context: Context) {

    companion object {
        private const val TAG = "ContactCallHelper"

        // 1. Calling Intent patterns (English + Hinglish): e.g. "call Rahul", "Rahul ko call karo"
        private val CALL_TRIGGER_REGEX = Regex(
            """(?i)(?:hey\s+sheri\s+|hey\s+sherry\s+)?(?:please\s+)?(?:call|dial|phone|make\s+a\s+call\s+to|ko\s+call\s+lagao|ko\s+call\s+karo)\s+(.+)"""
        )
        private val CALL_HINDI_POSTFIX_REGEX = Regex(
            """(?i)(?:hey\s+sheri\s+|hey\s+sherry\s+)?(.+?)\s+(?:ko\s+call\s+(?:karo|lagao)|ko\s+phone\s+lagao)"""
        )

        // 2. Info Query Intent patterns ("Number batao" / "Get number" / "Phone number kya hai")
        private val NUMBER_INFO_REGEX = Regex(
            """(?i)(?:hey\s+sheri\s+|hey\s+sherry\s+)?(?:(?:get|tell\s+me|what\s+is|show\s+me)\s+)?(.+?)(?:(?:'s|\s+ka|\s+ki)\s+(?:contact|number|phone\s+number|mobile))(?:\s+(?:batao|bataiye|kya\s+hai|do))?"""
        )
    }

    data class ContactMatch(
        val displayName: String,
        val phoneNumber: String,
        val typeLabel: String,
        val isDirectNumber: Boolean = false
    )

    enum class ParsedAction {
        CALL,
        GET_NUMBER
    }

    data class ParsedIntent(
        val action: ParsedAction,
        val contactName: String
    )

    sealed class CallResolution {
        data class SingleMatch(val contact: ContactMatch) : CallResolution()
        data class MultipleMatches(val contactName: String, val matches: List<ContactMatch>) : CallResolution()
        data class NotFound(val queryName: String) : CallResolution()
        data class PermissionRequired(val permission: String) : CallResolution()
        data class Error(val message: String) : CallResolution()
    }

    /**
     * Requirement 2: Detect whether user wants to Call or just get the Contact Info ("Number batao").
     */
    fun parseContactIntent(spokenText: String): ParsedIntent? {
        val trimmed = spokenText.trim()

        // 1. Check for "Number batao" / "Get number" patterns
        val infoMatch = NUMBER_INFO_REGEX.find(trimmed)
        if (infoMatch != null) {
            val name = infoMatch.groupValues[1]
                .replace(Regex("""(?i)^(please|kripya)\s+"""), "")
                .trim()
            if (name.isNotEmpty()) {
                return ParsedIntent(ParsedAction.GET_NUMBER, name)
            }
        }

        // 2. Check for Hindi postfix: "Rahul ko call lagao"
        val hindiCallMatch = CALL_HINDI_POSTFIX_REGEX.find(trimmed)
        if (hindiCallMatch != null) {
            val name = hindiCallMatch.groupValues[1].trim()
            if (name.isNotEmpty()) {
                return ParsedIntent(ParsedAction.CALL, name)
            }
        }

        // 3. Check for standard "Call Rahul" prefix patterns
        val callMatch = CALL_TRIGGER_REGEX.find(trimmed)
        if (callMatch != null) {
            var name = callMatch.groupValues[1].trim()
            name = name.replace(Regex("""(?i)\s+(please|now|urgently|karo|lagao)$"""), "").trim()
            if (name.isNotEmpty()) {
                return ParsedIntent(ParsedAction.CALL, name)
            }
        }

        return null
    }

    /**
     * Requirement 1: Query ContactsContract and retrieve ALL matching contacts / phone numbers.
     */
    fun findAllContactsByName(contactName: String): List<ContactMatch> {
        val digitsOnly = contactName.filter { it.isDigit() || it == '+' }
        if (digitsOnly.length >= 7) {
            return listOf(
                ContactMatch(
                    displayName = digitsOnly,
                    phoneNumber = digitsOnly,
                    typeLabel = "Direct Number",
                    isDirectNumber = true
                )
            )
        }

        if (ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.READ_CONTACTS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            Log.w(TAG, "READ_CONTACTS permission not granted")
            return emptyList()
        }

        val contentResolver = context.contentResolver
        val uri = ContactsContract.CommonDataKinds.Phone.CONTENT_URI
        val projection = arrayOf(
            ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
            ContactsContract.CommonDataKinds.Phone.NUMBER,
            ContactsContract.CommonDataKinds.Phone.TYPE
        )

        val selection = "\${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} LIKE ?"
        val selectionArgs = arrayOf("%$contactName%")
        val sortOrder = "\${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} ASC"

        val matches = mutableListOf<ContactMatch>()
        var cursor: Cursor? = null

        try {
            cursor = contentResolver.query(uri, projection, selection, selectionArgs, sortOrder)
            cursor?.let {
                val nameIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
                val numberIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
                val typeIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.TYPE)

                while (it.moveToNext()) {
                    val name = it.getString(nameIndex) ?: contactName
                    val number = it.getString(numberIndex) ?: ""
                    val typeInt = it.getInt(typeIndex)
                    val label = when (typeInt) {
                        ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE -> "Mobile"
                        ContactsContract.CommonDataKinds.Phone.TYPE_HOME -> "Home"
                        ContactsContract.CommonDataKinds.Phone.TYPE_WORK -> "Work"
                        else -> "Other"
                    }

                    if (number.isNotEmpty()) {
                        // Avoid duplicates
                        if (matches.none { m -> m.phoneNumber == number }) {
                            matches.add(ContactMatch(name, number, label))
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error querying ContactsContract", e)
        } finally {
            cursor?.close()
        }

        return matches
    }

    /**
     * Resolves contact matching and flags multiple numbers for disambiguation.
     */
    fun resolveContactForCall(contactName: String): CallResolution {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CONTACTS) 
            != PackageManager.PERMISSION_GRANTED) {
            return CallResolution.PermissionRequired(Manifest.permission.READ_CONTACTS)
        }

        val matches = findAllContactsByName(contactName)
        return when {
            matches.isEmpty() -> CallResolution.NotFound(contactName)
            matches.size == 1 -> CallResolution.SingleMatch(matches.first())
            else -> CallResolution.MultipleMatches(contactName, matches)
        }
    }

    /**
     * Requirement 1 Disambiguation Choice Resolver:
     * Resolves user follow-up reply (e.g. "mobile", "work", "first", "second", "1", "2").
     */
    fun resolveDisambiguationChoice(
        userInput: String,
        pendingList: List<ContactMatch>
    ): ContactMatch? {
        val input = userInput.trim().lowercase()

        // Match by type label (Mobile, Work, Home)
        pendingList.firstOrNull { input.contains(it.typeLabel.lowercase()) }?.let {
            return it
        }

        // Match by ordinal or index
        if (input.contains("first") || input.contains("1") || input.contains("one") || input.contains("pehla")) {
            return pendingList.getOrNull(0)
        }
        if (input.contains("second") || input.contains("2") || input.contains("two") || input.contains("doosra")) {
            return pendingList.getOrNull(1)
        }
        if (input.contains("third") || input.contains("3") || input.contains("three") || input.contains("teesra")) {
            return pendingList.getOrNull(2)
        }

        // Match by specific full name if multiple contacts have different surnames
        pendingList.firstOrNull { input.contains(it.displayName.lowercase()) }?.let {
            return it
        }

        return null
    }

    /**
     * Requirement 5: Trigger Intent.ACTION_CALL directly
     */
    fun makePhoneCall(phoneNumber: String): Boolean {
        if (ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CALL_PHONE
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            Log.w(TAG, "CALL_PHONE permission not granted")
            return false
        }

        return try {
            val cleanNumber = phoneNumber.replace(Regex("[^0-9+]"), "")
            val callIntent = Intent(Intent.ACTION_CALL).apply {
                data = Uri.parse("tel:$cleanNumber")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(callIntent)
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start ACTION_CALL intent", e)
            false
        }
    }
}`;

export const INTENT_ROUTER_KT = `package com.heysheri.assistant.router

import com.heysheri.assistant.calling.ContactCallHelper

/**
 * IntentRouter:
 * Categorizes voice commands into:
 * 1. Call -> Initiate direct phone call
 * 2. GetContactNumber -> "Number batao" info retrieval via TTS
 * 3. LlmQuery -> Local MediaPipe Gemma LLM query
 */
class IntentRouter(private val contactHelper: ContactCallHelper) {

    sealed class Route {
        data class Call(val contactName: String, val rawText: String) : Route()
        data class GetContactNumber(val contactName: String, val rawText: String) : Route()
        data class LlmQuery(val cleanedPrompt: String) : Route()
    }

    fun route(spokenText: String): Route {
        // 1. Check for Contact Action (Call or "Number batao")
        val parsed = contactHelper.parseContactIntent(spokenText)
        if (parsed != null) {
            return when (parsed.action) {
                ContactCallHelper.ParsedAction.CALL -> 
                    Route.Call(parsed.contactName, spokenText)
                ContactCallHelper.ParsedAction.GET_NUMBER -> 
                    Route.GetContactNumber(parsed.contactName, spokenText)
            }
        }

        // 2. Otherwise route to Local LLM
        val normalized = spokenText.trim().lowercase()
        val stripped = normalized
            .replace(Regex("""^(hey\s+sheri|hey\s+sherry|sheri)\s*"""), "")
            .trim()

        return Route.LlmQuery(if (stripped.isNotEmpty()) stripped else spokenText)
    }
}`;

export const LOCAL_LLM_MANAGER_KT = `package com.heysheri.assistant.llm

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
                listener.onModelError("LLM Init Error: \${e.localizedMessage}")
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
                Log.d(TAG, "Found user imported model: \${file.absolutePath} (\${file.length()} bytes)")
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
                Log.d(TAG, "Found model directly in Downloads folder: \${downloadMatch.absolutePath}")
                return downloadMatch
            }

            val anyLlmInDownload = downloadFolder.listFiles { _, name ->
                name.contains("gemma", true) || name.contains("llama", true)
            }?.firstOrNull { it.extension.lowercase() in listOf("bin", "task") && it.length() > MIN_MODEL_SIZE_BYTES }
            
            if (anyLlmInDownload != null) {
                Log.d(TAG, "Discovered LLM model in Downloads: \${anyLlmInDownload.absolutePath}")
                return anyLlmInDownload
            }
        }

        // 5. Try unpacking from APK assets if bundled
        try {
            val assetList = context.assets.list("") ?: emptyArray()
            if (assetList.contains(DEFAULT_MODEL_NAME)) {
                Log.d(TAG, "Unpacking model bundled in APK assets: \$DEFAULT_MODEL_NAME")
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
            var fileName = "imported_llm_\${System.currentTimeMillis()}.bin"
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
                    Exception("Imported file is too small (\${targetFile.length() / (1024 * 1024)} MB). Gemma/Llama models are typically 1 to 2 GB.")
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

            Log.i(TAG, "Model successfully imported and initialized: \${info.name} (\${info.sizeFormatted})")
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
        Log.i(TAG, "LlmInference loaded successfully from: \${modelFile.absolutePath}")
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
}`;

export const TTS_SPEECH_HELPER_KT = `package com.heysheri.assistant.tts

import android.content.Context
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

class TtsSpeechHelper(
    private val context: Context,
    private val onInitComplete: (Boolean) -> Unit
) : TextToSpeech.OnInitListener {

    companion object {
        private const val TAG = "TtsSpeechHelper"
        private const val UTTERANCE_ID = "SHERI_VOICE_REPLY"
    }

    interface TtsListener {
        fun onSpeechStarted()
        fun onSpeechDone()
        fun onSpeechError(error: String)
    }

    private var textToSpeech: TextToSpeech? = null
    private var isReady = false
    private var speechListener: TtsListener? = null

    init {
        textToSpeech = TextToSpeech(context, this)
    }

    fun setSpeechListener(listener: TtsListener) {
        this.speechListener = listener
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = textToSpeech?.setLanguage(Locale.US)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                isReady = false
                onInitComplete(false)
            } else {
                textToSpeech?.setPitch(1.05f)
                textToSpeech?.setSpeechRate(1.02f)
                setupUtteranceListener()
                isReady = true
                onInitComplete(true)
            }
        } else {
            isReady = false
            onInitComplete(false)
        }
    }

    private fun setupUtteranceListener() {
        textToSpeech?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                speechListener?.onSpeechStarted()
            }
            override fun onDone(utteranceId: String?) {
                speechListener?.onSpeechDone()
            }
            @Deprecated("Deprecated in Java")
            override fun onError(utteranceId: String?) {
                speechListener?.onSpeechError("TTS speech error")
            }
        })
    }

    fun speak(text: String, queueMode: Int = TextToSpeech.QUEUE_FLUSH) {
        if (!isReady || textToSpeech == null) return

        val params = Bundle().apply {
            putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, UTTERANCE_ID)
        }
        textToSpeech?.speak(text, queueMode, params, UTTERANCE_ID)
    }

    fun stop() {
        textToSpeech?.stop()
    }

    fun shutdown() {
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
        isReady = false
    }
}`;

export const VOSK_SPEECH_MANAGER_KT = `package com.heysheri.assistant.speech

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
                val errorMsg = "Failed to unpack Vosk model: \${exception.localizedMessage}"
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
            listener.onModelError("Failed to start listening: \${e.message}")
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
}`;

export const SHERI_VOICE_SERVICE_KT = `package com.heysheri.assistant.speech

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.heysheri.assistant.MainActivity
import com.heysheri.assistant.R

/**
 * SheriVoiceService:
 * Continuous background Foreground Service for "Hey Sheri" Voice Assistant.
 * 
 * Features:
 * 1. Hosts VoskSpeechManager to keep microphone listening active in background.
 * 2. Persistent status notification: "Sheri is listening in background...".
 * 3. Prominent "Stop Sheri" / "Exit" action button inside notification to completely stop the service.
 * 4. Full Android version compatibility: API 21+ through Android 14+ (FOREGROUND_SERVICE_MICROPHONE).
 * 5. Dispatches broadcast events (wake-word, speech results, status) to MainActivity.
 */
class SheriVoiceService : Service(), VoskSpeechManager.VoskListener {

    companion object {
        private const val TAG = "SheriVoiceService"
        const val CHANNEL_ID = "sheri_voice_service_channel"
        const val NOTIFICATION_ID = 2001

        // Intent Actions
        const val ACTION_START = "com.heysheri.assistant.action.START_SERVICE"
        const val ACTION_STOP = "com.heysheri.assistant.action.STOP_SERVICE"
        const val ACTION_PAUSE = "com.heysheri.assistant.action.PAUSE_LISTENING"
        const val ACTION_RESUME = "com.heysheri.assistant.action.RESUME_LISTENING"

        // Broadcast to Activity
        const val BROADCAST_SPEECH_EVENT = "com.heysheri.assistant.broadcast.SPEECH_EVENT"
        const val EXTRA_EVENT_TYPE = "event_type"
        const val EXTRA_PAYLOAD_TEXT = "payload_text"

        const val EVENT_WAKE_WORD = "wake_word"
        const val EVENT_PARTIAL_SPEECH = "partial_speech"
        const val EVENT_FINAL_SPEECH = "final_speech"
        const val EVENT_STATUS_CHANGED = "status_changed"
        const val EVENT_SERVICE_STOPPED = "service_stopped"
        const val EXTRA_IS_LISTENING = "is_listening"

        fun start(context: Context) {
            val intent = Intent(context, SheriVoiceService::class.java).apply {
                action = ACTION_START
            }
            ContextCompat.startForegroundService(context, intent)
        }

        fun stop(context: Context) {
            val intent = Intent(context, SheriVoiceService::class.java).apply {
                action = ACTION_STOP
            }
            context.startService(intent)
        }
    }

    private var voskManager: VoskSpeechManager? = null
    private var isListeningActive = false

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "SheriVoiceService onCreate")
        createNotificationChannel()
        voskManager = VoskSpeechManager(this, this)
        voskManager?.initModel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: ACTION_START
        Log.d(TAG, "SheriVoiceService onStartCommand: $action")

        when (action) {
            ACTION_STOP -> {
                Log.d(TAG, "Stop Sheri requested via notification or UI")
                stopListeningAndExit()
                return START_NOT_STICKY
            }
            ACTION_PAUSE -> {
                voskManager?.stopListening()
                isListeningActive = false
                updateNotification("Sheri is paused. Tap mic to resume.")
                broadcastStatus(false)
            }
            ACTION_RESUME, ACTION_START -> {
                startForegroundNotification()
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                    voskManager?.startListening()
                    isListeningActive = true
                    broadcastStatus(true)
                }
            }
        }

        return START_STICKY
    }

    private fun startForegroundNotification() {
        val notification = buildPersistentNotification("Sheri is listening in background...")

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // API 29+ and Android 14+ (API 34+) requires microphone foreground service type
                startForeground(
                    NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE
                )
            } else {
                startForeground(NOTIFICATION_ID, notification)
            }
        } catch (e: Exception) {
            Log.e(TAG, "startForeground with MICROPHONE type fallback", e)
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun buildPersistentNotification(contentText: String): Notification {
        // 1. Content Intent: Launch MainActivity on tap
        val contentIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }
        val pendingContentIntent = PendingIntent.getActivity(this, 0, contentIntent, flags)

        // 2. Action Intent: "Stop Sheri" / "Exit"
        val stopIntent = Intent(this, SheriVoiceService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(this, 1, stopIntent, flags)

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_mic)
            .setContentTitle("Hey Sheri Voice Assistant")
            .setContentText(contentText)
            .setStyle(NotificationCompat.BigTextStyle().bigText(contentText))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setOngoing(true)
            .setAutoCancel(false)
            .setContentIntent(pendingContentIntent)
            .addAction(
                R.drawable.ic_offline_bolt,
                "Stop Sheri",
                stopPendingIntent
            )
            .build()
    }

    private fun updateNotification(newText: String) {
        val notification = buildPersistentNotification(newText)
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelName = "Hey Sheri Background Listener"
            val channelDesc = "Keeps Hey Sheri offline speech recognition active in background"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, channelName, importance).apply {
                description = channelDesc
                setShowBadge(false)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun stopListeningAndExit() {
        isListeningActive = false
        voskManager?.stopListening()
        voskManager?.onDestroy()
        voskManager = null

        // Broadcast to Activity so UI updates immediately
        val intent = Intent(BROADCAST_SPEECH_EVENT).apply {
            putExtra(EXTRA_EVENT_TYPE, EVENT_SERVICE_STOPPED)
            putExtra(EXTRA_IS_LISTENING, false)
        }
        sendBroadcast(intent)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE)
        } else {
            @Suppress("DEPRECATION")
            stopForeground(true)
        }
        stopSelf()
    }

    // --- Vosk Callbacks ---
    override fun onModelLoading() {
        updateNotification("Loading offline voice model…")
    }

    override fun onModelReady() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
            voskManager?.startListening()
            isListeningActive = true
            updateNotification("Sheri is listening in background...")
            broadcastStatus(true)
        }
    }

    override fun onModelError(error: String) {
        Log.e(TAG, "Vosk Model Error: $error")
        updateNotification("Voice Error: $error")
    }

    override fun onListeningStarted() {
        isListeningActive = true
        updateNotification("Sheri is listening in background...")
        broadcastStatus(true)
    }

    override fun onListeningStopped() {
        isListeningActive = false
        broadcastStatus(false)
    }

    override fun onWakeWordDetected(fullText: String) {
        Log.d(TAG, "Wake word detected in background: $fullText")
        val intent = Intent(BROADCAST_SPEECH_EVENT).apply {
            putExtra(EXTRA_EVENT_TYPE, EVENT_WAKE_WORD)
            putExtra(EXTRA_PAYLOAD_TEXT, fullText)
        }
        sendBroadcast(intent)
    }

    override fun onPartialSpeech(partialText: String) {
        val intent = Intent(BROADCAST_SPEECH_EVENT).apply {
            putExtra(EXTRA_EVENT_TYPE, EVENT_PARTIAL_SPEECH)
            putExtra(EXTRA_PAYLOAD_TEXT, partialText)
        }
        sendBroadcast(intent)
    }

    override fun onFinalSpeech(recognizedText: String) {
        Log.d(TAG, "Final speech recognized: $recognizedText")
        val intent = Intent(BROADCAST_SPEECH_EVENT).apply {
            putExtra(EXTRA_EVENT_TYPE, EVENT_FINAL_SPEECH)
            putExtra(EXTRA_PAYLOAD_TEXT, recognizedText)
        }
        sendBroadcast(intent)
    }

    private fun broadcastStatus(listening: Boolean) {
        val intent = Intent(BROADCAST_SPEECH_EVENT).apply {
            putExtra(EXTRA_EVENT_TYPE, EVENT_STATUS_CHANGED)
            putExtra(EXTRA_IS_LISTENING, listening)
        }
        sendBroadcast(intent)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "SheriVoiceService onDestroy")
        stopListeningAndExit()
    }
}
`;

export const MAIN_ACTIVITY_KT = `package com.heysheri.assistant

import android.Manifest
import android.animation.ObjectAnimator
import android.animation.PropertyValuesHolder
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.heysheri.assistant.calling.ContactCallHelper
import com.heysheri.assistant.databinding.ActivityMainBinding
import com.heysheri.assistant.llm.LocalLlmManager
import com.heysheri.assistant.router.IntentRouter
import com.heysheri.assistant.speech.SheriVoiceService
import com.heysheri.assistant.tts.TtsSpeechHelper
import kotlinx.coroutines.launch

/**
 * MainActivity for "Hey Sheri" Voice Assistant
 * 
 * Features:
 * 1. Hosts Foreground Service lifecycle for continuous background voice listening.
 * 2. Receives broadcast events from SheriVoiceService (wake-word, speech, stop events).
 * 3. Smart Intent Routing (Phone calling with multi-match disambiguation, "Number batao" readout, Local LLM query).
 * 4. High-tech minimalist dark UI with interactive mic wave visualizer and persistent status controls.
 */
class MainActivity : AppCompatActivity(), 
    LocalLlmManager.LlmListener,
    TtsSpeechHelper.TtsListener {

    private lateinit var binding: ActivityMainBinding
    private lateinit var contactCallHelper: ContactCallHelper
    private lateinit var localLlmManager: LocalLlmManager
    private lateinit var ttsHelper: TtsSpeechHelper
    private lateinit var intentRouter: IntentRouter

    private var waveAnimator: ObjectAnimator? = null
    private var isServiceActive = true
    private var isOfflineMode = true

    // State for interactive contact disambiguation
    private var pendingDisambiguationMatches: List<ContactCallHelper.ContactMatch>? = null

    // File picker launcher to import downloaded Gemma/Llama models (.bin / .task)
    private val importModelLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        uri?.let { handleModelImport(it) }
    }

    // BroadcastReceiver for events dispatched by SheriVoiceService
    private val speechEventReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == SheriVoiceService.BROADCAST_SPEECH_EVENT) {
                val eventType = intent.getStringExtra(SheriVoiceService.EXTRA_EVENT_TYPE)
                val payloadText = intent.getStringExtra(SheriVoiceService.EXTRA_PAYLOAD_TEXT) ?: ""

                when (eventType) {
                    SheriVoiceService.EVENT_WAKE_WORD -> {
                        onWakeWordDetected(payloadText)
                    }
                    SheriVoiceService.EVENT_PARTIAL_SPEECH -> {
                        binding.tvVoiceHint.text = "\\"\$payloadText\\""
                    }
                    SheriVoiceService.EVENT_FINAL_SPEECH -> {
                        handleRecognizedSpeech(payloadText)
                    }
                    SheriVoiceService.EVENT_STATUS_CHANGED -> {
                        val listening = intent.getBooleanExtra(SheriVoiceService.EXTRA_IS_LISTENING, false)
                        updateListeningUI(listening)
                    }
                    SheriVoiceService.EVENT_SERVICE_STOPPED -> {
                        // User clicked "Stop Sheri" in the notification bar or paused it
                        isServiceActive = false
                        binding.dotServiceStatus.setBackgroundResource(R.drawable.bg_dot_inactive)
                        binding.tvServiceStatus.text = getString(R.string.status_service_paused)
                        binding.tvListeningPrompt.text = "Hey Sheri stopped from notification"
                        binding.tvVoiceHint.text = "Tap status indicator to restart service"
                        waveAnimator?.cancel()
                    }
                }
            }
        }
    }

    private val requestPermissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val recordAudioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        if (recordAudioGranted) {
            SheriVoiceService.start(this)
            updateServiceStatusUI(true)
        } else {
            binding.tvListeningPrompt.text = "Microphone access required"
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        setupWaveAnimation()

        contactCallHelper = ContactCallHelper(this)
        intentRouter = IntentRouter(contactCallHelper)
        localLlmManager = LocalLlmManager(this)

        ttsHelper = TtsSpeechHelper(this) { success ->
            if (success) ttsHelper.setSpeechListener(this)
        }

        lifecycleScope.launch {
            localLlmManager.initialize(this@MainActivity)
        }

        registerSpeechReceiver()
        requestRequiredPermissions()
    }

    private fun registerSpeechReceiver() {
        val filter = IntentFilter(SheriVoiceService.BROADCAST_SPEECH_EVENT)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(speechEventReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(speechEventReceiver, filter)
        }
    }

    private fun requestRequiredPermissions() {
        val permissions = mutableListOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CALL_PHONE,
            Manifest.permission.READ_CONTACTS
        )

        // Android 13+ (API 33+) requires POST_NOTIFICATIONS for foreground service notification
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val missing = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (missing.isEmpty()) {
            SheriVoiceService.start(this)
            updateServiceStatusUI(true)
        } else {
            requestPermissionsLauncher.launch(missing.toTypedArray())
        }
    }

    private fun setupUI() {
        binding.btnMic.setOnClickListener {
            if (isServiceActive) {
                // Pause service or re-trigger listening
                ttsHelper.stop()
                pendingDisambiguationMatches = null
                val resumeIntent = Intent(this, SheriVoiceService::class.java).apply {
                    action = SheriVoiceService.ACTION_RESUME
                }
                startService(resumeIntent)
                updateListeningUI(true)
            } else {
                // Restart Foreground Service
                SheriVoiceService.start(this)
                updateServiceStatusUI(true)
            }
        }

        binding.layoutServiceStatus.setOnClickListener {
            isServiceActive = !isServiceActive
            if (isServiceActive) {
                SheriVoiceService.start(this)
                updateServiceStatusUI(true)
            } else {
                SheriVoiceService.stop(this)
                updateServiceStatusUI(false)
                ttsHelper.stop()
            }
        }

        binding.layoutOfflineStatus.setOnClickListener {
            isOfflineMode = !isOfflineMode
            binding.tvOfflineStatus.text = if (isOfflineMode) {
                getString(R.string.status_offline_mode)
            } else {
                "Cloud Hybrid Active"
            }
        }

        binding.btnNavHome.setOnClickListener {
            pendingDisambiguationMatches = null
            Toast.makeText(this, "Assistant Home", Toast.LENGTH_SHORT).show()
        }

        binding.btnNavSettings.setOnClickListener {
            openModelManagerDialog()
        }
    }

    /**
     * Requirement: LLM Model Manager & In-App Import Dialog
     */
    private fun openModelManagerDialog() {
        val modelInfo = localLlmManager.getActiveModelInfo()
        val status = if (modelInfo != null && modelInfo.isLoaded) {
            "Active Model: \${modelInfo.name} (\${modelInfo.sizeFormatted})"
        } else {
            "No offline LLM model loaded yet."
        }

        val message = """
            $status

            Supported Offline Models:
            • Google Gemma 2B INT4 (gemma-2b-it-cpu-int4.bin)
            • MediaPipe GenAI Tasks (.bin or .task format)

            Tap 'Import Model' to pick the model file you downloaded from Kaggle/HuggingFace.
        """.trimIndent()

        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Sheri Offline Brain (LLM)")
            .setMessage(message)
            .setPositiveButton("Import Model (.bin/.task)") { _, _ ->
                importModelLauncher.launch(arrayOf("*/*", "application/octet-stream"))
            }
            .setNeutralButton("Test Question") { _, _ ->
                handleLlmQuery("Who are you and what can you do offline?")
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    /**
     * Requirement: Buffered file import with streaming progress updates for 1-2 GB models
     */
    private fun handleModelImport(uri: Uri) {
        binding.tvListeningPrompt.text = "Importing model from storage…"
        binding.tvVoiceHint.text = "Preparing buffer copy (do not exit)…"
        waveAnimator?.start()

        lifecycleScope.launch(Dispatchers.IO) {
            val result = localLlmManager.importModelFromUri(uri) { copiedBytes, totalBytes, percent ->
                val copiedMb = copiedBytes / (1024 * 1024)
                val totalMb = totalBytes / (1024 * 1024)
                runOnUiThread {
                    binding.tvListeningPrompt.text = "Importing model: \$percent% (\$copiedMb MB / \$totalMb MB)"
                    binding.tvVoiceHint.text = "Copying model into app storage…"
                }
            }

            runOnUiThread {
                waveAnimator?.cancel()
                result.onSuccess { info ->
                    binding.tvListeningPrompt.text = "Model Ready: \${info.name}"
                    binding.tvVoiceHint.text = "Size: \${info.sizeFormatted} · On-device AI active"
                    val successMsg = "Sheri offline brain loaded successfully. You can now ask questions!"
                    ttsHelper.speak(successMsg)
                    Toast.makeText(this@MainActivity, "Model imported successfully!", Toast.LENGTH_LONG).show()
                }.onFailure { error ->
                    val errorMsg = "Import failed: \${error.localizedMessage}"
                    binding.tvListeningPrompt.text = errorMsg
                    binding.tvVoiceHint.text = "Please select a valid .bin or .task model"
                    Toast.makeText(this@MainActivity, errorMsg, Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun updateServiceStatusUI(active: Boolean) {
        isServiceActive = active
        if (active) {
            binding.dotServiceStatus.setBackgroundResource(R.drawable.bg_dot_active)
            binding.tvServiceStatus.text = getString(R.string.status_service_active)
            updateListeningUI(true)
        } else {
            binding.dotServiceStatus.setBackgroundResource(R.drawable.bg_dot_inactive)
            binding.tvServiceStatus.text = getString(R.string.status_service_paused)
            updateListeningUI(false)
        }
    }

    private fun updateListeningUI(listening: Boolean) {
        if (listening) {
            binding.tvListeningPrompt.text = getString(R.string.prompt_listening)
            binding.tvVoiceHint.text = "Say 'call <name>', 'number batao', or ask anything"
            waveAnimator?.start()
        } else {
            binding.tvListeningPrompt.text = getString(R.string.prompt_tap_to_speak)
            waveAnimator?.cancel()
        }
    }

    private fun setupWaveAnimation() {
        waveAnimator = ObjectAnimator.ofPropertyValuesHolder(
            binding.viewWaveOuter,
            PropertyValuesHolder.ofFloat(View.SCALE_X, 1.0f, 1.25f, 1.0f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, 1.0f, 1.25f, 1.0f),
            PropertyValuesHolder.ofFloat(View.ALPHA, 0.25f, 0.60f, 0.25f)
        ).apply {
            duration = 1800
            repeatCount = ObjectAnimator.INFINITE
            interpolator = AccelerateDecelerateInterpolator()
        }
    }

    // ========================================================
    // Voice Handling: Disambiguation, Calling, Query & LLM
    // ========================================================

    private fun onWakeWordDetected(fullText: String) {
        binding.tvListeningPrompt.text = "Sheri listening in background…"
        binding.viewWaveInner.animate().scaleX(1.35f).scaleY(1.35f).setDuration(220).withEndAction {
            binding.viewWaveInner.animate().scaleX(1.0f).scaleY(1.0f).setDuration(220).start()
        }.start()
    }

    private fun handleRecognizedSpeech(recognizedText: String) {
        binding.tvListeningPrompt.text = recognizedText

        // Step A: Disambiguation answer handling
        val pending = pendingDisambiguationMatches
        if (pending != null && pending.isNotEmpty()) {
            handleDisambiguationAnswer(recognizedText, pending)
            return
        }

        // Step B: Intent Routing
        when (val route = intentRouter.route(recognizedText)) {
            is IntentRouter.Route.Call -> {
                handleCallCommand(route.contactName)
            }
            is IntentRouter.Route.GetContactNumber -> {
                handleGetContactNumber(route.contactName)
            }
            is IntentRouter.Route.LlmQuery -> {
                handleLlmQuery(route.cleanedPrompt)
            }
        }
    }

    private fun handleCallCommand(contactName: String) {
        binding.tvVoiceHint.text = "Searching contacts for '\$contactName'…"

        when (val res = contactCallHelper.resolveContactForCall(contactName)) {
            is ContactCallHelper.CallResolution.SingleMatch -> {
                val callMsg = "Calling \${res.contact.displayName}"
                binding.tvListeningPrompt.text = callMsg
                binding.tvVoiceHint.text = "Dialing \${res.contact.phoneNumber} (\${res.contact.typeLabel})"
                ttsHelper.speak(callMsg)
                contactCallHelper.makePhoneCall(res.contact.phoneNumber)
            }
            is ContactCallHelper.CallResolution.MultipleMatches -> {
                pendingDisambiguationMatches = res.matches
                val labels = res.matches.map { it.typeLabel }.distinct().joinToString(" or ")
                val question = "Multiple numbers found for \${res.contactName}. Which one should I call: \$labels?"

                binding.tvListeningPrompt.text = question
                binding.tvVoiceHint.text = "Listening for your choice (\${labels})…"
                ttsHelper.speak(question)
            }
            is ContactCallHelper.CallResolution.NotFound -> {
                val notFound = "Sorry, no contact found for '\$contactName'."
                binding.tvListeningPrompt.text = notFound
                ttsHelper.speak(notFound)
            }
            is ContactCallHelper.CallResolution.PermissionRequired -> {
                requestRequiredPermissions()
            }
            is ContactCallHelper.CallResolution.Error -> {
                binding.tvVoiceHint.text = res.message
            }
        }
    }

    private fun handleDisambiguationAnswer(
        userAnswer: String,
        pendingList: List<ContactCallHelper.ContactMatch>
    ) {
        val selected = contactCallHelper.resolveDisambiguationChoice(userAnswer, pendingList)
        if (selected != null) {
            pendingDisambiguationMatches = null
            val callMsg = "Calling \${selected.displayName} on \${selected.typeLabel}"
            binding.tvListeningPrompt.text = callMsg
            binding.tvVoiceHint.text = "Dialing \${selected.phoneNumber}"
            ttsHelper.speak(callMsg)
            contactCallHelper.makePhoneCall(selected.phoneNumber)
        } else {
            val retry = "I didn't catch that. Please specify which number to call."
            binding.tvListeningPrompt.text = retry
            ttsHelper.speak(retry)
        }
    }

    private fun handleGetContactNumber(contactName: String) {
        binding.tvVoiceHint.text = "Retrieving contact number…"
        val matches = contactCallHelper.findAllContactsByName(contactName)

        if (matches.isNotEmpty()) {
            val match = matches.first()
            val formattedForTts = match.phoneNumber
                .replace(Regex("[^0-9]"), "")
                .chunked(2)
                .joinToString(" ")

            val speechReply = "\${match.displayName}'s \${match.typeLabel} number is \$formattedForTts."
            val displayReply = "\${match.displayName}: \${match.phoneNumber} (\${match.typeLabel})"

            binding.tvListeningPrompt.text = displayReply
            binding.tvVoiceHint.text = "Speaking number aloud via TTS…"
            ttsHelper.speak(speechReply)
        } else {
            val notFound = "Could not find any phone number for '\$contactName'."
            binding.tvListeningPrompt.text = notFound
            ttsHelper.speak(notFound)
        }
    }

    private fun handleLlmQuery(prompt: String) {
        lifecycleScope.launch {
            binding.tvVoiceHint.text = "Gemma 2B generating offline reply…"
            val reply = localLlmManager.generateResponse(prompt, this@MainActivity)
            ttsHelper.speak(reply)
        }
    }

    // MediaPipe LLM Callbacks
    override fun onModelLoading() {}
    override fun onModelReady() {}
    override fun onModelError(error: String) { binding.tvVoiceHint.text = error }
    override fun onGeneratingResponse() { binding.tvVoiceHint.text = "Gemma LLM thinking…" }
    override fun onResponseGenerated(responseText: String) {
        binding.tvListeningPrompt.text = responseText
        binding.tvVoiceHint.text = "Sheri speaking…"
    }

    // TTS Callbacks
    override fun onSpeechStarted() {
        binding.viewWaveInner.animate().scaleX(1.2f).scaleY(1.2f).setDuration(250).start()
    }
    override fun onSpeechDone() {
        binding.tvVoiceHint.text = "Listening for 'Hey Sheri' in background…"
        binding.viewWaveInner.animate().scaleX(1.0f).scaleY(1.0f).setDuration(250).start()
    }
    override fun onSpeechError(error: String) {}

    override fun onDestroy() {
        super.onDestroy()
        waveAnimator?.cancel()
        try {
            unregisterReceiver(speechEventReceiver)
        } catch (_: Exception) {}
        ttsHelper.shutdown()
        localLlmManager.close()
    }
}
`;

export const BUILD_GRADLE_KTS = `// app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.heysheri.assistant"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.heysheri.assistant"
        // Requirement 1: minSdk 21 supports virtually all Android phones (Android 5.0 Lollipop to Android 14/15)
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        // MultiDex support for minSdk 21 with large native AI libraries (Vosk + MediaPipe)
        multiDexEnabled = true

        // Ensure 64-bit and 32-bit native ABI architectures for MediaPipe LLM and Vosk
        ndk {
            abiFilters.addAll(listOf("arm64-v8a", "armeabi-v7a", "x86_64"))
        }
    }

    buildFeatures {
        viewBinding = true
    }

    // Prevent compression of offline AI model assets (.bin, .task, .model, etc.)
    aaptOptions {
        noCompress("bin", "task", "model", "am", "fst", "syms")
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // --------------------------------------------------------------------------------
    // 1. AndroidX Core, MultiDex & UI
    // --------------------------------------------------------------------------------
    implementation("androidx.multidex:multidex:2.0.1")
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")

    // --------------------------------------------------------------------------------
    // 2. Google MediaPipe GenAI Task (Offline Local LLM Inference for Gemma / Llama)
    // --------------------------------------------------------------------------------
    implementation("com.google.mediapipe:tasks-genai:0.10.14")

    // --------------------------------------------------------------------------------
    // 3. Vosk Offline Speech Recognition API & JNA Native Bindings
    // --------------------------------------------------------------------------------
    implementation("com.alphacephei:vosk-android:0.3.47@aar")
    implementation("net.java.dev.jna:jna:5.13.0@aar")

    // --------------------------------------------------------------------------------
    // 4. Coroutines for Asynchronous Background Processing
    // --------------------------------------------------------------------------------
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")

    // Note: Android TextToSpeech (TTS) is natively provided by android.speech.tts
}
`;

export const ANDROID_MANIFEST_XML = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions for Full Version Compatibility & Foreground Service -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- Query TTS Engine on Android 11+ (API 30+) -->
    <queries>
        <intent>
            <action android:name="android.intent.action.TTS_SERVICE" />
        </intent>
    </queries>

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.HeySheri">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Continuous Background Listening Foreground Service with Microphone Type -->
        <service
            android:name=".speech.SheriVoiceService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="microphone" />

    </application>

</manifest>`;

export const COLORS_XML = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="bg_dark">#080C15</color>
    <color name="bg_dark_secondary">#0D1322</color>
    <color name="surface_card">#11192C</color>
    <color name="surface_glass">#18233C</color>
    <color name="surface_border">#1E2C4A</color>
    <color name="accent_cyan">#00E5FF</color>
    <color name="accent_cyan_glow">#3300E5FF</color>
    <color name="accent_cyan_deep">#00B0FF</color>
    <color name="cyan_primary">#00E5FF</color>
    <color name="cyan_glow">#3300E5FF</color>
    <color name="status_green_active">#00E676</color>
    <color name="status_green_glow">#4000E676</color>
    <color name="status_inactive">#64748B</color>
    <color name="text_primary">#F8FAFC</color>
    <color name="text_secondary">#94A3B8</color>
    <color name="text_muted">#64748B</color>
</resources>`;

export const STRINGS_XML = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Hey Sheri</string>
    <string name="status_service_active">Hey Sheri Active</string>
    <string name="status_service_paused">Hey Sheri Paused</string>
    <string name="status_offline_mode">Offline Mode Enabled</string>
    <string name="status_cloud_online">Cloud Hybrid Active</string>
    <string name="desc_offline_indicator">Offline Mode Indicator</string>
    <string name="desc_voice_assistant_mic">Activate Voice Assistant</string>
    <string name="prompt_listening">Listening for \"Hey Sheri\"…</string>
    <string name="prompt_tap_to_speak">Tap mic or say \"Hey Sheri\"</string>
    <string name="hint_voice_commands">Gemma LLM &amp; voice calls enabled · Speak freely</string>
    <string name="desc_nav_home">Home</string>
    <string name="desc_nav_settings">Assistant Settings</string>
</resources>`;

export const THEMES_XML = `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.HeySheri" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/accent_cyan</item>
        <item name="colorPrimaryVariant">@color/accent_cyan_deep</item>
        <item name="colorOnPrimary">@color/bg_dark</item>
        <item name="android:statusBarColor">@color/bg_dark</item>
        <item name="android:windowBackground">@color/bg_dark</item>
    </style>
</resources>`;

export const DRAWABLES = [
  {
    name: "bg_status_badge.xml",
    path: "res/drawable/bg_status_badge.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/surface_card" />
    <corners android:radius="20dp" />
    <stroke
        android:width="1dp"
        android:color="@color/surface_border" />
</shape>`
  },
  {
    name: "bg_dot_active.xml",
    path: "res/drawable/bg_dot_active.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/status_green_active" />
    <size
        android:width="8dp"
        android:height="8dp" />
</shape>`
  },
  {
    name: "bg_dot_inactive.xml",
    path: "res/drawable/bg_dot_inactive.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/status_inactive" />
    <size
        android:width="8dp"
        android:height="8dp" />
</shape>`
  },
  {
    name: "bg_wave_ring_outer.xml",
    path: "res/drawable/bg_wave_ring_outer.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <stroke
        android:width="2dp"
        android:color="@color/accent_cyan" />
    <solid android:color="@color/accent_cyan_glow" />
</shape>`
  },
  {
    name: "bg_wave_ring_inner.xml",
    path: "res/drawable/bg_wave_ring_inner.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <stroke
        android:width="1.5dp"
        android:color="@color/accent_cyan" />
    <solid android:color="#1A00E5FF" />
</shape>`
  },
  {
    name: "bg_visualizer_wave.xml",
    path: "res/drawable/bg_visualizer_wave.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/surface_glass" />
    <stroke
        android:width="1dp"
        android:color="@color/surface_border" />
</shape>`
  },
  {
    name: "bg_bottom_nav_bar.xml",
    path: "res/drawable/bg_bottom_nav_bar.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/surface_card" />
    <corners android:radius="32dp" />
    <stroke
        android:width="1dp"
        android:color="@color/surface_border" />
</shape>`
  },
  {
    name: "ic_mic.xml",
    path: "res/drawable/ic_mic.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="32dp"
    android:height="32dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/black"
        android:pathData="M12,14c1.66,0 3,-1.34 3,-3V5c0,-1.66 -1.34,-3 -3,-3S9,3.34 9,5v6c0,1.66 1.34,3 3,3zM17.3,11c0,3 -2.54,5.1 -5.3,5.1S6.7,14 6.7,11H5c0,3.41 2.72,6.23 6,6.72V21h2v-3.28c3.28,-0.48 6,-3.3 6,-6.72h-1.7z" />
</vector>`
  },
  {
    name: "ic_offline_bolt.xml",
    path: "res/drawable/ic_offline_bolt.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="20dp"
    android:height="20dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10,-4.48 10,-10S17.52,2 12,2zM11.4,18l0.9,-5.5H8.7l4,-7.5 -0.8,5h3.7L11.4,18z" />
</vector>`
  },
  {
    name: "ic_nav_home.xml",
    path: "res/drawable/ic_nav_home.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="28dp"
    android:height="28dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M10,20v-6h4v6h5v-8h3L12,3 2,12h3v8z" />
</vector>`
  },
  {
    name: "ic_nav_settings.xml",
    path: "res/drawable/ic_nav_settings.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="28dp"
    android:height="28dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M19.14,12.94c0.04,-0.3 0.06,-0.61 0.06,-0.94 0,-0.32 -0.02,-0.64 -0.07,-0.94l2.03,-1.58c0.18,-0.14 0.23,-0.41 0.12,-0.61l-1.92,-3.32c-0.12,-0.22 -0.37,-0.29 -0.59,-0.22l-2.39,0.96c-0.5,-0.38 -1.03,-0.7 -1.62,-0.94L14.4,2.81c-0.04,-0.24 -0.24,-0.41 -0.48,-0.41h-3.84c-0.24,0 -0.43,0.17 -0.47,0.41L9.25,5.35C8.66,5.59 8.12,5.92 7.63,6.29L5.24,5.33c-0.22,-0.08 -0.47,0 -0.59,0.22L2.74,8.87c-0.12,0.21 -0.08,0.47 0.12,0.61l2.03,1.58c-0.05,0.3 -0.09,0.63 -0.09,0.94s0.02,0.64 0.07,0.94l-2.03,1.58c-0.18,0.14 -0.23,0.41 -0.12,0.61l1.92,3.32c0.12,0.22 0.37,0.29 0.59,0.22l2.39,-0.96c0.5,0.38 1.03,0.7 1.62,0.94l0.36,2.54c0.05,0.24 0.24,0.41 0.48,0.41h3.84c0.24,0 0.44,-0.17 0.47,-0.41l0.36,-2.54c0.59,-0.24 1.13,-0.56 1.62,-0.94l2.39,0.96c0.22,0.08 0.47,0 0.59,-0.22l1.92,-3.32c0.12,-0.22 0.07,-0.47 -0.12,-0.61l-2.01,-1.58zM12,15.6c-1.98,0 -3.6,-1.62 -3.6,-3.6s1.62,-3.6 3.6,-3.6 3.6,1.62 3.6,3.6 -1.62,3.6 -3.6,3.6z" />
</vector>`
  }
];

export const SETUP_GUIDE_MD = `# Hey Sheri: Offline AI Asset & Model Import Guide

This guide explains how to import and process offline AI models (Vosk Speech & MediaPipe Gemma/Llama LLM) on your device.

---

### 1. In-App LLM Model Import (Recommended - No Computer or Rebuild Needed!)

You can download the LLM model directly onto your phone from your mobile browser and import it inside the app:

1. **Download the Model File on your Phone:**
   - **Gemma 2B INT4 CPU:** Download \`gemma-2b-it-cpu-int4.bin\` (~1.3 GB) from [Kaggle Gemma Models](https://www.kaggle.com/models/google/gemma/tfLite/gemma-2b-it-cpu-int4) or Hugging Face.
   - **Llama 3.2 1B:** Alternatively, download \`llama-3.2-1b-instruct.task\` (~1.1 GB).
2. **Open "Hey Sheri" on Your Phone:**
   - Tap the **Settings** icon at the bottom right.
   - Tap **"Import Model (.bin / .task)"**.
   - Your Android system file picker will open; select the downloaded file from your **Downloads** folder.
3. **Automatic Verification & Processing:**
   - The app streams the file into secure app storage (\`context.filesDir/models/\`) with a live progress indicator.
   - Once verified, MediaPipe GenAI initializes the on-device inference engine automatically and Sheri confirms:
     *"Sheri offline brain loaded successfully!"*
   - The verified model path is saved in \`SharedPreferences\` and survives app restarts.

---

### 2. Auto-Discovery from Downloads Folder

If you place or download the model file into your phone's public Downloads folder:
- Path: \`/storage/emulated/0/Download/gemma-2b-it-cpu-int4.bin\`
- "Hey Sheri" automatically discovers and links the model on startup without requiring a manual import!

---

### 3. Bundling into APK Assets (For Pre-Packaged APKs)

If you are compiling a single standalone APK with the model embedded:

\`\`\`
HeySheri/
└── app/
    └── src/
        └── main/
            └── assets/
                ├── model-en-us/               <-- Unpacked Vosk Speech Model (am/, conf/, graph/)
                └── gemma-2b-it-cpu-int4.bin    <-- Gemma 2B MediaPipe Model
\`\`\`

---

### 4. Build & Requirements
- **OS Compatibility:** Android 5.0 (API 21) up to Android 15 (API 35).
- **Architecture:** \`arm64-v8a\` or \`x86_64\` physical device or emulator.
- **Recommended RAM:** 4 GB RAM or more for smooth on-device 2B neural inference.
`;

export const BUILD_APK_YML = `name: Build Hey Sheri APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build Android Debug APK
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository Code
      uses: actions/checkout@v4

    - name: Set up Java JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Auto Accept Android SDK Licenses
      run: |
        yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses || true

    - name: Ensure Gradle Wrapper Executable
      run: |
        if [ ! -f "gradlew" ]; then
          gradle wrapper --gradle-version 8.7
        fi
        chmod +x gradlew

    - name: Build Debug APK
      run: ./gradlew assembleDebug --no-daemon --stacktrace

    - name: Upload Hey Sheri APK to Artifacts
      if: success()
      uses: actions/upload-artifact@v4
      with:
        name: HeySheri-Debug-APK
        path: app/build/outputs/apk/debug/app-debug.apk
        retention-days: 14
`;

export const GIT_PUSH_GUIDE_MD = `# Git Push & GitHub Upload Guide: "Coding Push Nahi Ho Raha"

Agar aapka code GitHub par push nahi ho raha hai, toh yahan 2 sabse aasan tarike hain:

---

### Tarika 1: Direct Upload via Web (Bina kisi command ke - 100% Guaranteed)
Agar terminal ya git me authentication ya password error aa rahi hai, toh commands chhod dijiye:

1. **ZIP Download karein:**
   - Upar diye gaye **"Download All Files (.ZIP)"** button par click karein.
   - \`HeySheri-Android-Source.zip\` download ho jayegi.
2. **ZIP Extract/Unzip karein:**
   - Apne mobile ya computer me zip ko extract karein. Isme \`app\`, \`.github\`, \`build.gradle.kts\`, \`settings.gradle.kts\` folders honge.
3. **GitHub par Upload karein:**
   - Chrome browser me repository kholein:
     👉 **https://github.com/kurreysahil341-hue/-Assistant-caller-**
   - Upar **"Add file"** button par click karein ➡️ **"Upload files"** select karein.
   - Saare unzipped folders aur files ko wahan drag & drop ya select karke daal dein.
   - Neeche green color ka **"Commit changes"** button daba dein.
4. **Build APK:**
   - Ab GitHub ke **Actions** tab me jayein ➡️ **"Build Hey Sheri APK"** ➡️ **"Run workflow"** dabayein!

---

### Tarika 2: Terminal / Git Push se (Agar Termux ya PC Git use kar rahe hain)

#### ⚠️ Dhyan Dein: GitHub Password Error!
GitHub ne normal password se push band kar diya hai. Password mangne par aapko **Personal Access Token (PAT)** daalna hota hai.

#### Token Kaise Banayein (1 Minute):
1. GitHub ➡️ Profile Icon (top right) ➡️ **Settings** ➡️ **Developer settings** (sabse neeche).
2. **Personal access tokens** ➡️ **Tokens (classic)** ➡️ **Generate new token (classic)**.
3. Note me likhein \`HeySheri\`, Scopes me **\`repo\`** par check lagayein ➡️ **Generate token**.
4. Token copy kar lein (jaise: \`ghp_abc123...\`).

#### Push Karne ke Commands:
\`\`\`bash
# 1. Unzipped folder ke andar jayein
cd HeySheri-Android-Source

# 2. Git init aur files add karein
git init
git add .
git commit -m "Hey Sheri Full Offline Voice Assistant Source"

# 3. Main branch set karein
git branch -M main

# 4. Remote repository set karein
git remote add origin https://github.com/kurreysahil341-hue/-Assistant-caller-.git

# 5. Push karein:
git push -u origin main --force
\`\`\`
*(Jab Username maange toh apna username dalein: \`kurreysahil341-hue\`, aur Password maange toh apna **Personal Access Token** paste karein!)*

---

### Tarika 3: "Updates were rejected because the remote contains work" Error:
Agar GitHub par pehle se purani files hain aur push reject ho rahi hai:
\`\`\`bash
git push -u origin main --force
\`\`\`
Ye command aapki nayi files ko bina kisi conflict ke push kar dega.
`;


