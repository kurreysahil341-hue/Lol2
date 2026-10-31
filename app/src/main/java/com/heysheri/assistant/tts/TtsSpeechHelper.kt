package com.heysheri.assistant.tts

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
}