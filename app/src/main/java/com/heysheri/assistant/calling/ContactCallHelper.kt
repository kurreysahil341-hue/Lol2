package com.heysheri.assistant.calling

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
            """(?i)(?:heys+sheris+|heys+sherrys+)?(?:pleases+)?(?:call|dial|phone|makes+as+calls+to|kos+calls+lagao|kos+calls+karo)s+(.+)"""
        )
        private val CALL_HINDI_POSTFIX_REGEX = Regex(
            """(?i)(?:heys+sheris+|heys+sherrys+)?(.+?)s+(?:kos+calls+(?:karo|lagao)|kos+phones+lagao)"""
        )

        // 2. Info Query Intent patterns ("Number batao" / "Get number" / "Phone number kya hai")
        private val NUMBER_INFO_REGEX = Regex(
            """(?i)(?:heys+sheris+|heys+sherrys+)?(?:(?:get|tells+me|whats+is|shows+me)s+)?(.+?)(?:(?:'s|s+ka|s+ki)s+(?:contact|number|phones+number|mobile))(?:s+(?:batao|bataiye|kyas+hai|do))?"""
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
                .replace(Regex("""(?i)^(please|kripya)s+"""), "")
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
            name = name.replace(Regex("""(?i)s+(please|now|urgently|karo|lagao)$"""), "").trim()
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

        val selection = "${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} LIKE ?"
        val selectionArgs = arrayOf("%$contactName%")
        val sortOrder = "${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} ASC"

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
}