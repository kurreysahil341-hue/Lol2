package com.example.pdf

import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import com.example.data.model.BlankPageItem
import com.example.data.model.EducationItem
import com.example.data.model.ExperienceItem
import com.example.data.model.LanguageItem
import com.example.data.model.SkillItem
import com.example.data.model.TeacherResume
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object PdfGenerator {

    // Standard A4 dimensions in PostScript points (72 points/inch)
    const val PAGE_WIDTH = 595
    const val PAGE_HEIGHT = 842
    const val MARGIN = 36f // 0.5 inch margin for standard formal forms

    fun generatePdf(context: Context, resume: TeacherResume): File? {
        val pdfDocument = PdfDocument()
        try {
            // Render Main Resume Page (Page 1)
            renderMainResumePage(context, pdfDocument, resume, 1)

            // Render Extra Blank Pages (Pages 2..N)
            var pageNumber = 2
            for (blankPage in resume.blankPages) {
                renderBlankPage(pdfDocument, blankPage, pageNumber)
                pageNumber++
            }

            // Save to app cache / documents directory
            val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
            val sanitizedName = if (resume.fullName.isNotBlank()) {
                resume.fullName.replace(Regex("[^a-zA-Z0-9_-]"), "_").take(20)
            } else {
                "Teacher"
            }
            val fileName = "Teacher_Resume_${sanitizedName}_$timeStamp.pdf"
            val outputFile = File(context.cacheDir, fileName)

            FileOutputStream(outputFile).use { out ->
                pdfDocument.writeTo(out)
            }

            return outputFile
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        } finally {
            pdfDocument.close()
        }
    }

    fun savePdfToDownloads(context: Context, sourceFile: File): Uri? {
        val fileName = sourceFile.name
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val contentValues = ContentValues().apply {
                    put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                    put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf")
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/TeacherResumes")
                }
                val uri = context.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
                if (uri != null) {
                    context.contentResolver.openOutputStream(uri)?.use { out ->
                        sourceFile.inputStream().use { input ->
                            input.copyTo(out)
                        }
                    }
                }
                uri
            } else {
                val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                val targetDir = File(downloadsDir, "TeacherResumes")
                if (!targetDir.exists()) targetDir.mkdirs()
                val targetFile = File(targetDir, fileName)
                sourceFile.copyTo(targetFile, overwrite = true)
                Uri.fromFile(targetFile)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    private fun renderMainResumePage(
        context: Context,
        pdfDocument: PdfDocument,
        resume: TeacherResume,
        pageNumber: Int
    ) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, pageNumber).create()
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        drawMainPageContent(context, canvas, resume)

        pdfDocument.finishPage(page)
    }

    fun drawMainPageContent(
        context: Context,
        canvas: Canvas,
        resume: TeacherResume,
        scale: Float = 1f
    ) {
        if (scale != 1f) {
            canvas.save()
            canvas.scale(scale, scale)
        }

        // Draw Paper Background
        val bgPaint = Paint().apply {
            color = Color.WHITE
            style = Paint.Style.FILL
        }
        canvas.drawRect(0f, 0f, PAGE_WIDTH.toFloat(), PAGE_HEIGHT.toFloat(), bgPaint)

        // Draw Formal Outer Border
        val borderPaint = Paint().apply {
            color = Color.BLACK
            style = Paint.Style.STROKE
            strokeWidth = 1.2f
            isAntiAlias = true
        }
        val innerBorderMargin = 24f
        canvas.drawRect(
            innerBorderMargin,
            innerBorderMargin,
            PAGE_WIDTH - innerBorderMargin,
            PAGE_HEIGHT - innerBorderMargin,
            borderPaint
        )

        // Thin inner decorative line
        val thinBorderPaint = Paint().apply {
            color = Color.DKGRAY
            style = Paint.Style.STROKE
            strokeWidth = 0.5f
            isAntiAlias = true
        }
        canvas.drawRect(
            innerBorderMargin + 2.5f,
            innerBorderMargin + 2.5f,
            PAGE_WIDTH - innerBorderMargin - 2.5f,
            PAGE_HEIGHT - innerBorderMargin - 2.5f,
            thinBorderPaint
        )

        var currentY = 44f
        val leftMargin = MARGIN + 4f
        val rightMargin = PAGE_WIDTH - MARGIN - 4f
        val contentWidth = rightMargin - leftMargin

        // Header Title: BIO-DATA / RESUME
        val titlePaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 15f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }
        canvas.drawText("बायो-डाटा / BIO-DATA", PAGE_WIDTH / 2f, currentY, titlePaint)
        currentY += 14f

        val subTitlePaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 10.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }
        canvas.drawText("(प्राइवेट स्कूल शिक्षिका/शिक्षक पद हेतु आवेदन पत्र)", PAGE_WIDTH / 2f, currentY, subTitlePaint)
        currentY += 16f

        // Photo Box (Top Right)
        val photoWidth = 72f
        val photoHeight = 88f
        val photoLeft = rightMargin - photoWidth
        val photoTop = currentY - 22f

        drawPassportPhoto(context, canvas, resume.photoUri, photoLeft, photoTop, photoWidth, photoHeight)

        // Applied Post Box / Line on Left
        val postLabelPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 10f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            isAntiAlias = true
        }
        val postValuePaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 10f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            isAntiAlias = true
        }

        canvas.drawText("आवेदित पद (Applied Post):", leftMargin, currentY, postLabelPaint)
        val postText = if (resume.appliedPost.isNotBlank()) resume.appliedPost else "प्री-प्राइमरी / असिस्टेंट टीचर"
        canvas.drawText(postText, leftMargin + 130f, currentY, postValuePaint)
        currentY += 14f

        // Full Name in Header
        canvas.drawText("अभ्यर्थी का नाम (Candidate Name):", leftMargin, currentY, postLabelPaint)
        val nameText = if (resume.fullName.isNotBlank()) resume.fullName else "......................................................."
        val boldNamePaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 11f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            isAntiAlias = true
        }
        canvas.drawText(nameText, leftMargin + 175f, currentY, boldNamePaint)
        currentY += 16f

        // Section Divider Line
        currentY = maxOf(currentY, photoTop + photoHeight + 6f)
        drawSectionHeader(canvas, "1. व्यक्तिगत विवरण (PERSONAL & CONTACT DETAILS)", leftMargin, rightMargin, currentY)
        currentY += 16f

        // Personal Details Grid (2 Columns)
        val labelPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            isAntiAlias = true
        }
        val valPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            isAntiAlias = true
        }

        val col1Left = leftMargin + 4f
        val col1Val = col1Left + 110f
        val col2Left = leftMargin + (contentWidth / 2f) + 10f
        val col2Val = col2Left + 100f
        val rowHeight = 13.5f

        // Row 1: Father's Name | DOB & Age
        canvas.drawText("पिता का नाम (Father's Name):", col1Left, currentY, labelPaint)
        canvas.drawText(resume.fatherName.ifBlank { "-" }, col1Val, currentY, valPaint)

        canvas.drawText("जन्म तिथि (DOB & Age):", col2Left, currentY, labelPaint)
        val dobAge = buildString {
            if (resume.dob.isNotBlank()) append(resume.dob)
            if (resume.age.isNotBlank()) {
                if (isNotEmpty()) append(" (")
                append(resume.age)
                if (resume.dob.isNotBlank()) append(")")
            }
            if (isEmpty()) append("-")
        }
        canvas.drawText(dobAge, col2Val, currentY, valPaint)
        currentY += rowHeight

        // Row 2: Gender | Marital Status
        canvas.drawText("लिंग (Gender):", col1Left, currentY, labelPaint)
        canvas.drawText(resume.gender.ifBlank { "-" }, col1Val, currentY, valPaint)

        canvas.drawText("वैवाहिक स्थिति (Status):", col2Left, currentY, labelPaint)
        canvas.drawText(resume.maritalStatus.ifBlank { "-" }, col2Val, currentY, valPaint)
        currentY += rowHeight

        // Row 3: Mobile Number | Email ID
        canvas.drawText("मोबाइल नं. (Mobile):", col1Left, currentY, labelPaint)
        canvas.drawText(resume.mobileNumber.ifBlank { "-" }, col1Val, currentY, valPaint)

        canvas.drawText("ईमेल (Email):", col2Left, currentY, labelPaint)
        canvas.drawText(resume.emailId.ifBlank { "-" }, col2Val, currentY, valPaint)
        currentY += rowHeight

        // Row 4: Address (Full row)
        canvas.drawText("स्थायी पता (Address):", col1Left, currentY, labelPaint)
        val fullAddress = buildString {
            if (resume.address.isNotBlank()) append(resume.address)
            if (resume.pinCode.isNotBlank()) {
                if (isNotEmpty()) append(", पिन कोड: ") else append("पिन कोड: ")
                append(resume.pinCode)
            }
            if (isEmpty()) append("-")
        }
        canvas.drawText(fullAddress, col1Val, currentY, valPaint)
        currentY += rowHeight + 4f

        // Section 2: Educational Qualifications Table
        drawSectionHeader(canvas, "2. शैक्षणिक योग्यता (EDUCATIONAL QUALIFICATIONS)", leftMargin, rightMargin, currentY)
        currentY += 15f

        currentY = drawEducationTable(canvas, resume.educationList, leftMargin, rightMargin, currentY)
        currentY += 6f

        // Section 3: Work Experience
        drawSectionHeader(canvas, "3. कार्य अनुभव (WORK EXPERIENCE / TEACHING EXPERIENCE)", leftMargin, rightMargin, currentY)
        currentY += 15f

        currentY = drawExperienceSection(canvas, resume.experienceList, leftMargin, rightMargin, currentY)
        currentY += 6f

        // Section 4: Skills Section
        drawSectionHeader(canvas, "4. मुख्य शिक्षण कौशल (KEY SKILLS & TEACHING ABILITIES)", leftMargin, rightMargin, currentY)
        currentY += 15f

        currentY = drawSkillsSection(canvas, resume.skillsList, leftMargin, rightMargin, currentY)
        currentY += 6f

        // Section 5: Languages & Achievements Section
        drawSectionHeader(canvas, "5. भाषा ज्ञान एवं उपलब्धियाँ (LANGUAGES & ACHIEVEMENTS)", leftMargin, rightMargin, currentY)
        currentY += 15f

        currentY = drawLanguagesAndAchievements(canvas, resume.languageList, resume.achievementsList, leftMargin, rightMargin, currentY)

        // STRICT REQUIREMENT #9: NO DECLARATION OR SIGNATURE SECTION AT THE END.

        if (scale != 1f) {
            canvas.restore()
        }
    }

    private fun drawPassportPhoto(
        context: Context,
        canvas: Canvas,
        photoUriStr: String?,
        left: Float,
        top: Float,
        width: Float,
        height: Float
    ) {
        val photoBorderPaint = Paint().apply {
            color = Color.BLACK
            style = Paint.Style.STROKE
            strokeWidth = 1f
            isAntiAlias = true
        }

        var bitmapDrawn = false
        if (!photoUriStr.isNullOrBlank()) {
            try {
                val uri = Uri.parse(photoUriStr)
                val inputStream = context.contentResolver.openInputStream(uri)
                val bitmap = BitmapFactory.decodeStream(inputStream)
                inputStream?.close()
                if (bitmap != null) {
                    val destRect = RectF(left, top, left + width, top + height)
                    canvas.drawBitmap(bitmap, null, destRect, Paint(Paint.FILTER_BITMAP_FLAG))
                    bitmapDrawn = true
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        if (!bitmapDrawn) {
            // Draw neat formal photo box placeholder
            val bgPaint = Paint().apply {
                color = Color.parseColor("#F9F9F9")
                style = Paint.Style.FILL
            }
            canvas.drawRect(left, top, left + width, top + height, bgPaint)

            val textPaint = TextPaint().apply {
                color = Color.DKGRAY
                textSize = 7.5f
                typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("पासपोर्ट फोटो", left + (width / 2f), top + (height / 2f) - 4f, textPaint)
            canvas.drawText("(Passport Photo)", left + (width / 2f), top + (height / 2f) + 8f, textPaint)
        }

        canvas.drawRect(left, top, left + width, top + height, photoBorderPaint)
    }

    private fun drawSectionHeader(canvas: Canvas, title: String, left: Float, right: Float, y: Float) {
        val titlePaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 9.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            isAntiAlias = true
        }
        canvas.drawText(title, left, y, titlePaint)

        val linePaint = Paint().apply {
            color = Color.BLACK
            strokeWidth = 0.9f
            style = Paint.Style.STROKE
            isAntiAlias = true
        }
        canvas.drawLine(left, y + 3.5f, right, y + 3.5f, linePaint)
    }

    private fun drawEducationTable(
        canvas: Canvas,
        educationList: List<EducationItem>,
        left: Float,
        right: Float,
        startY: Float
    ): Float {
        var currentY = startY
        val tableWidth = right - left

        // Column widths
        val col1W = 28f // S.No
        val col2W = 120f // Exam / Degree
        val col3W = 145f // Board / University
        val col4W = 90f // Stream / Subject
        val col5W = 55f // Year
        val col6W = tableWidth - (col1W + col2W + col3W + col4W + col5W) // Marks / %

        val headerH = 14f
        val rowH = 14f

        val borderPaint = Paint().apply {
            color = Color.BLACK
            style = Paint.Style.STROKE
            strokeWidth = 0.8f
            isAntiAlias = true
        }

        val headerBgPaint = Paint().apply {
            color = Color.parseColor("#EFEFEF")
            style = Paint.Style.FILL
        }

        val headerTextPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 7.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }

        val cellTextPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 7.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            isAntiAlias = true
        }

        val cellTextCenterPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 7.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }

        // Draw Header background
        canvas.drawRect(left, currentY, right, currentY + headerH, headerBgPaint)
        canvas.drawRect(left, currentY, right, currentY + headerH, borderPaint)

        // Draw Header Text
        var cX = left
        canvas.drawText("क्र.", cX + col1W / 2, currentY + 10f, headerTextPaint)
        cX += col1W
        canvas.drawText("परीक्षा / कोर्स (Degree/Course)", cX + col2W / 2, currentY + 10f, headerTextPaint)
        cX += col2W
        canvas.drawText("बोर्ड / संस्थान (Board/Institute)", cX + col3W / 2, currentY + 10f, headerTextPaint)
        cX += col3W
        canvas.drawText("संकाय (Stream)", cX + col4W / 2, currentY + 10f, headerTextPaint)
        cX += col4W
        canvas.drawText("वर्ष (Year)", cX + col5W / 2, currentY + 10f, headerTextPaint)
        cX += col5W
        canvas.drawText("प्राप्तांक %", cX + col6W / 2, currentY + 10f, headerTextPaint)

        currentY += headerH

        // Draw Rows
        val items = if (educationList.isEmpty()) TeacherResume.defaultEducationList() else educationList
        items.forEachIndexed { index, item ->
            canvas.drawRect(left, currentY, right, currentY + rowH, borderPaint)

            var cellX = left
            // Col 1: S.No
            canvas.drawText("${index + 1}", cellX + col1W / 2, currentY + 10f, cellTextCenterPaint)
            cellX += col1W
            canvas.drawLine(cellX, currentY, cellX, currentY + rowH, borderPaint)

            // Col 2: Course
            canvas.drawText(item.courseName.take(24), cellX + 3f, currentY + 10f, cellTextPaint)
            cellX += col2W
            canvas.drawLine(cellX, currentY, cellX, currentY + rowH, borderPaint)

            // Col 3: Board
            canvas.drawText(item.boardOrUniversity.take(28), cellX + 3f, currentY + 10f, cellTextPaint)
            cellX += col3W
            canvas.drawLine(cellX, currentY, cellX, currentY + rowH, borderPaint)

            // Col 4: Stream
            canvas.drawText(item.stream.take(16), cellX + 3f, currentY + 10f, cellTextPaint)
            cellX += col4W
            canvas.drawLine(cellX, currentY, cellX, currentY + rowH, borderPaint)

            // Col 5: Year
            canvas.drawText(item.passingYear, cellX + col5W / 2, currentY + 10f, cellTextCenterPaint)
            cellX += col5W
            canvas.drawLine(cellX, currentY, cellX, currentY + rowH, borderPaint)

            // Col 6: %
            canvas.drawText(item.percentageOrGrade, cellX + col6W / 2, currentY + 10f, cellTextCenterPaint)

            currentY += rowH
        }

        return currentY
    }

    private fun drawExperienceSection(
        canvas: Canvas,
        experienceList: List<ExperienceItem>,
        left: Float,
        right: Float,
        startY: Float
    ): Float {
        var currentY = startY
        val validExperiences = experienceList.filter { it.organizationName.isNotBlank() || it.post.isNotBlank() }

        val boldPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            isAntiAlias = true
        }
        val textPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            isAntiAlias = true
        }

        if (validExperiences.isEmpty()) {
            canvas.drawText("• फ्रेशर (Fresher) - होम ट्यूशन एवं अध्यापन में गहरी रुचि तथा सक्रिय अभ्यास।", left + 4f, currentY + 2f, textPaint)
            currentY += 13f
        } else {
            validExperiences.forEachIndexed { index, exp ->
                val orgTitle = "${index + 1}. ${exp.organizationName.ifBlank { "विद्यालय / संस्था" }} | पद: ${exp.post.ifBlank { "सहायक शिक्षिका" }} | अवधि: ${exp.duration.ifBlank { "-" }}"
                canvas.drawText(orgTitle, left + 4f, currentY + 2f, boldPaint)
                currentY += 11f

                if (exp.responsibilities.isNotBlank()) {
                    val respText = "   कार्य विवरण: ${exp.responsibilities}"
                    canvas.drawText(respText.take(95), left + 4f, currentY + 1f, textPaint)
                    currentY += 11f
                }
            }
        }
        return currentY
    }

    private fun drawSkillsSection(
        canvas: Canvas,
        skillsList: List<SkillItem>,
        left: Float,
        right: Float,
        startY: Float
    ): Float {
        var currentY = startY
        val activeSkills = skillsList.filter { it.isChecked && it.name.isNotBlank() }

        val textPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            isAntiAlias = true
        }

        val colWidth = (right - left) / 2f
        val rows = (activeSkills.size + 1) / 2

        for (i in 0 until rows) {
            val idx1 = i * 2
            val idx2 = idx1 + 1

            if (idx1 < activeSkills.size) {
                canvas.drawText("• ${activeSkills[idx1].name.take(45)}", left + 4f, currentY + 2f, textPaint)
            }
            if (idx2 < activeSkills.size) {
                canvas.drawText("• ${activeSkills[idx2].name.take(45)}", left + colWidth + 4f, currentY + 2f, textPaint)
            }
            currentY += 12f
        }
        return currentY
    }

    private fun drawLanguagesAndAchievements(
        canvas: Canvas,
        languageList: List<LanguageItem>,
        achievementsList: List<String>,
        left: Float,
        right: Float,
        startY: Float
    ): Float {
        var currentY = startY
        val boldPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            isAntiAlias = true
        }
        val textPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            isAntiAlias = true
        }

        // Languages Line
        canvas.drawText("भाषा ज्ञान (Languages):", left + 4f, currentY + 2f, boldPaint)
        val langStr = languageList.joinToString("  |  ") { lang ->
            val proficiencies = mutableListOf<String>()
            if (lang.canRead) proficiencies.add("पढ़ना")
            if (lang.canWrite) proficiencies.add("लिखना")
            if (lang.canSpeak) proficiencies.add("बोलना")
            "${lang.language} (${proficiencies.joinToString("/")})"
        }
        canvas.drawText(langStr.ifBlank { "Hindi, English" }, left + 125f, currentY + 2f, textPaint)
        currentY += 14f

        // Achievements
        val validAchievements = achievementsList.filter { it.isNotBlank() }
        if (validAchievements.isNotEmpty()) {
            canvas.drawText("उपलब्धियां (Achievements):", left + 4f, currentY + 2f, boldPaint)
            currentY += 12f
            validAchievements.forEach { ach ->
                canvas.drawText("• ${ach.take(85)}", left + 12f, currentY + 1f, textPaint)
                currentY += 11f
            }
        }
        return currentY
    }

    private fun renderBlankPage(
        pdfDocument: PdfDocument,
        blankPage: BlankPageItem,
        pageNumber: Int
    ) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, pageNumber).create()
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        drawBlankPageContent(canvas, blankPage, pageNumber)

        pdfDocument.finishPage(page)
    }

    fun drawBlankPageContent(
        canvas: Canvas,
        blankPage: BlankPageItem,
        pageNumber: Int,
        scale: Float = 1f
    ) {
        if (scale != 1f) {
            canvas.save()
            canvas.scale(scale, scale)
        }

        // Background
        val bgPaint = Paint().apply {
            color = Color.WHITE
            style = Paint.Style.FILL
        }
        canvas.drawRect(0f, 0f, PAGE_WIDTH.toFloat(), PAGE_HEIGHT.toFloat(), bgPaint)

        // Outer Border
        val borderPaint = Paint().apply {
            color = Color.BLACK
            style = Paint.Style.STROKE
            strokeWidth = 1.2f
            isAntiAlias = true
        }
        val innerBorderMargin = 24f
        canvas.drawRect(
            innerBorderMargin,
            innerBorderMargin,
            PAGE_WIDTH - innerBorderMargin,
            PAGE_HEIGHT - innerBorderMargin,
            borderPaint
        )

        val thinBorderPaint = Paint().apply {
            color = Color.DKGRAY
            style = Paint.Style.STROKE
            strokeWidth = 0.5f
            isAntiAlias = true
        }
        canvas.drawRect(
            innerBorderMargin + 2.5f,
            innerBorderMargin + 2.5f,
            PAGE_WIDTH - innerBorderMargin - 2.5f,
            PAGE_HEIGHT - innerBorderMargin - 2.5f,
            thinBorderPaint
        )

        var currentY = 50f
        val leftMargin = MARGIN + 10f
        val rightMargin = PAGE_WIDTH - MARGIN - 10f
        val textWidth = (rightMargin - leftMargin).toInt()

        // Page Title Header
        val titleText = if (blankPage.pageTitle.isNotBlank()) blankPage.pageTitle else "अतिरिक्त विवरण / ATTACHMENT (PAGE $pageNumber)"
        val titlePaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 13f
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }
        canvas.drawText(titleText, PAGE_WIDTH / 2f, currentY, titlePaint)
        currentY += 8f

        val linePaint = Paint().apply {
            color = Color.BLACK
            strokeWidth = 1f
            style = Paint.Style.STROKE
            isAntiAlias = true
        }
        canvas.drawLine(leftMargin, currentY, rightMargin, currentY, linePaint)
        currentY += 24f

        // Content Body with StaticLayout for proper text wrapping
        val bodyPaint = TextPaint().apply {
            color = Color.BLACK
            textSize = 10.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            isAntiAlias = true
        }

        val textToRender = if (blankPage.content.isNotBlank()) {
            blankPage.content
        } else {
            "(इस पृष्ठ पर अतिरिक्त नोट्स, शिक्षण अनुभव या आवेदन पत्र लिख सकते हैं / Empty White A4 Page)"
        }

        val staticLayout = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            android.text.StaticLayout.Builder.obtain(
                textToRender,
                0,
                textToRender.length,
                bodyPaint,
                textWidth
            ).setAlignment(Layout.Alignment.ALIGN_NORMAL)
             .setLineSpacing(4f, 1.15f)
             .setIncludePad(true)
             .build()
        } else {
            @Suppress("DEPRECATION")
            StaticLayout(
                textToRender,
                bodyPaint,
                textWidth,
                Layout.Alignment.ALIGN_NORMAL,
                1.15f,
                4f,
                true
            )
        }

        canvas.save()
        canvas.translate(leftMargin, currentY)
        staticLayout.draw(canvas)
        canvas.restore()

        // Page Number at bottom
        val pageNumPaint = TextPaint().apply {
            color = Color.DKGRAY
            textSize = 8.5f
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
            textAlign = Paint.Align.CENTER
            isAntiAlias = true
        }
        canvas.drawText("- Page $pageNumber -", PAGE_WIDTH / 2f, PAGE_HEIGHT - 32f, pageNumPaint)

        if (scale != 1f) {
            canvas.restore()
        }
    }
}
