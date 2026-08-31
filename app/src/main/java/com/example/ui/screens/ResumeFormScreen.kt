package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ContactMail
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PostAdd
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material.icons.filled.Work
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.TeacherResume
import com.example.ui.ResumeViewModel
import com.example.ui.components.BlankPageItemCard
import com.example.ui.components.DateOfBirthPicker
import com.example.ui.components.EducationItemCard
import com.example.ui.components.ExperienceItemCard
import com.example.ui.components.FormSectionHeader
import com.example.ui.components.GenderSelector
import com.example.ui.components.MaritalStatusSelector
import com.example.ui.components.PassportPhotoPicker

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ResumeFormScreen(
    viewModel: ResumeViewModel,
    resume: TeacherResume,
    modifier: Modifier = Modifier
) {
    var showAddSkillDialog by remember { mutableStateOf(false) }
    var customSkillInput by remember { mutableStateOf("") }

    var showAddLanguageDialog by remember { mutableStateOf(false) }
    var customLanguageInput by remember { mutableStateOf("") }

    var showAddAchievementDialog by remember { mutableStateOf(false) }
    var customAchievementInput by remember { mutableStateOf("") }

    // Dialog for Custom Skill
    if (showAddSkillDialog) {
        AlertDialog(
            onDismissRequest = { showAddSkillDialog = false },
            title = { Text("➕ नया शिक्षण कौशल जोड़ें (Add Custom Skill)") },
            text = {
                Column {
                    Text("कोई भी अतिरिक्त कौशल लिखें (जैसे: Phonics, बाल संगीत, ब्लैकबोर्ड राइटिंग आदि):", fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = customSkillInput,
                        onValueChange = { customSkillInput = it },
                        label = { Text("कौशल का नाम (Skill Name)") },
                        placeholder = { Text("e.g. Phonics & Pronunciation") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth().testTag("custom_skill_input")
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (customSkillInput.isNotBlank()) {
                            viewModel.addCustomSkill(customSkillInput)
                            customSkillInput = ""
                        }
                        showAddSkillDialog = false
                    },
                    modifier = Modifier.testTag("confirm_add_skill_btn")
                ) {
                    Text("जोड़ें (Add)")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddSkillDialog = false }) {
                    Text("रद्द करें")
                }
            }
        )
    }

    // Dialog for Custom Language
    if (showAddLanguageDialog) {
        AlertDialog(
            onDismissRequest = { showAddLanguageDialog = false },
            title = { Text("➕ अन्य भाषा जोड़ें (Add Language)") },
            text = {
                Column {
                    Text("भाषा का नाम लिखें (जैसे: Sanskrit, Chhattisgarhi, Punjabi, Bengali आदि):", fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = customLanguageInput,
                        onValueChange = { customLanguageInput = it },
                        label = { Text("भाषा (Language Name)") },
                        placeholder = { Text("e.g. Sanskrit (संस्कृत)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth().testTag("custom_language_input")
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (customLanguageInput.isNotBlank()) {
                            viewModel.addLanguage(customLanguageInput)
                            customLanguageInput = ""
                        }
                        showAddLanguageDialog = false
                    },
                    modifier = Modifier.testTag("confirm_add_lang_btn")
                ) {
                    Text("जोड़ें (Add)")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddLanguageDialog = false }) {
                    Text("रद्द करें")
                }
            }
        )
    }

    // Dialog for Custom Achievement
    if (showAddAchievementDialog) {
        AlertDialog(
            onDismissRequest = { showAddAchievementDialog = false },
            title = { Text("➕ उपलब्धि / प्रमाणपत्र जोड़ें (Add Achievement)") },
            text = {
                Column {
                    Text("कोई भी पुरस्कार, प्रतियोगिता या सम्मान का विवरण लिखें:", fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = customAchievementInput,
                        onValueChange = { customAchievementInput = it },
                        label = { Text("उपलब्धि (Achievement / Award)") },
                        placeholder = { Text("e.g. स्कूल स्तर पर सर्वश्रेष्ठ हस्तलेखन पुरस्कार") },
                        singleLine = false,
                        minLines = 2,
                        modifier = Modifier.fillMaxWidth().testTag("custom_achievement_input")
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (customAchievementInput.isNotBlank()) {
                            viewModel.addAchievement(customAchievementInput)
                            customAchievementInput = ""
                        }
                        showAddAchievementDialog = false
                    },
                    modifier = Modifier.testTag("confirm_add_achievement_btn")
                ) {
                    Text("जोड़ें (Add)")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddAchievementDialog = false }) {
                    Text("रद्द करें")
                }
            }
        )
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            // Auto-Save Status Banner
            Surface(
                color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF16A34A))
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "ऑफलाइन ऑटो-सेव सक्रिय (Auto-Saved locally in Room Database)",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
        }

        // 1. Photo & Header Section
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    FormSectionHeader(
                        title = "1. फोटो एवं आवेदित पद (Photo & Header Section)",
                        subtitle = "अभ्यर्थी का नाम एवं पद विवरण",
                        icon = Icons.Default.Badge
                    )

                    PassportPhotoPicker(
                        photoUriString = resume.photoUri,
                        onPhotoSelected = { viewModel.updatePhotoUri(it) }
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedTextField(
                        value = resume.fullName,
                        onValueChange = { viewModel.updateFullName(it) },
                        label = { Text("अभ्यर्थी का पूरा नाम (Full Name) *") },
                        placeholder = { Text("e.g. पूजा शर्मा / Pooja Sharma") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("full_name_input"),
                        shape = RoundedCornerShape(8.dp),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = resume.appliedPost,
                        onValueChange = { viewModel.updateAppliedPost(it) },
                        label = { Text("आवेदित पद (Applied Post) *") },
                        placeholder = { Text("प्री-प्राइमरी असिस्टेंट टीचर") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("applied_post_input"),
                        shape = RoundedCornerShape(8.dp),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Quick Post Suggestions
                    Text("त्वरित चयन (Quick Suggestions):", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(4.dp))
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        val posts = listOf(
                            "प्री-प्राइमरी टीचर",
                            "असिस्टेंट टीचर",
                            "नर्सरी टीचर (NTT)",
                            "प्राइमरी टीचर (PRT)",
                            "होम ट्यूटर / ट्यूशन"
                        )
                        posts.forEach { post ->
                            FilterChip(
                                selected = resume.appliedPost == post,
                                onClick = { viewModel.updateAppliedPost(post) },
                                label = { Text(post, fontSize = 11.sp) },
                                shape = RoundedCornerShape(16.dp)
                            )
                        }
                    }
                }
            }
        }

        // 2. Personal & Contact Details
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    FormSectionHeader(
                        title = "2. व्यक्तिगत एवं संपर्क विवरण (Personal Details)",
                        subtitle = "पिता का नाम, जन्म तिथि, लिंग, पता आदि",
                        icon = Icons.Default.ContactMail
                    )

                    OutlinedTextField(
                        value = resume.fatherName,
                        onValueChange = { viewModel.updateFatherName(it) },
                        label = { Text("पिता का नाम (Father's Name)") },
                        placeholder = { Text("श्री राजेश शर्मा / Shri Rajesh Sharma") },
                        modifier = Modifier.fillMaxWidth().testTag("father_name_input"),
                        shape = RoundedCornerShape(8.dp),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    DateOfBirthPicker(
                        dobValue = resume.dob,
                        ageValue = resume.age,
                        onDobChanged = { viewModel.updateDob(it) }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    GenderSelector(
                        selectedGender = resume.gender,
                        onGenderSelected = { viewModel.updateGender(it) }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    MaritalStatusSelector(
                        selectedStatus = resume.maritalStatus,
                        onStatusSelected = { viewModel.updateMaritalStatus(it) }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = resume.mobileNumber,
                            onValueChange = { viewModel.updateMobile(it) },
                            label = { Text("मोबाइल नं. (Mobile)") },
                            placeholder = { Text("9876543210") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                            modifier = Modifier.weight(1f).testTag("mobile_input"),
                            shape = RoundedCornerShape(8.dp),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = resume.emailId,
                            onValueChange = { viewModel.updateEmail(it) },
                            label = { Text("ईमेल (Email ID)") },
                            placeholder = { Text("name@email.com") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                            modifier = Modifier.weight(1.2f).testTag("email_input"),
                            shape = RoundedCornerShape(8.dp),
                            singleLine = true
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = resume.address,
                        onValueChange = { viewModel.updateAddress(it) },
                        label = { Text("पूरा पता (Full Address)") },
                        placeholder = { Text("मकान नं., वार्ड/कॉलोनी, ग्राम/शहर, जिला, राज्य") },
                        modifier = Modifier.fillMaxWidth().testTag("address_input"),
                        shape = RoundedCornerShape(8.dp),
                        minLines = 2,
                        maxLines = 3
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = resume.pinCode,
                        onValueChange = { viewModel.updatePinCode(it) },
                        label = { Text("पिन कोड (Pin Code)") },
                        placeholder = { Text("492001") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth().testTag("pincode_input"),
                        shape = RoundedCornerShape(8.dp),
                        singleLine = true
                    )
                }
            }
        }

        // 3. Educational Qualification Section (WITH "➕ Add More Education" Button)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    FormSectionHeader(
                        title = "3. शैक्षणिक योग्यता (Educational Qualifications)",
                        subtitle = "10वीं, 12वीं एवं अतिरिक्त डिप्लोमा/सर्टिफिकेट",
                        icon = Icons.Default.School
                    )

                    // Render Education Items
                    resume.educationList.forEachIndexed { index, eduItem ->
                        EducationItemCard(
                            item = eduItem,
                            index = index,
                            onUpdate = { viewModel.updateEducationItem(it) },
                            onDelete = { viewModel.removeEducationItem(eduItem.id) }
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    // Quick Diploma/Certificate Add Chips
                    Text(
                        text = "अतिरिक्त कोर्स का त्वरित चयन (Quick Add Diploma/Certificate):",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        val presets = listOf(
                            "NTT (नर्सरी टीचर ट्रेनिंग)",
                            "DCA (कंप्यूटर डिप्लोमा)",
                            "D.El.Ed (डिप्लोमा)",
                            "Spoken English",
                            "B.A. (ग्रेजुएशन)"
                        )
                        presets.forEach { preset ->
                            FilterChip(
                                selected = false,
                                onClick = { viewModel.addEducationItem(preset) },
                                label = { Text("+ $preset", fontSize = 11.sp) },
                                shape = RoundedCornerShape(16.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // CRITICAL: Button labeled "➕ Add More Education"
                    Button(
                        onClick = { viewModel.addEducationItem() },
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add_more_education_button"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            contentColor = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("➕ Add More Education (अन्य योग्यता जोड़ें)", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // 4. Work Experience Section (WITH "➕ Add More Experience" Button)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    FormSectionHeader(
                        title = "4. कार्य अनुभव (Work / Teaching Experience)",
                        subtitle = "स्कूल, कोचिंग, होम ट्यूशन या स्वयं सेवा का अनुभव",
                        icon = Icons.Default.Work
                    )

                    resume.experienceList.forEachIndexed { index, expItem ->
                        ExperienceItemCard(
                            item = expItem,
                            index = index,
                            onUpdate = { viewModel.updateExperienceItem(it) },
                            onDelete = { viewModel.removeExperienceItem(expItem.id) },
                            canDelete = resume.experienceList.size > 1
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    // CRITICAL: Button labeled "➕ Add More Experience"
                    Button(
                        onClick = { viewModel.addExperienceItem() },
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add_more_experience_button"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.secondaryContainer,
                            contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("➕ Add More Experience (अन्य अनुभव जोड़ें)", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // 5. Skills Section (WITH "➕ Add More Skill" Button)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    FormSectionHeader(
                        title = "5. शिक्षण कौशल (Key Skills & Abilities)",
                        subtitle = "प्राथमिक एवं पूर्व-प्राथमिक शिक्षण हेतु उपयुक्त कौशल",
                        icon = Icons.Default.Lightbulb
                    )

                    // Default & Custom Skills Checkboxes / Chips
                    resume.skillsList.forEach { skill ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { viewModel.toggleSkill(skill.id) }
                                .padding(vertical = 4.dp)
                        ) {
                            Checkbox(
                                checked = skill.isChecked,
                                onCheckedChange = { viewModel.toggleSkill(skill.id) },
                                colors = CheckboxDefaults.colors(checkedColor = MaterialTheme.colorScheme.primary)
                            )
                            Text(
                                text = skill.name,
                                fontSize = 13.5.sp,
                                modifier = Modifier.weight(1f)
                            )
                            if (skill.isCustom) {
                                IconButton(
                                    onClick = { viewModel.removeSkill(skill.id) },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Close,
                                        contentDescription = "Remove skill",
                                        tint = MaterialTheme.colorScheme.error,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // CRITICAL: Button labeled "➕ Add More Skill"
                    Button(
                        onClick = { showAddSkillDialog = true },
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add_more_skill_button"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                            contentColor = MaterialTheme.colorScheme.onTertiaryContainer
                        )
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("➕ Add More Skill (अन्य कौशल जोड़ें)", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // 6. Languages & Achievements Section (WITH "Add More" Buttons)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    FormSectionHeader(
                        title = "6. भाषा ज्ञान एवं उपलब्धियाँ (Languages & Achievements)",
                        subtitle = "भाषा प्रवीणता तथा पुरस्कार/सम्मान",
                        icon = Icons.Default.Translate
                    )

                    Text(
                        text = "भाषा ज्ञान (Languages Known):",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    resume.languageList.forEach { lang ->
                        OutlinedCard(
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = lang.language,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.5.sp
                                    )
                                    if (lang.id != "lang_hindi" && lang.id != "lang_english") {
                                        IconButton(
                                            onClick = { viewModel.removeLanguage(lang.id) },
                                            modifier = Modifier.size(24.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Delete,
                                                contentDescription = "Remove Language",
                                                tint = MaterialTheme.colorScheme.error,
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }
                                    }
                                }
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceEvenly
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.clickable {
                                            viewModel.updateLanguage(lang.copy(canRead = !lang.canRead))
                                        }
                                    ) {
                                        Checkbox(
                                            checked = lang.canRead,
                                            onCheckedChange = { viewModel.updateLanguage(lang.copy(canRead = it)) }
                                        )
                                        Text("पढ़ना (Read)", fontSize = 12.sp)
                                    }
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.clickable {
                                            viewModel.updateLanguage(lang.copy(canWrite = !lang.canWrite))
                                        }
                                    ) {
                                        Checkbox(
                                            checked = lang.canWrite,
                                            onCheckedChange = { viewModel.updateLanguage(lang.copy(canWrite = it)) }
                                        )
                                        Text("लिखना (Write)", fontSize = 12.sp)
                                    }
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.clickable {
                                            viewModel.updateLanguage(lang.copy(canSpeak = !lang.canSpeak))
                                        }
                                    ) {
                                        Checkbox(
                                            checked = lang.canSpeak,
                                            onCheckedChange = { viewModel.updateLanguage(lang.copy(canSpeak = it)) }
                                        )
                                        Text("बोलना (Speak)", fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }

                    // Button labeled "➕ Add More Language"
                    OutlinedButton(
                        onClick = { showAddLanguageDialog = true },
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add_more_language_button")
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("➕ Add More Language (अन्य भाषा जोड़ें)", fontSize = 13.sp)
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider()
                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "उपलब्धियां एवं प्रमाणपत्र (Achievements & Certificates):",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    if (resume.achievementsList.isEmpty()) {
                        Text(
                            text = "कोई उपलब्धि नहीं जोड़ी गई है। जोड़ने के लिए नीचे दिए गए बटन पर टैप करें।",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    } else {
                        resume.achievementsList.forEachIndexed { index, achievement ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.primary)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = achievement,
                                    fontSize = 13.sp,
                                    modifier = Modifier.weight(1f)
                                )
                                IconButton(
                                    onClick = { viewModel.removeAchievement(index) },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Close,
                                        contentDescription = "Delete Achievement",
                                        tint = MaterialTheme.colorScheme.error,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Button labeled "➕ Add More Achievement"
                    OutlinedButton(
                        onClick = { showAddAchievementDialog = true },
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add_more_achievement_button")
                    ) {
                        Icon(Icons.Default.EmojiEvents, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("➕ Add More Achievement (उपलब्धि जोड़ें)", fontSize = 13.sp)
                    }
                }
            }
        }

        // 7. Extra Blank Pages Section (CRITICAL FEATURE)
        item {
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
                ),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                shape = RoundedCornerShape(14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    FormSectionHeader(
                        title = "7. अतिरिक्त A4 पृष्ठ (Extra Blank Pages)",
                        subtitle = "कवर लेटर, शिक्षण दर्शन या अतिरिक्त संलग्नक हेतु",
                        icon = Icons.Default.Description
                    )

                    Text(
                        text = "आप जितने चाहें अतिरिक्त कोरे A4 पृष्ठ जोड़ सकते हैं। प्रत्येक पृष्ठ को PDF और प्रिंट में अलग पूर्ण A4 पेज के रूप में तैयार किया जाएगा।",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Render existing blank pages
                    resume.blankPages.forEachIndexed { index, blankPage ->
                        BlankPageItemCard(
                            item = blankPage,
                            pageNumber = index + 2, // Main page is Page 1
                            onUpdate = { viewModel.updateBlankPage(it) },
                            onDelete = { viewModel.removeBlankPage(blankPage.id) }
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    // CRITICAL FEATURE BUTTON: "📄 Add Blank Page"
                    Button(
                        onClick = { viewModel.addBlankPage() },
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("add_blank_page_button"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = Color.White
                        )
                    ) {
                        Icon(Icons.Default.PostAdd, contentDescription = null, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("📄 Add Blank Page (कोरा A4 पृष्ठ जोड़ें)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
        }

        // STRICT REQUIREMENT #9: NO DECLARATION SECTION!
        // We have completely omitted declaration / swaghoshan patra / signatures.

        item {
            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
