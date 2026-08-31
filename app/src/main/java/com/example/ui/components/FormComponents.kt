package com.example.ui.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AddAPhoto
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Work
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.BlankPageItem
import com.example.data.model.EducationItem
import com.example.data.model.ExperienceItem
import com.example.data.model.LanguageItem
import com.example.data.model.SkillItem
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun FormSectionHeader(
    title: String,
    subtitle: String? = null,
    icon: ImageVector? = null,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            if (icon != null) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    ),
                    color = MaterialTheme.colorScheme.primary
                )
                if (!subtitle.isNullOrBlank()) {
                    Text(
                        text = subtitle,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        HorizontalDivider(
            thickness = 1.5.dp,
            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.35f)
        )
    }
}

@Composable
fun PassportPhotoPicker(
    photoUriString: String?,
    onPhotoSelected: (String?) -> Unit,
    modifier: Modifier = Modifier
) {
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        onPhotoSelected(uri?.toString())
    }

    Card(
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)
        ),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(width = 85.dp, height = 105.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color.White)
                    .border(
                        BorderStroke(1.5.dp, MaterialTheme.colorScheme.outline),
                        RoundedCornerShape(8.dp)
                    )
                    .clickable { photoPickerLauncher.launch("image/*") }
                    .testTag("photo_picker_box"),
                contentAlignment = Alignment.Center
            ) {
                if (!photoUriString.isNullOrBlank()) {
                    AsyncImage(
                        model = photoUriString,
                        contentDescription = "Passport Photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.size(width = 85.dp, height = 105.dp)
                    )
                } else {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddAPhoto,
                            contentDescription = "Upload Photo",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(26.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "फोटो लगाएं\nPassport",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                            lineHeight = 12.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "पासपोर्ट साइज फोटो (Passport Photo)",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold)
                )
                Text(
                    text = "गैलरी से फॉर्म हेतु पासपोर्ट आकार की फोटो चुनें",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { photoPickerLauncher.launch("image/*") },
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.testTag("choose_photo_button")
                    ) {
                        Icon(Icons.Default.AddAPhoto, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("फोटो चुनें", fontSize = 12.sp)
                    }
                    if (!photoUriString.isNullOrBlank()) {
                        OutlinedButton(
                            onClick = { onPhotoSelected(null) },
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = MaterialTheme.colorScheme.error
                            ),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.error),
                            modifier = Modifier.testTag("remove_photo_button")
                        ) {
                            Text("हटाएं", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DateOfBirthPicker(
    dobValue: String,
    ageValue: String,
    onDobChanged: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var showDatePicker by remember { mutableStateOf(false) }
    val datePickerState = rememberDatePickerState()

    if (showDatePicker) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    val selectedMillis = datePickerState.selectedDateMillis
                    if (selectedMillis != null) {
                        val formattedDate = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                            .format(Date(selectedMillis))
                        onDobChanged(formattedDate)
                    }
                    showDatePicker = false
                }) {
                    Text("OK")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text("Cancel")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = dobValue,
            onValueChange = onDobChanged,
            label = { Text("जन्म तिथि (Date of Birth) DD/MM/YYYY") },
            placeholder = { Text("15/07/2004") },
            trailingIcon = {
                IconButton(onClick = { showDatePicker = true }) {
                    Icon(
                        imageVector = Icons.Default.CalendarMonth,
                        contentDescription = "Select Date of Birth",
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
            modifier = Modifier
                .fillMaxWidth()
                .testTag("dob_input_field"),
            shape = RoundedCornerShape(8.dp),
            singleLine = true
        )

        if (ageValue.isNotBlank()) {
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 4.dp)
            ) {
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = "आयु (Auto-Calculated Age): $ageValue",
                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun GenderSelector(
    selectedGender: String,
    onGenderSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = "लिंग (Gender)",
            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            listOf("Female (महिला)", "Male (पुरुष)", "Other (अन्य)").forEach { option ->
                val code = when {
                    option.startsWith("Female") -> "Female"
                    option.startsWith("Male") -> "Male"
                    else -> "Other"
                }
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable { onGenderSelected(code) }
                ) {
                    RadioButton(
                        selected = (selectedGender.equals(code, ignoreCase = true) ||
                                (code == "Female" && selectedGender.isBlank())),
                        onClick = { onGenderSelected(code) }
                    )
                    Text(text = option, fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
fun MaritalStatusSelector(
    selectedStatus: String,
    onStatusSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = "वैवाहिक स्थिति (Marital Status)",
            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            listOf("Unmarried (अविवाहित)", "Married (विवाहित)").forEach { option ->
                val code = if (option.startsWith("Unmarried")) "Unmarried" else "Married"
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable { onStatusSelected(code) }
                ) {
                    RadioButton(
                        selected = (selectedStatus.equals(code, ignoreCase = true) ||
                                (code == "Unmarried" && selectedStatus.isBlank())),
                        onClick = { onStatusSelected(code) }
                    )
                    Text(text = option, fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
fun EducationItemCard(
    item: EducationItem,
    index: Int,
    onUpdate: (EducationItem) -> Unit,
    onDelete: () -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedCard(
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.outlinedCardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${index + 1}",
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (item.courseName.isNotBlank()) item.courseName else "Education / Course",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                }

                if (!item.isDefault) {
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(28.dp).testTag("delete_edu_${item.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Qualification",
                            tint = MaterialTheme.colorScheme.error,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Course Name (Editable if custom, or pre-filled if 10th/12th)
            OutlinedTextField(
                value = item.courseName,
                onValueChange = { onUpdate(item.copy(courseName = it)) },
                label = { Text("परीक्षा / डिग्री / डिप्लोमा (Course/Degree)") },
                placeholder = { Text("e.g. 10th / 12th / NTT / DCA / B.A.") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Board & Stream
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = item.boardOrUniversity,
                    onValueChange = { onUpdate(item.copy(boardOrUniversity = it)) },
                    label = { Text("बोर्ड / संस्थान (Board/Inst.)") },
                    placeholder = { Text("State Board / CBSE") },
                    modifier = Modifier.weight(1.2f),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )

                OutlinedTextField(
                    value = item.stream,
                    onValueChange = { onUpdate(item.copy(stream = it)) },
                    label = { Text("संकाय (Stream/Subject)") },
                    placeholder = { Text("Arts / Sci / All") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Passing Year & Percentage
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = item.passingYear,
                    onValueChange = { onUpdate(item.copy(passingYear = it)) },
                    label = { Text("वर्ष (Year)") },
                    placeholder = { Text("2022") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )

                OutlinedTextField(
                    value = item.percentageOrGrade,
                    onValueChange = { onUpdate(item.copy(percentageOrGrade = it)) },
                    label = { Text("प्राप्तांक % (Percentage/Grade)") },
                    placeholder = { Text("78.4% / Grade A") },
                    modifier = Modifier.weight(1.2f),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )
            }
        }
    }
}

@Composable
fun ExperienceItemCard(
    item: ExperienceItem,
    index: Int,
    onUpdate: (ExperienceItem) -> Unit,
    onDelete: () -> Unit,
    canDelete: Boolean,
    modifier: Modifier = Modifier
) {
    OutlinedCard(
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.outlinedCardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.secondary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${index + 1}",
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "अनुभव / Experience #${index + 1}",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                }

                if (canDelete) {
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(28.dp).testTag("delete_exp_${item.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Experience",
                            tint = MaterialTheme.colorScheme.error,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = item.organizationName,
                onValueChange = { onUpdate(item.copy(organizationName = it)) },
                label = { Text("स्कूल / संस्था का नाम (School/Organization Name)") },
                placeholder = { Text("e.g. सरस्वती शिशु मंदिर / Home Tuition") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = item.post,
                    onValueChange = { onUpdate(item.copy(post = it)) },
                    label = { Text("पद (Post / Role)") },
                    placeholder = { Text("Assistant Teacher / Tutor") },
                    modifier = Modifier.weight(1.2f),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )

                OutlinedTextField(
                    value = item.duration,
                    onValueChange = { onUpdate(item.copy(duration = it)) },
                    label = { Text("अवधि (Duration)") },
                    placeholder = { Text("1 Year / 6 Months") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    singleLine = true
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = item.responsibilities,
                onValueChange = { onUpdate(item.copy(responsibilities = it)) },
                label = { Text("मुख्य कार्य एवं जिम्मेदारियां (Key Responsibilities)") },
                placeholder = { Text("e.g. नर्सरी बच्चों को राइम्स, वर्णमाला एवं हस्तकला सिखाना") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                minLines = 2,
                maxLines = 4
            )
        }
    }
}

@Composable
fun BlankPageItemCard(
    item: BlankPageItem,
    pageNumber: Int,
    onUpdate: (BlankPageItem) -> Unit,
    onDelete: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        border = BorderStroke(1.5.dp, MaterialTheme.colorScheme.outlineVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Description,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "📄 अतिरिक्त A4 पृष्ठ (Extra Page $pageNumber)",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                }

                IconButton(
                    onClick = onDelete,
                    modifier = Modifier.size(32.dp).testTag("delete_blank_page_${item.id}")
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Delete Blank Page",
                        tint = MaterialTheme.colorScheme.error,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Text(
                text = "यह पृष्ठ PDF/प्रिंट में एक स्वतंत्र A4 पेज के रूप में शामिल होगा। यहाँ आप कवर लेटर, शिक्षण उद्देश्य या नोट्स लिख सकते हैं।",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = item.pageTitle,
                onValueChange = { onUpdate(item.copy(pageTitle = it)) },
                label = { Text("पेज शीर्षक (Page Title / Header)") },
                placeholder = { Text("e.g. Cover Letter / Teaching Philosophy / आवेदन पत्र") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = item.content,
                onValueChange = { onUpdate(item.copy(content = it)) },
                label = { Text("पेज सामग्री (Page Content / Write anything)") },
                placeholder = { Text("यहाँ अपनी बात, शिक्षण दृष्टिकोण, पूर्व अनुभव का विस्तृत विवरण या आवेदन पत्र लिखें...") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("blank_page_content_${item.id}"),
                shape = RoundedCornerShape(8.dp),
                minLines = 6,
                maxLines = 14
            )
        }
    }
}
