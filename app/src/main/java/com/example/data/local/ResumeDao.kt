package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.model.TeacherResume
import kotlinx.coroutines.flow.Flow

@Dao
interface ResumeDao {
    @Query("SELECT * FROM teacher_resumes WHERE id = :id LIMIT 1")
    fun getResumeById(id: Long = 1L): Flow<TeacherResume?>

    @Query("SELECT * FROM teacher_resumes WHERE id = :id LIMIT 1")
    suspend fun getResumeDirect(id: Long = 1L): TeacherResume?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateResume(resume: TeacherResume)

    @Query("DELETE FROM teacher_resumes WHERE id = :id")
    suspend fun deleteResume(id: Long = 1L)
}
