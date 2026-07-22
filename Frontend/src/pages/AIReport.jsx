import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAttemptDetail } from '../api/attempts.js'

const statusMap = {
  COMPLETED: { label: 'Đã chấm xong', color: 'text-success' },
  PENDING_GRADING: { label: 'Đang chấm', color: 'text-amber-dark' },
}

const answerStatusMap = {
  GRADED: { label: 'Đã chấm', dot: 'bg-success' },
  PENDING_AI: { label: 'Chờ AI chấm', dot: 'bg-amber' },
}

export default function AIReport() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAttemptDetail(attemptId)
      .then(setAttempt)
      .catch((err) => setError(err.message || 'Không tải được bài thi'))
      .finally(() => setLoading(false))
  }, [attemptId])

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-body text-sm text-slate-soft">Đang tải…</p>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-body text-sm text-danger">{error || 'Không tìm thấy bài thi.'}</p>
      </div>
    )
  }

  const s = statusMap[attempt.status] ?? statusMap.PENDING_GRADING

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-10 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="font-body text-xs text-slate-soft hover:text-navy mb-6"
        >
          ← Về trang quản lý bài thi
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl text-navy">{attempt.studentName}</h1>
            <p className="font-body text-sm text-slate-soft mt-1">{attempt.studentEmail}</p>
            <p className="font-body text-xs text-slate-soft mt-1">
              {attempt.examTitle} · {new Date(attempt.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="text-center shrink-0">
            <p className="font-mono text-4xl text-navy">
              {attempt.status === 'COMPLETED' ? attempt.totalScore?.toFixed(1) : '—'}
            </p>
            <p className={`font-body text-xs mt-1 ${s.color}`}>{s.label}</p>
          </div>
        </div>

        <section className="mt-8 mb-10 space-y-4">
          {attempt.answers.map((a, i) => {
            const as = answerStatusMap[a.status] ?? answerStatusMap.PENDING_AI
            return (
              <div key={i} className="bg-white border border-navy/10 rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-slate-soft">
                    Câu {i + 1} · {a.points} điểm
                  </span>
                  <span className="flex items-center gap-1.5 font-body text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${as.dot}`} />
                    {as.label}
                  </span>
                </div>

                <p className="font-body text-sm text-navy">{a.questionContent}</p>

                {a.questionType === 'MULTIPLE_CHOICE' ? (
                  <div className="mt-3 space-y-1">
                    <p className="font-body text-xs text-slate-soft">
                      Sinh viên chọn: <span className="text-navy">{a.selectedOptionContent ?? '(không chọn)'}</span>
                    </p>
                    <p className="font-body text-xs text-slate-soft">
                      Đáp án đúng: <span className="text-success">{a.correctOptionContent}</span>
                    </p>
                  </div>
                ) : (
                  <p className="font-body text-sm text-navy mt-3 bg-navy/5 rounded-md p-3 whitespace-pre-wrap">
                    {a.answerText || '(chưa trả lời)'}
                  </p>
                )}

                <p className="font-mono text-xs text-amber-dark mt-3">
                  Điểm: {a.score != null ? a.score.toFixed(1) : '—'}
                </p>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}