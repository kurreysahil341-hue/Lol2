package com.example.data.local

import androidx.room.TypeConverter
import com.example.data.model.BlankPageItem
import com.example.data.model.EducationItem
import com.example.data.model.ExperienceItem
import com.example.data.model.LanguageItem
import com.example.data.model.SkillItem
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

class ResumeConverters {
    private val moshi = Moshi.Builder().addLast(KotlinJsonAdapterFactory()).build()

    @TypeConverter
    fun fromEducationList(list: List<EducationItem>?): String {
        if (list == null) return "[]"
        val type = Types.newParameterizedType(List::class.java, EducationItem::class.java)
        val adapter = moshi.adapter<List<EducationItem>>(type)
        return adapter.toJson(list)
    }

    @TypeConverter
    fun toEducationList(data: String?): List<EducationItem> {
        if (data.isNullOrEmpty()) return emptyList()
        val type = Types.newParameterizedType(List::class.java, EducationItem::class.java)
        val adapter = moshi.adapter<List<EducationItem>>(type)
        return adapter.fromJson(data) ?: emptyList()
    }

    @TypeConverter
    fun fromExperienceList(list: List<ExperienceItem>?): String {
        if (list == null) return "[]"
        val type = Types.newParameterizedType(List::class.java, ExperienceItem::class.java)
        val adapter = moshi.adapter<List<ExperienceItem>>(type)
        return adapter.toJson(list)
    }

    @TypeConverter
    fun toExperienceList(data: String?): List<ExperienceItem> {
        if (data.isNullOrEmpty()) return emptyList()
        val type = Types.newParameterizedType(List::class.java, ExperienceItem::class.java)
        val adapter = moshi.adapter<List<ExperienceItem>>(type)
        return adapter.fromJson(data) ?: emptyList()
    }

    @TypeConverter
    fun fromSkillsList(list: List<SkillItem>?): String {
        if (list == null) return "[]"
        val type = Types.newParameterizedType(List::class.java, SkillItem::class.java)
        val adapter = moshi.adapter<List<SkillItem>>(type)
        return adapter.toJson(list)
    }

    @TypeConverter
    fun toSkillsList(data: String?): List<SkillItem> {
        if (data.isNullOrEmpty()) return emptyList()
        val type = Types.newParameterizedType(List::class.java, SkillItem::class.java)
        val adapter = moshi.adapter<List<SkillItem>>(type)
        return adapter.fromJson(data) ?: emptyList()
    }

    @TypeConverter
    fun fromLanguageList(list: List<LanguageItem>?): String {
        if (list == null) return "[]"
        val type = Types.newParameterizedType(List::class.java, LanguageItem::class.java)
        val adapter = moshi.adapter<List<LanguageItem>>(type)
        return adapter.toJson(list)
    }

    @TypeConverter
    fun toLanguageList(data: String?): List<LanguageItem> {
        if (data.isNullOrEmpty()) return emptyList()
        val type = Types.newParameterizedType(List::class.java, LanguageItem::class.java)
        val adapter = moshi.adapter<List<LanguageItem>>(type)
        return adapter.fromJson(data) ?: emptyList()
    }

    @TypeConverter
    fun fromAchievementsList(list: List<String>?): String {
        if (list == null) return "[]"
        val type = Types.newParameterizedType(List::class.java, String::class.java)
        val adapter = moshi.adapter<List<String>>(type)
        return adapter.toJson(list)
    }

    @TypeConverter
    fun toAchievementsList(data: String?): List<String> {
        if (data.isNullOrEmpty()) return emptyList()
        val type = Types.newParameterizedType(List::class.java, String::class.java)
        val adapter = moshi.adapter<List<String>>(type)
        return adapter.fromJson(data) ?: emptyList()
    }

    @TypeConverter
    fun fromBlankPagesList(list: List<BlankPageItem>?): String {
        if (list == null) return "[]"
        val type = Types.newParameterizedType(List::class.java, BlankPageItem::class.java)
        val adapter = moshi.adapter<List<BlankPageItem>>(type)
        return adapter.toJson(list)
    }

    @TypeConverter
    fun toBlankPagesList(data: String?): List<BlankPageItem> {
        if (data.isNullOrEmpty()) return emptyList()
        val type = Types.newParameterizedType(List::class.java, BlankPageItem::class.java)
        val adapter = moshi.adapter<List<BlankPageItem>>(type)
        return adapter.fromJson(data) ?: emptyList()
    }
}
