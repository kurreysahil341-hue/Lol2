package com.heysheri.assistant.router

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
            .replace(Regex("""^(heys+sheri|heys+sherry|sheri)s*"""), "")
            .trim()

        return Route.LlmQuery(if (stripped.isNotEmpty()) stripped else spokenText)
    }
}