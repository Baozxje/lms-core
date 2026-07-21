import { apiFetch } from './client.js'

export async function getCourses({ search = '', page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
  const params = new URLSearchParams({ page, size, sortBy, sortDir })
  if (search) params.set('search', search)
  return apiFetch(`/api/v1/courses?${params.toString()}`, { skipAuth: true })
}

export async function getCourseById(id) {
  return apiFetch(`/api/v1/courses/${id}`, { skipAuth: true })
}

export async function getSectionsByCourse(courseId) {
  return apiFetch(`/api/v1/sections/course/${courseId}`, { skipAuth: true })
}

export async function getLessonsBySection(sectionId) {
  return apiFetch(`/api/v1/lessons/section/${sectionId}`, { skipAuth: true })
}

export async function getExamsByCourse(courseId) {
  return apiFetch(`/api/v1/exams/course/${courseId}`, { skipAuth: true })
}

export async function createCourse({ title, description, price }, thumbnailFile) {
  const formData = new FormData()
  formData.append(
    'data',
    new Blob([JSON.stringify({ title, description, price })], { type: 'application/json' })
  )
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
  }

  return apiFetch('/api/v1/courses', {
    method: 'POST',
    body: formData,
  })
}

export async function createSection({ courseId, title, sectionOrder }) {
  return apiFetch('/api/v1/sections', {
    method: 'POST',
    body: JSON.stringify({ courseId, title, sectionOrder }),
  })
}

export async function createLesson({ sectionId, title, content, lessonOrder }, videoFile) {
  const formData = new FormData()
  formData.append(
    'data',
    new Blob([JSON.stringify({ sectionId, title, content, lessonOrder })], { type: 'application/json' })
  )
  if (videoFile) {
    formData.append('video', videoFile)
  }

  return apiFetch('/api/v1/lessons', {
    method: 'POST',
    body: formData,
  })
}