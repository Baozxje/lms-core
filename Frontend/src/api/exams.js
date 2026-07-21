import { apiFetch } from './client.js'

// Lấy đề thi đầy đủ
export async function getExamDetail(examId) {
  return apiFetch(`/api/v1/exams/${examId}`)
}

// Tạo đề thi mới (giảng viên) - 
export async function createExam({ title, durationMinutes, passScore, courseId, questions }) {
  return apiFetch('/api/v1/exams', {
    method: 'POST',
    body: JSON.stringify({ title, durationMinutes, passScore, courseId, questions }),
  })
}

// Nộp bài thi
export async function submitExam(examId, answers) {
  return apiFetch(`/api/v1/exams/${examId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ examId, answers }),
  })
}