package com.example.data.repository

import com.example.data.local.ResumeDao
import com.example.data.model.TeacherResume
import kotlinx.coroutines.flow.Flow

class ResumeRepository(private val resumeDao: ResumeDao) {
    val resumeFlow: Flow<TeacherResume?> = resumeDao.getResumeById(1L)

    suspend fun getResume(): TeacherResume? = resumeDao.getResumeDirect(1L)

    suspend fun saveResume(resume: TeacherResume) {
        resumeDao.insertOrUpdateResume(resume.copy(id = 1L, updatedAt = System.currentTimeMillis()))
    }

    suspend fun clearResume() {
        resumeDao.deleteResume(1L)
        resumeDao.insertOrUpdateResume(TeacherResume(id = 1L))
    }

    suspend fun loadSampleData() {
        resumeDao.insertOrUpdateResume(TeacherResume.sampleResume().copy(id = 1L))
    }
}
