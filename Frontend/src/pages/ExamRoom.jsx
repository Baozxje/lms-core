import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OfflineOverlay, { useOnlineStatus } from './OfflineOverlay.jsx'
import { getExamDetail, submitExam } from '../api/exams.js'

const alertPool = [
  { level: 'warning', text: 'Phát hiện ánh mắt rời khỏi màn hình' },
  { level: 'danger', text: 'Phát hiện giọng nói thứ hai trong phòng' },
  { level: 'warning', text: 'Không phát hiện khuôn mặt trong 3 giây' },
  { level: 'danger', text: 'Phát hiện vật thể nghi vấn (điện thoại)' },
  { level: 'info', text: 'Đã xác thực lại danh tính qua khuôn mặt' },
]

const levelStyle = {
  info: { dot: 'bg-success', text: 'text-success' },
  warning: { dot: 'bg-amber', text: 'text-amber-dark' },
  danger: { dot: 'bg-danger', text: 'text-danger' },
}

export default function ExamRoom() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const online = useOnlineStatus()

  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({}) // { [questionId]: { selectedOptionId } hoặc { answerText } }
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [alerts, setAlerts] = useState([
    { id: 0, time: new Date().toLocaleTimeString('vi-VN'), level: 'info', text: 'Bắt đầu giám sát phiên thi' },
  ])
  const [camStatus, setCamStatus] = useState('connecting')
  const videoRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  // Tải đề thi thật
  useEffect(() => {
    getExamDetail(examId)
      .then((data) => {
        setExam(data)
        setSecondsLeft((data?.durationMinutes ?? 45) * 60)
      })
      .catch((err) => setLoadError(err.message || 'Không tải được đề thi'))
      .finally(() => setLoading(false))
  }, [examId])

  // Đếm giờ
  useEffect(() => {
    if (!exam) return
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [exam])

  // Webcam thật
  useEffect(() => {
    let stream
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
        setCamStatus('live')
      })
      .catch(() => setCamStatus('error'))
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [])

  // Cảnh báo giả lập (thay bằng WebSocket/SSE thật khi có pipeline AI)
  useEffect(() => {
    const t = setInterval(() => {
      const pick = alertPool[Math.floor(Math.random() * alertPool.length)]
      const now = new Date()
      setAlerts((prev) =>
        [{ id: prev.length, time: now.toLocaleTimeString('vi-VN'), ...pick }, ...prev].slice(0, 8)
      )
    }, 12000)
    return () => clearInterval(t)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-body text-sm text-slate-soft">Đang tải đề thi…</p>
      </div>
    )
  }

  if (loadError || !exam) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-body text-sm text-danger">{loadError || 'Không tìm thấy đề thi.'}</p>
      </div>
    )
  }

  const questions = exam.questions ?? []
  const q = questions[current]
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const timeLow = secondsLeft < 300
  const answeredCount = Object.keys(answers).length

  function selectOption(questionId, optionId) {
    setAnswers((a) => ({ ...a, [questionId]: { selectedOptionId: optionId } }))
  }

  function setEssayAnswer(questionId, text) {
    setAnswers((a) => ({ ...a, [questionId]: { answerText: text } }))
  }

  async function handleSubmit() {
  if (!window.confirm('Bạn chắc chắn muốn nộp bài? Sau khi nộp sẽ không thể chỉnh sửa.')) return

  setSubmitError('')
  setSubmitting(true)
  try {
    const answerList = questions.map((question) => ({
      questionId: question.id,
      selectedOptionId: answers[question.id]?.selectedOptionId ?? null,
      answerText: answers[question.id]?.answerText ?? null,
    }))
    await submitExam(examId, answerList)

    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)
    navigate('/exam-submitted', {
      state: {
        examTitle: exam.title,
        submittedAt: new Date().toISOString(),
        elapsedSeconds,
        answeredCount,
        totalQuestions: questions.length,
      },
    })
  } catch (err) {
    setSubmitError(err.message || 'Nộp bài thất bại, vui lòng thử lại.')
  } finally {
    setSubmitting(false)
  }
}
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {!online && <OfflineOverlay />}

      <header className="bg-navy px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="font-body text-sm text-ivory">{exam.title}</p>
          <p className="font-mono text-[11px] text-white/40">
            {exam.durationMinutes} phút · Điểm đạt {exam.passScore}
          </p>
        </div>
        <div
          className={`font-mono text-lg px-4 py-1.5 rounded-md ${
            timeLow ? 'bg-danger/20 text-danger' : 'bg-white/10 text-ivory'
          }`}
        >
          {mm}:{ss}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="font-body text-sm bg-amber text-navy font-medium px-4 py-2 rounded-md hover:bg-amber-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Đang nộp…' : 'Nộp bài'}
        </button>
      </header>

      {submitError && (
        <p className="font-body text-xs text-danger text-center py-2 bg-danger/10">{submitError}</p>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 max-w-6xl mx-auto w-full">
        <section className="bg-white border border-navy/10 rounded-lg p-8">
          {questions.length === 0 ? (
            <p className="font-body text-sm text-slate-soft">Đề thi này chưa có câu hỏi nào.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-slate-soft">
                  Câu {current + 1} / {questions.length}
                </span>
                <span className="font-body text-xs text-slate-soft">
                  Đã trả lời {answeredCount}/{questions.length}
                </span>
              </div>

              <h2 className="font-display text-xl text-navy leading-relaxed">{q.content}</h2>
              <p className="font-mono text-xs text-slate-soft mt-1">{q.points} điểm</p>

              {q.type === 'MULTIPLE_CHOICE' ? (
                <div className="mt-6 space-y-3">
                  {q.options?.map((opt, i) => {
                    const selected = answers[q.id]?.selectedOptionId === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectOption(q.id, opt.id)}
                        className={`w-full text-left font-body text-sm px-4 py-3 rounded-md border transition-colors flex items-center gap-3 ${
                          selected
                            ? 'border-amber bg-amber/10 text-navy'
                            : 'border-navy/10 text-navy hover:border-navy/30'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                            selected ? 'border-amber bg-amber text-navy' : 'border-navy/20 text-slate-soft'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt.content}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <textarea
                  rows={8}
                  value={answers[q.id]?.answerText ?? ''}
                  onChange={(e) => setEssayAnswer(q.id, e.target.value)}
                  placeholder="Nhập câu trả lời của bạn…"
                  className="w-full mt-6 rounded-md border border-navy/15 px-4 py-3 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber resize-none"
                />
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy/10">
                <button
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0}
                  className="font-body text-sm text-slate-soft px-4 py-2 rounded-md hover:bg-navy/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  ← Câu trước
                </button>
                <div className="flex gap-1.5 flex-wrap justify-center">
                  {questions.map((qq, i) => (
                    <button
                      key={qq.id}
                      onClick={() => setCurrent(i)}
                      className={`w-7 h-7 rounded-md font-mono text-[11px] transition-colors ${
                        i === current
                          ? 'bg-navy text-ivory'
                          : answers[qq.id]
                          ? 'bg-amber/20 text-amber-dark'
                          : 'bg-navy/5 text-slate-soft'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  disabled={current === questions.length - 1}
                  className="font-body text-sm text-navy px-4 py-2 rounded-md hover:bg-navy/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  Câu tiếp →
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="bg-navy rounded-lg overflow-hidden">
            <div className="aspect-video bg-navy-dark relative flex items-center justify-center">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              {camStatus !== 'live' && (
                <span className="absolute font-body text-xs text-white/50">
                  {camStatus === 'connecting' ? 'Đang kết nối camera…' : 'Không thể truy cập camera'}
                </span>
              )}
              <span className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 rounded px-2 py-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    camStatus === 'live' ? 'bg-success animate-pulse' : 'bg-danger'
                  }`}
                />
                <span className="font-mono text-[10px] text-white">
                  {camStatus === 'live' ? 'ĐANG GIÁM SÁT' : 'MẤT KẾT NỐI'}
                </span>
              </span>
            </div>
          </div>

          <div className="bg-white border border-navy/10 rounded-lg p-4">
            <p className="font-body text-xs font-medium text-slate-soft uppercase tracking-wide mb-3">
              Cảnh báo giám thị
            </p>
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {alerts.map((a) => {
                const s = levelStyle[a.level]
                return (
                  <div key={a.id} className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                    <div>
                      <p className={`font-body text-xs ${s.text}`}>{a.text}</p>
                      <p className="font-mono text-[10px] text-slate-soft/70">{a.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}