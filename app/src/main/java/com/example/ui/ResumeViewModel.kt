package com.example.ui

import android.app.Application
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.print.PrintAttributes
import android.print.PrintManager
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.ResumeDatabase
import com.example.data.model.BlankPageItem
import com.example.data.model.EducationItem
import com.example.data.model.ExperienceItem
import com.example.data.model.LanguageItem
import com.example.data.model.SkillItem
import com.example.data.model.TeacherResume
import com.example.data.repository.ResumeRepository
import com.example.pdf.PdfGenerator
import com.example.pdf.ResumePrintAdapter
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class ResumeViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: ResumeRepository
    private var autoSaveJob: Job? = null

    private val _resumeState = MutableStateFlow(TeacherResume())
    val resumeState: StateFlow<TeacherResume> = _resumeState.asStateFlow()

    private val _isGeneratingPdf = MutableStateFlow(false)
    val isGeneratingPdf: StateFlow<Boolean> = _isGeneratingPdf.asStateFlow()

    private val _lastSavedPdfPath = MutableStateFlow<String?>(null)
    val lastSavedPdfPath: StateFlow<String?> = _lastSavedPdfPath.asStateFlow()

    init {
        val database = ResumeDatabase.getDatabase(application)
        repository = ResumeRepository(database.resumeDao())

        viewModelScope.launch {
            repository.resumeFlow.collect { savedResume ->
                if (savedResume != null) {
                    _resumeState.value = savedResume
                } else {
                    // Initialize with default
                    val initial = TeacherResume()
                    _resumeState.value = initial
                    repository.saveResume(initial)
                }
            }
        }
    }

    private fun triggerAutoSave(updated: TeacherResume) {
        _resumeState.value = updated
        autoSaveJob?.cancel()
        autoSaveJob = viewModelScope.launch {
            delay(400) // Debounce auto-save
            repository.saveResume(updated)
        }
    }

    fun updateFullName(name: String) {
        triggerAutoSave(_resumeState.value.copy(fullName = name))
    }

    fun updateAppliedPost(post: String) {
        triggerAutoSave(_resumeState.value.copy(appliedPost = post))
    }

    fun updateFatherName(fatherName: String) {
        triggerAutoSave(_resumeState.value.copy(fatherName = fatherName))
    }

    fun updateDob(dob: String) {
        val calculatedAge = calculateAgeFromDob(dob)
        triggerAutoSave(_resumeState.value.copy(dob = dob, age = calculatedAge))
    }

    fun updateGender(gender: String) {
        triggerAutoSave(_resumeState.value.copy(gender = gender))
    }

    fun updateMaritalStatus(status: String) {
        triggerAutoSave(_resumeState.value.copy(maritalStatus = status))
    }

    fun updateMobile(mobile: String) {
        triggerAutoSave(_resumeState.value.copy(mobileNumber = mobile))
    }

    fun updateEmail(email: String) {
        triggerAutoSave(_resumeState.value.copy(emailId = email))
    }

    fun updateAddress(address: String) {
        triggerAutoSave(_resumeState.value.copy(address = address))
    }

    fun updatePinCode(pin: String) {
        triggerAutoSave(_resumeState.value.copy(pinCode = pin))
    }

    fun updatePhotoUri(uriString: String?) {
        triggerAutoSave(_resumeState.value.copy(photoUri = uriString))
    }

    // --- Education Section ---
    fun updateEducationItem(updatedItem: EducationItem) {
        val list = _resumeState.value.educationList.map {
            if (it.id == updatedItem.id) updatedItem else it
        }
        triggerAutoSave(_resumeState.value.copy(educationList = list))
    }

    fun addEducationItem(courseName: String = "") {
        val newItem = EducationItem(
            courseName = courseName,
            boardOrUniversity = "",
            stream = "",
            passingYear = "",
            percentageOrGrade = "",
            isDefault = false
        )
        val list = _resumeState.value.educationList + newItem
        triggerAutoSave(_resumeState.value.copy(educationList = list))
    }

    fun removeEducationItem(id: String) {
        val list = _resumeState.value.educationList.filter { it.id != id }
        triggerAutoSave(_resumeState.value.copy(educationList = list))
    }

    // --- Experience Section ---
    fun updateExperienceItem(updatedItem: ExperienceItem) {
        val list = _resumeState.value.experienceList.map {
            if (it.id == updatedItem.id) updatedItem else it
        }
        triggerAutoSave(_resumeState.value.copy(experienceList = list))
    }

    fun addExperienceItem() {
        val newItem = ExperienceItem(
            organizationName = "",
            post = "Assistant Teacher",
            duration = "",
            responsibilities = ""
        )
        val list = _resumeState.value.experienceList + newItem
        triggerAutoSave(_resumeState.value.copy(experienceList = list))
    }

    fun removeExperienceItem(id: String) {
        val list = _resumeState.value.experienceList.filter { it.id != id }
        triggerAutoSave(_resumeState.value.copy(experienceList = list))
    }

    // --- Skills Section ---
    fun toggleSkill(id: String) {
        val list = _resumeState.value.skillsList.map {
            if (it.id == id) it.copy(isChecked = !it.isChecked) else it
        }
        triggerAutoSave(_resumeState.value.copy(skillsList = list))
    }

    fun addCustomSkill(skillName: String) {
        if (skillName.isBlank()) return
        val newItem = SkillItem(
            name = skillName.trim(),
            isChecked = true,
            isCustom = true
        )
        val list = _resumeState.value.skillsList + newItem
        triggerAutoSave(_resumeState.value.copy(skillsList = list))
    }

    fun removeSkill(id: String) {
        val list = _resumeState.value.skillsList.filter { it.id != id }
        triggerAutoSave(_resumeState.value.copy(skillsList = list))
    }

    // --- Languages Section ---
    fun updateLanguage(updatedItem: LanguageItem) {
        val list = _resumeState.value.languageList.map {
            if (it.id == updatedItem.id) updatedItem else it
        }
        triggerAutoSave(_resumeState.value.copy(languageList = list))
    }

    fun addLanguage(languageName: String) {
        if (languageName.isBlank()) return
        val newItem = LanguageItem(
            language = languageName.trim(),
            canRead = true,
            canWrite = true,
            canSpeak = true
        )
        val list = _resumeState.value.languageList + newItem
        triggerAutoSave(_resumeState.value.copy(languageList = list))
    }

    fun removeLanguage(id: String) {
        val list = _resumeState.value.languageList.filter { it.id != id }
        triggerAutoSave(_resumeState.value.copy(languageList = list))
    }

    // --- Achievements Section ---
    fun addAchievement(achievement: String) {
        if (achievement.isBlank()) return
        val list = _resumeState.value.achievementsList + achievement.trim()
        triggerAutoSave(_resumeState.value.copy(achievementsList = list))
    }

    fun updateAchievement(index: Int, text: String) {
        val list = _resumeState.value.achievementsList.toMutableList()
        if (index in list.indices) {
            list[index] = text
            triggerAutoSave(_resumeState.value.copy(achievementsList = list))
        }
    }

    fun removeAchievement(index: Int) {
        val list = _resumeState.value.achievementsList.toMutableList()
        if (index in list.indices) {
            list.removeAt(index)
            triggerAutoSave(_resumeState.value.copy(achievementsList = list))
        }
    }

    // --- Extra Blank Pages Section ---
    fun addBlankPage() {
        val pageNum = _resumeState.value.blankPages.size + 1
        val newPage = BlankPageItem(
            pageTitle = "अतिरिक्त विवरण / ATTACHMENT $pageNum",
            content = ""
        )
        val list = _resumeState.value.blankPages + newPage
        triggerAutoSave(_resumeState.value.copy(blankPages = list))
    }

    fun updateBlankPage(updatedPage: BlankPageItem) {
        val list = _resumeState.value.blankPages.map {
            if (it.id == updatedPage.id) updatedPage else it
        }
        triggerAutoSave(_resumeState.value.copy(blankPages = list))
    }

    fun removeBlankPage(id: String) {
        val list = _resumeState.value.blankPages.filter { it.id != id }
        triggerAutoSave(_resumeState.value.copy(blankPages = list))
    }

    // --- Quick Data actions ---
    fun loadSampleData() {
        val sample = TeacherResume.sampleResume()
        triggerAutoSave(sample)
    }

    fun clearForm() {
        val fresh = TeacherResume()
        triggerAutoSave(fresh)
    }

    // --- Print & Export PDF Actions ---
    fun exportAndSavePdf(context: Context, onComplete: (Uri?) -> Unit) {
        viewModelScope.launch {
            _isGeneratingPdf.value = true
            val pdfFile = PdfGenerator.generatePdf(context, _resumeState.value)
            if (pdfFile != null) {
                val savedUri = PdfGenerator.savePdfToDownloads(context, pdfFile)
                _lastSavedPdfPath.value = pdfFile.absolutePath
                _isGeneratingPdf.value = false
                onComplete(savedUri)
            } else {
                _isGeneratingPdf.value = false
                onComplete(null)
            }
        }
    }

    fun printResume(context: Context) {
        val printManager = context.getSystemService(Context.PRINT_SERVICE) as? PrintManager
        if (printManager != null) {
            val jobName = "Teacher_Resume_${_resumeState.value.fullName.ifBlank { "Print" }}"
            val printAdapter = ResumePrintAdapter(context, _resumeState.value)
            val printAttributes = PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                .setColorMode(PrintAttributes.COLOR_MODE_MONOCHROME)
                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                .build()
            printManager.print(jobName, printAdapter, printAttributes)
        } else {
            Toast.makeText(context, "Printing service unavailable", Toast.LENGTH_SHORT).show()
        }
    }

    fun sharePdf(context: Context) {
        viewModelScope.launch {
            _isGeneratingPdf.value = true
            val pdfFile = PdfGenerator.generatePdf(context, _resumeState.value)
            _isGeneratingPdf.value = false
            if (pdfFile != null) {
                try {
                    val uri = FileProvider.getUriForFile(
                        context,
                        "${context.packageName}.fileprovider",
                        pdfFile
                    )
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "application/pdf"
                        putExtra(Intent.EXTRA_STREAM, uri)
                        putExtra(Intent.EXTRA_SUBJECT, "Teacher Resume - ${_resumeState.value.fullName}")
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    context.startActivity(Intent.createChooser(shareIntent, "Share Teacher Resume PDF"))
                } catch (e: Exception) {
                    // Fallback to direct share
                    val directUri = Uri.fromFile(pdfFile)
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "application/pdf"
                        putExtra(Intent.EXTRA_STREAM, directUri)
                        putExtra(Intent.EXTRA_SUBJECT, "Teacher Resume")
                    }
                    context.startActivity(Intent.createChooser(shareIntent, "Share Resume PDF"))
                }
            } else {
                Toast.makeText(context, "Could not generate PDF", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun calculateAgeFromDob(dobStr: String): String {
        return try {
            val formats = listOf(
                SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()),
                SimpleDateFormat("dd-MM-yyyy", Locale.getDefault()),
                SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            )
            var parsedDate: Date? = null
            for (fmt in formats) {
                try {
                    parsedDate = fmt.parse(dobStr)
                    if (parsedDate != null) break
                } catch (_: Exception) {}
            }

            if (parsedDate == null) return ""

            val dobCal = Calendar.getInstance().apply { time = parsedDate }
            val nowCal = Calendar.getInstance()

            var years = nowCal.get(Calendar.YEAR) - dobCal.get(Calendar.YEAR)
            var months = nowCal.get(Calendar.MONTH) - dobCal.get(Calendar.MONTH)
            val days = nowCal.get(Calendar.DAY_OF_MONTH) - dobCal.get(Calendar.DAY_OF_MONTH)

            if (days < 0) {
                months--
            }
            if (months < 0) {
                years--
                months += 12
            }

            if (years > 0) {
                if (months > 0) "$years Years, $months Months" else "$years Years"
            } else if (months > 0) {
                "$months Months"
            } else {
                ""
            }
        } catch (e: Exception) {
            ""
        }
    }
}
