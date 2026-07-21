import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OfflineOverlay, { useOnlineStatus } from './OfflineOverlay.jsx'

const questions = [
  {
    id: 1,
    text: 'Trong giải thuật sắp xếp nhanh (Quick Sort), độ phức tạp trung bình là gì?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
  },
  {
    id: 2,
    text: 'Cấu trúc dữ liệu nào phù hợp nhất để triển khai hàng đợi ưu tiên?',
    options: ['Mảng', 'Danh sách liên kết', 'Heap', 'Ngăn xếp'],
  },
  {
    id: 3,
    text: 'Trong cây nhị phân tìm kiếm cân bằng, thao tác tìm kiếm có độ phức tạp là?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
  },
  {
    id: 4,
    text: 'Thuật toán nào sau đây dùng chiến lược chia để trị (divide and conquer)?',
    options: ['Merge Sort', 'Bubble Sort', 'Insertion Sort', 'Selection Sort'],
  },
]

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
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [secondsLeft, setSecondsLeft] = useState(45 * 60)
  const [alerts, setAlerts] = useState([
    { id: 0, time: '10:00:02', level: 'info', text: 'Bắt đầu giám sát phiên thi' },
  ])
  const [camStatus, setCamStatus] = useState('connecting')
  const videoRef = useRef(null)

  // Đếm giờ
  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // Kết nối webcam thật của thí sinh
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

  // Mô phỏng cảnh báo real-time từ pipeline AI (thay bằng WebSocket/SSE thật khi nối backend)
  useEffect(() => {
    const t = setInterval(() => {
      const pick = alertPool[Math.floor(Math.random() * alertPool.length)]
      const now = new Date()
      setAlerts((prev) => [
        {
          id: prev.length,
          time: now.toLocaleTimeString('vi-VN'),
          ...pick,
        },
        ...prev,
      ].slice(0, 8))
    }, 12000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const timeLow = secondsLeft < 300

  const q = questions[current]
  const answeredCount = Object.keys(answers).length

  function selectAnswer(optionIdx) {
    setAnswers((a) => ({ ...a, [q.id]: optionIdx }))
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {!online && <OfflineOverlay />}

      {/* Top bar */}
      <header className="bg-navy px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="font-body text-sm text-ivory">Cấu trúc dữ liệu & giải thuật</p>
          <p className="font-mono text-[11px] text-white/40">CS201 · Thi cuối kỳ</p>
        </div>
        <div
          className={`font-mono text-lg px-4 py-1.5 rounded-md ${
            timeLow ? 'bg-danger/20 text-danger' : 'bg-white/10 text-ivory'
          }`}
        >
          {mm}:{ss}
        </div>
        <button
          onClick={() => {
            if (window.confirm('Bạn chắc chắn muốn nộp bài? Sau khi nộp sẽ không thể chỉnh sửa.')) {
              navigate('/exam-submitted')
            }
          }}
          className="font-body text-sm bg-amber text-navy font-medium px-4 py-2 rounded-md hover:bg-amber-dark transition-colors"
        >
          Nộp bài
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 max-w-6xl mx-auto w-full">
        {/* Câu hỏi */}
        <section className="bg-white border border-navy/10 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs text-slate-soft">
              Câu {current + 1} / {questions.length}
            </span>
            <span className="font-body text-xs text-slate-soft">
              Đã trả lời {answeredCount}/{questions.length}
            </span>
          </div>

          <h2 className="font-display text-xl text-navy leading-relaxed">{q.text}</h2>

          <div className="mt-6 space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
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
                  {opt}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy/10">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="font-body text-sm text-slate-soft px-4 py-2 rounded-md hover:bg-navy/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              ← Câu trước
            </button>
            <div className="flex gap-1.5">
              {questions.map((qq, i) => (
                <button
                  key={qq.id}
                  onClick={() => setCurrent(i)}
                  className={`w-7 h-7 rounded-md font-mono text-[11px] transition-colors ${
                    i === current
                      ? 'bg-navy text-ivory'
                      : answers[qq.id] !== undefined
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
        </section>

        {/* Panel giám thị */}
        <aside className="space-y-4">
          <div className="bg-navy rounded-lg overflow-hidden">
            <div className="aspect-video bg-navy-dark relative flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
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