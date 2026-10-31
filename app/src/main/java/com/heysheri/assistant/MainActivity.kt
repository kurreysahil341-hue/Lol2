package com.heysheri.assistant

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
                        binding.tvVoiceHint.text = "\"$payloadText\""
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
            "Active Model: ${modelInfo.name} (${modelInfo.sizeFormatted})"
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
                    binding.tvListeningPrompt.text = "Importing model: $percent% ($copiedMb MB / $totalMb MB)"
                    binding.tvVoiceHint.text = "Copying model into app storage…"
                }
            }

            runOnUiThread {
                waveAnimator?.cancel()
                result.onSuccess { info ->
                    binding.tvListeningPrompt.text = "Model Ready: ${info.name}"
                    binding.tvVoiceHint.text = "Size: ${info.sizeFormatted} · On-device AI active"
                    val successMsg = "Sheri offline brain loaded successfully. You can now ask questions!"
                    ttsHelper.speak(successMsg)
                    Toast.makeText(this@MainActivity, "Model imported successfully!", Toast.LENGTH_LONG).show()
                }.onFailure { error ->
                    val errorMsg = "Import failed: ${error.localizedMessage}"
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
        binding.tvVoiceHint.text = "Searching contacts for '$contactName'…"

        when (val res = contactCallHelper.resolveContactForCall(contactName)) {
            is ContactCallHelper.CallResolution.SingleMatch -> {
                val callMsg = "Calling ${res.contact.displayName}"
                binding.tvListeningPrompt.text = callMsg
                binding.tvVoiceHint.text = "Dialing ${res.contact.phoneNumber} (${res.contact.typeLabel})"
                ttsHelper.speak(callMsg)
                contactCallHelper.makePhoneCall(res.contact.phoneNumber)
            }
            is ContactCallHelper.CallResolution.MultipleMatches -> {
                pendingDisambiguationMatches = res.matches
                val labels = res.matches.map { it.typeLabel }.distinct().joinToString(" or ")
                val question = "Multiple numbers found for ${res.contactName}. Which one should I call: $labels?"

                binding.tvListeningPrompt.text = question
                binding.tvVoiceHint.text = "Listening for your choice (${labels})…"
                ttsHelper.speak(question)
            }
            is ContactCallHelper.CallResolution.NotFound -> {
                val notFound = "Sorry, no contact found for '$contactName'."
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
            val callMsg = "Calling ${selected.displayName} on ${selected.typeLabel}"
            binding.tvListeningPrompt.text = callMsg
            binding.tvVoiceHint.text = "Dialing ${selected.phoneNumber}"
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

            val speechReply = "${match.displayName}'s ${match.typeLabel} number is $formattedForTts."
            val displayReply = "${match.displayName}: ${match.phoneNumber} (${match.typeLabel})"

            binding.tvListeningPrompt.text = displayReply
            binding.tvVoiceHint.text = "Speaking number aloud via TTS…"
            ttsHelper.speak(speechReply)
        } else {
            val notFound = "Could not find any phone number for '$contactName'."
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
