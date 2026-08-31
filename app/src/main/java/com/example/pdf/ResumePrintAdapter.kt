package com.example.pdf

import android.content.Context
import android.graphics.pdf.PdfDocument
import android.os.Bundle
import android.os.CancellationSignal
import android.os.ParcelFileDescriptor
import android.print.PageRange
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintDocumentInfo
import com.example.data.model.TeacherResume
import java.io.FileOutputStream

class ResumePrintAdapter(
    private val context: Context,
    private val resume: TeacherResume
) : PrintDocumentAdapter() {

    private var totalPages: Int = 1

    override fun onLayout(
        oldAttributes: PrintAttributes?,
        newAttributes: PrintAttributes?,
        cancellationSignal: CancellationSignal?,
        callback: LayoutResultCallback?,
        extras: Bundle?
    ) {
        if (cancellationSignal?.isCanceled == true) {
            callback?.onLayoutCancelled()
            return
        }

        // Page 1 is Main Resume, plus each BlankPageItem is an extra page
        totalPages = 1 + resume.blankPages.size

        val printInfo = PrintDocumentInfo.Builder("Teacher_Resume.pdf")
            .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
            .setPageCount(totalPages)
            .build()

        val changed = newAttributes != oldAttributes
        callback?.onLayoutFinished(printInfo, changed)
    }

    override fun onWrite(
        pages: Array<out PageRange>?,
        destination: ParcelFileDescriptor?,
        cancellationSignal: CancellationSignal?,
        callback: WriteResultCallback?
    ) {
        if (destination == null) {
            callback?.onWriteFailed("Destination is null")
            return
        }

        val pdfDocument = PdfDocument()

        try {
            // Draw Main Page (Page 1)
            val page1Info = PdfDocument.PageInfo.Builder(
                PdfGenerator.PAGE_WIDTH,
                PdfGenerator.PAGE_HEIGHT,
                1
            ).create()
            val page1 = pdfDocument.startPage(page1Info)
            PdfGenerator.drawMainPageContent(context, page1.canvas, resume)
            pdfDocument.finishPage(page1)

            // Draw Extra Blank Pages
            resume.blankPages.forEachIndexed { index, blankPage ->
                if (cancellationSignal?.isCanceled == true) {
                    callback?.onWriteCancelled()
                    pdfDocument.close()
                    return
                }
                val pageNumber = index + 2
                val pageInfo = PdfDocument.PageInfo.Builder(
                    PdfGenerator.PAGE_WIDTH,
                    PdfGenerator.PAGE_HEIGHT,
                    pageNumber
                ).create()
                val page = pdfDocument.startPage(pageInfo)
                PdfGenerator.drawBlankPageContent(page.canvas, blankPage, pageNumber)
                pdfDocument.finishPage(page)
            }

            FileOutputStream(destination.fileDescriptor).use { out ->
                pdfDocument.writeTo(out)
            }

            callback?.onWriteFinished(arrayOf(PageRange.ALL_PAGES))
        } catch (e: Exception) {
            e.printStackTrace()
            callback?.onWriteFailed(e.message)
        } finally {
            pdfDocument.close()
        }
    }
}
