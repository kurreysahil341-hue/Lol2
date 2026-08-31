package com.example.ui.screens

import android.widget.Toast
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoFixHigh
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SecondaryTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.ResumeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: ResumeViewModel = viewModel(),
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val resume by viewModel.resumeState.collectAsState()
    var selectedTabIndex by remember { mutableIntStateOf(0) }
    var showMenu by remember { mutableStateOf(false) }
    var showClearConfirmDialog by remember { mutableStateOf(false) }

    if (showClearConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showClearConfirmDialog = false },
            title = { Text("फॉर्म रीसेट करें (Clear All Fields)?") },
            text = { Text("क्या आप सुनिश्चित हैं कि आप पूरा फॉर्म खाली करना चाहते हैं? सभी भरी हुई प्रविष्टियां मिट जाएंगी।") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.clearForm()
                        showClearConfirmDialog = false
                        Toast.makeText(context, "फॉर्म साफ़ कर दिया गया है", Toast.LENGTH_SHORT).show()
                    }
                ) {
                    Text("हाँ, साफ़ करें")
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearConfirmDialog = false }) {
                    Text("रद्द करें")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            Column {
                CenterAlignedTopAppBar(
                    title = {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "Teacher Resume Builder",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp
                                )
                            )
                            Text(
                                text = "Private School / 12th Pass Bio-Data Form",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    },
                    actions = {
                        IconButton(
                            onClick = { viewModel.printResume(context) },
                            modifier = Modifier.testTag("action_print")
                        ) {
                            Icon(Icons.Default.Print, contentDescription = "Direct Print", tint = MaterialTheme.colorScheme.primary)
                        }

                        IconButton(
                            onClick = {
                                viewModel.exportAndSavePdf(context) { uri ->
                                    if (uri != null) {
                                        Toast.makeText(
                                            context,
                                            "PDF Downloads/TeacherResumes में सुरक्षित हो गई!",
                                            Toast.LENGTH_LONG
                                        ).show()
                                    } else {
                                        Toast.makeText(context, "PDF सेव नहीं हो पाई", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            },
                            modifier = Modifier.testTag("action_export_pdf")
                        ) {
                            Icon(Icons.Default.Download, contentDescription = "Export PDF", tint = Color(0xFF0F766E))
                        }

                        IconButton(
                            onClick = { showMenu = !showMenu },
                            modifier = Modifier.testTag("action_more_menu")
                        ) {
                            Icon(Icons.Default.MoreVert, contentDescription = "More Options")
                        }

                        DropdownMenu(
                            expanded = showMenu,
                            onDismissRequest = { showMenu = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("✨ सैंपल डेटा भरें (Load Sample)") },
                                leadingIcon = {
                                    Icon(Icons.Default.AutoFixHigh, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                },
                                onClick = {
                                    viewModel.loadSampleData()
                                    showMenu = false
                                    Toast.makeText(context, "सैंपल बायो-डाटा लोड हो गया", Toast.LENGTH_SHORT).show()
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("📤 PDF शेयर करें (Share PDF)") },
                                leadingIcon = {
                                    Icon(Icons.Default.Share, contentDescription = null)
                                },
                                onClick = {
                                    viewModel.sharePdf(context)
                                    showMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("🗑️ फॉर्म साफ़ करें (Reset Form)") },
                                leadingIcon = {
                                    Icon(Icons.Default.DeleteSweep, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                                },
                                onClick = {
                                    showMenu = false
                                    showClearConfirmDialog = true
                                }
                            )
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                )

                // Tab Switcher between Form Editor and Live A4 Paper Preview
                SecondaryTabRow(
                    selectedTabIndex = selectedTabIndex,
                    containerColor = MaterialTheme.colorScheme.surface
                ) {
                    Tab(
                        selected = selectedTabIndex == 0,
                        onClick = { selectedTabIndex = 0 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("फॉर्म भरें (Form Editor)", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        },
                        modifier = Modifier.testTag("tab_form_editor")
                    )
                    Tab(
                        selected = selectedTabIndex == 1,
                        onClick = { selectedTabIndex = 1 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Visibility, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("A4 पेपर प्रीव्यू (Preview)", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        },
                        modifier = Modifier.testTag("tab_paper_preview")
                    )
                }
            }
        },
        floatingActionButton = {
            if (selectedTabIndex == 0) {
                ExtendedFloatingActionButton(
                    onClick = { selectedTabIndex = 1 },
                    icon = { Icon(Icons.Default.Visibility, contentDescription = null) },
                    text = { Text("A4 प्रीव्यू एवं प्रिंट", fontWeight = FontWeight.Bold) },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = Color.White,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.testTag("fab_preview_and_print")
                )
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Crossfade(targetState = selectedTabIndex, label = "TabCrossfade") { tab ->
                when (tab) {
                    0 -> ResumeFormScreen(
                        viewModel = viewModel,
                        resume = resume
                    )
                    1 -> ResumePreviewScreen(
                        viewModel = viewModel,
                        resume = resume,
                        onBackToEdit = { selectedTabIndex = 0 }
                    )
                }
            }
        }
    }
}
