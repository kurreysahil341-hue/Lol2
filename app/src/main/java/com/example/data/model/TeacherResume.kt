package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class EducationItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val courseName: String = "",
    val boardOrUniversity: String = "",
    val stream: String = "",
    val passingYear: String = "",
    val percentageOrGrade: String = "",
    val isDefault: Boolean = false
)

@JsonClass(generateAdapter = true)
data class ExperienceItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val organizationName: String = "",
    val post: String = "",
    val duration: String = "",
    val responsibilities: String = ""
)

@JsonClass(generateAdapter = true)
data class SkillItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val name: String = "",
    val isChecked: Boolean = true,
    val isCustom: Boolean = false
)

@JsonClass(generateAdapter = true)
data class LanguageItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val language: String = "",
    val canRead: Boolean = true,
    val canWrite: Boolean = true,
    val canSpeak: Boolean = true
)

@JsonClass(generateAdapter = true)
data class BlankPageItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val pageTitle: String = "",
    val content: String = ""
)

@Entity(tableName = "teacher_resumes")
data class TeacherResume(
    @PrimaryKey val id: Long = 1L,
    val fullName: String = "",
    val appliedPost: String = "प्री-प्राइमरी असिस्टेंट टीचर (Pre-Primary / Assistant Teacher)",
    val photoUri: String? = null,
    val fatherName: String = "",
    val dob: String = "",
    val age: String = "",
    val gender: String = "Female",
    val maritalStatus: String = "Unmarried",
    val mobileNumber: String = "",
    val emailId: String = "",
    val address: String = "",
    val pinCode: String = "",
    val educationList: List<EducationItem> = defaultEducationList(),
    val experienceList: List<ExperienceItem> = defaultExperienceList(),
    val skillsList: List<SkillItem> = defaultSkillsList(),
    val languageList: List<LanguageItem> = defaultLanguageList(),
    val achievementsList: List<String> = emptyList(),
    val blankPages: List<BlankPageItem> = emptyList(),
    val updatedAt: Long = System.currentTimeMillis()
) {
    companion object {
        fun defaultEducationList(): List<EducationItem> = listOf(
            EducationItem(
                id = "edu_10th",
                courseName = "10th (Secondary)",
                boardOrUniversity = "State Board / CBSE",
                stream = "General",
                passingYear = "2020",
                percentageOrGrade = "75%",
                isDefault = true
            ),
            EducationItem(
                id = "edu_12th",
                courseName = "12th (Higher Secondary)",
                boardOrUniversity = "State Board / CBSE",
                stream = "Arts / Science / Commerce",
                passingYear = "2022",
                percentageOrGrade = "72%",
                isDefault = true
            )
        )

        fun defaultExperienceList(): List<ExperienceItem> = listOf(
            ExperienceItem(
                id = "exp_default_1",
                organizationName = "",
                post = "Assistant Teacher / Home Tutor",
                duration = "",
                responsibilities = ""
            )
        )

        fun defaultSkillsList(): List<SkillItem> = listOf(
            SkillItem(id = "skill_1", name = "धैर्य एवं बच्चों की देखभाल (Patience & Child Care)", isChecked = true, isCustom = false),
            SkillItem(id = "skill_2", name = "कहानी सुनाना और बाल कविताएँ (Storytelling & Rhymes)", isChecked = true, isCustom = false),
            SkillItem(id = "skill_3", name = "कला एवं शिल्प (Art & Craft / Drawing)", isChecked = true, isCustom = false),
            SkillItem(id = "skill_4", name = "कक्षा प्रबंधन (Classroom Management)", isChecked = true, isCustom = false),
            SkillItem(id = "skill_5", name = "कंप्यूटर ज्ञान (MS Office & Basic Computer)", isChecked = true, isCustom = false)
        )

        fun defaultLanguageList(): List<LanguageItem> = listOf(
            LanguageItem(id = "lang_hindi", language = "Hindi (हिंदी)", canRead = true, canWrite = true, canSpeak = true),
            LanguageItem(id = "lang_english", language = "English (अंग्रेजी)", canRead = true, canWrite = true, canSpeak = true)
        )

        fun sampleResume(): TeacherResume = TeacherResume(
            id = 1L,
            fullName = "पूजा शर्मा (Pooja Sharma)",
            appliedPost = "प्री-प्राइमरी असिस्टेंट टीचर (Pre-Primary Assistant Teacher)",
            photoUri = null,
            fatherName = "श्री राजेश शर्मा (Shri Rajesh Sharma)",
            dob = "15/07/2004",
            age = "22 Years",
            gender = "Female",
            maritalStatus = "Unmarried",
            mobileNumber = "9876543210",
            emailId = "pooja.sharma.teacher@email.com",
            address = "मकान नं. 45, शांति नगर, निकट सरस्वती शिशु मंदिर",
            pinCode = "492001",
            educationList = listOf(
                EducationItem(
                    id = "edu_10th",
                    courseName = "10th (Secondary)",
                    boardOrUniversity = "C.G. Board Raipur",
                    stream = "General",
                    passingYear = "2020",
                    percentageOrGrade = "78.4%",
                    isDefault = true
                ),
                EducationItem(
                    id = "edu_12th",
                    courseName = "12th (Higher Secondary)",
                    boardOrUniversity = "C.G. Board Raipur",
                    stream = "Arts (कला संकाय)",
                    passingYear = "2022",
                    percentageOrGrade = "74.2%",
                    isDefault = true
                ),
                EducationItem(
                    id = "edu_ntt",
                    courseName = "Nursery Teacher Training (NTT) Diploma",
                    boardOrUniversity = "National Early Childhood Institute",
                    stream = "Early Childhood Education",
                    passingYear = "2023",
                    percentageOrGrade = "A Grade",
                    isDefault = false
                ),
                EducationItem(
                    id = "edu_dca",
                    courseName = "DCA (Diploma in Computer Applications)",
                    boardOrUniversity = "Makhanlal Chaturvedi University",
                    stream = "Computer Applications",
                    passingYear = "2023",
                    percentageOrGrade = "First Div",
                    isDefault = false
                )
            ),
            experienceList = listOf(
                ExperienceItem(
                    id = "exp_1",
                    organizationName = "लिटिल एंजेल्स प्ले स्कूल (Little Angels Play School)",
                    post = "असिस्टेंट नर्सरी टीचर (Assistant Nursery Teacher)",
                    duration = "1 Year (July 2023 - June 2024)",
                    responsibilities = "बच्चों को खेल-खेल में वर्णमाला, गिनती, राइम्स सिखाना तथा कला-क्राफ्ट गतिविधियाँ कराना।"
                ),
                ExperienceItem(
                    id = "exp_2",
                    organizationName = "होम ट्यूशन (Home Tuition)",
                    post = "प्राइमरी ट्यूटर (Primary Tutor for KG to 3rd)",
                    duration = "2 Years (2022 - Present)",
                    responsibilities = "बच्चों के बुनियादी पठन-पाठन, सुंदर लिखावट और गृहकार्य में मार्गदर्शन।"
                )
            ),
            skillsList = listOf(
                SkillItem(id = "skill_1", name = "धैर्य एवं बच्चों की देखभाल (Patience & Child Care)", isChecked = true, isCustom = false),
                SkillItem(id = "skill_2", name = "कहानी सुनाना और बाल कविताएँ (Storytelling & Rhymes)", isChecked = true, isCustom = false),
                SkillItem(id = "skill_3", name = "कला एवं शिल्प (Art & Craft / Drawing)", isChecked = true, isCustom = false),
                SkillItem(id = "skill_4", name = "कक्षा प्रबंधन (Classroom Management)", isChecked = true, isCustom = false),
                SkillItem(id = "skill_5", name = "कंप्यूटर ज्ञान (MS Office & Basic Computer)", isChecked = true, isCustom = false),
                SkillItem(id = "skill_custom_1", name = "ध्वनि विज्ञान एवं फोनिक्स (Phonics & Activity-based Learning)", isChecked = true, isCustom = true)
            ),
            languageList = listOf(
                LanguageItem(id = "lang_hindi", language = "Hindi (हिंदी)", canRead = true, canWrite = true, canSpeak = true),
                LanguageItem(id = "lang_english", language = "English (अंग्रेजी)", canRead = true, canWrite = true, canSpeak = true),
                LanguageItem(id = "lang_chhattisgarhi", language = "Chhattisgarhi (छत्तीसगढ़ी)", canRead = true, canWrite = true, canSpeak = true)
            ),
            achievementsList = listOf(
                "स्कूल स्तर पर सर्वश्रेष्ठ हस्तलेखन (Best Handwriting Award) पुरस्कार प्राप्त",
                "वार्षिक उत्सव में बाल नृत्य एवं नाटक निर्देशन का सफल अनुभव",
                "राज्य स्तरीय कला एवं चित्रकला प्रतियोगिता में द्वितीय स्थान"
            ),
            blankPages = listOf(
                BlankPageItem(
                    id = "blank_sample_1",
                    pageTitle = "शिक्षण दृष्टिकोण एवं व्यक्तिगत विवरण (Teaching Philosophy & Note)",
                    content = "मेरा उद्देश्य छोटे बच्चों को स्नेह, धैर्य और रचनात्मक गतिविधियों के माध्यम से शिक्षा के प्रति आकर्षित करना है। मैं 12वीं उत्तीर्ण होने के साथ नर्सरी टीचर ट्रेनिंग (NTT) में प्रशिक्षित हूँ। विद्यालय के अनुशासन और गरिमा को बनाए रखते हुए प्रत्येक बच्चे के सर्वांगीण विकास में अपना शत-प्रतिशत योगदान देने के लिए तत्पर हूँ।"
                )
            )
        )
    }
}
