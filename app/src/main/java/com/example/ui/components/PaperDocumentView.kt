package com.example.ui.components

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.rememberTransformableState
import androidx.compose.foundation.gestures.transformable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.ZoomIn
import androidx.compose.material.icons.filled.ZoomOut
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.BlankPageItem
import com.example.data.model.EducationItem
import com.example.data.model.ExperienceItem
import com.example.data.model.LanguageItem
import com.example.data.model.SkillItem
import com.example.data.model.TeacherResume
import com.example.pdf.PdfGenerator

@Composable
fun PaperDocumentView(
    resume: TeacherResume,
    modifier: Modifier = Modifier
) {
    val totalPages = 1 + resume.blankPages.size
    var currentPageIndex by remember { mutableIntStateOf(0) }
    var zoomScale by remember { mutableFloatStateOf(1f) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFE2E8F0)) // Desk surface tone
    ) {
        // Top Page Selector Bar
        Surface(
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Page Indicator & Switcher
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "पेज (Page ${currentPageIndex + 1} of $totalPages):",
                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))

                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        items(totalPages) { pageIdx ->
                            FilterChip(
                                selected = currentPageIndex == pageIdx,
                                onClick = { currentPageIndex = pageIdx },
                                label = {
                                    Text(
                                        if (pageIdx == 0) "Main Bio-Data" else "Page ${pageIdx + 1}",
                                        fontSize = 11.sp
                                    )
                                },
                                shape = RoundedCornerShape(16.dp),
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = MaterialTheme.colorScheme.primary,
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                    }
                }

                // Zoom controls
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = { zoomScale = (zoomScale - 0.2f).coerceAtLeast(0.7f) },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ZoomOut, contentDescription = "Zoom Out", modifier = Modifier.size(18.dp))
                    }
                    Text(
                        text = "${(zoomScale * 100).toInt()}%",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    IconButton(
                        onClick = { zoomScale = (zoomScale + 0.2f).coerceAtMost(1.6f) },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ZoomIn, contentDescription = "Zoom In", modifier = Modifier.size(18.dp))
                    }
                }
            }
        }

        // Paper Container (Scrollable)
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(vertical = 16.dp, horizontal = 8.dp),
            contentAlignment = Alignment.TopCenter
        ) {
            val context = LocalContext.current

            // Realistic A4 Paper (Aspect ratio 1 : 1.414)
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(2.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                border = BorderStroke(1.dp, Color(0xFFCBD5E1)),
                modifier = Modifier
                    .fillMaxWidth(0.96f * zoomScale)
                    .aspectRatio(1f / 1.414f)
                    .testTag("a4_paper_preview_sheet")
            ) {
                if (currentPageIndex == 0) {
                    // Render Main Resume Paper (Page 1)
                    A4MainResumePageCanvas(context = context, resume = resume)
                } else {
                    // Render Blank Page (Pages 2..N)
                    val blankPageIdx = currentPageIndex - 1
                    if (blankPageIdx in resume.blankPages.indices) {
                        val blankPage = resume.blankPages[blankPageIdx]
                        A4BlankPageCanvas(blankPage = blankPage, pageNumber = currentPageIndex + 1)
                    }
                }
            }
        }
    }
}

@Composable
fun A4MainResumePageCanvas(
    context: android.content.Context,
    resume: TeacherResume,
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        val standardWidth = PdfGenerator.PAGE_WIDTH.toFloat()
        val standardHeight = PdfGenerator.PAGE_HEIGHT.toFloat()
        val scaleFactor = size.width / standardWidth

        drawIntoCanvas { canvas ->
            PdfGenerator.drawMainPageContent(
                context = context,
                canvas = canvas.nativeCanvas,
                resume = resume,
                scale = scaleFactor
            )
        }
    }
}

@Composable
fun A4BlankPageCanvas(
    blankPage: BlankPageItem,
    pageNumber: Int,
    modifier: Modifier = Modifier
) {
    Canvas(
        modifier = modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        val standardWidth = PdfGenerator.PAGE_WIDTH.toFloat()
        val standardHeight = PdfGenerator.PAGE_HEIGHT.toFloat()
        val scaleFactor = size.width / standardWidth

        drawIntoCanvas { canvas ->
            PdfGenerator.drawBlankPageContent(
                canvas = canvas.nativeCanvas,
                blankPage = blankPage,
                pageNumber = pageNumber,
                scale = scaleFactor
            )
        }
    }
}
