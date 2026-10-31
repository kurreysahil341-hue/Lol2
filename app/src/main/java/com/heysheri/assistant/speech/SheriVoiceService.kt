package com.heysheri.assistant.speech

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
