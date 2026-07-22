import { apiFetch } from './client.js'

export async function getMyAttempts() {
  return apiFetch('/api/v1/attempts/me')
}

export async function getAttemptsByCourse(courseId) {
  return apiFetch(`/api/v1/attempts/course/${courseId}`)
}
export async function getAttemptDetail(attemptId) {
  return apiFetch(`/api/v1/attempts/${attemptId}`)
}