import { useNavigate, useLocation } from 'react-router-dom'

export default function ExamSubmitted() {
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state

  const submittedAtText = data?.submittedAt
    ? new Date(data.submittedAt).toLocaleString('vi-VN')
    : '—'

  const durationText = data?.elapsedSeconds != null
    ? `${Math.floor(data.elapsedSeconds / 60)} phút ${data.elapsedSeconds % 60} giây`
    : '—'

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M6 14.5L11.5 20L22 8"
              stroke="#3E7C59"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl text-navy mt-6">Đã nộp bài thành công</h1>
        <p className="font-body text-sm text-slate-soft mt-2">
          Bài làm của bạn đã được ghi nhận. Bạn không thể chỉnh sửa sau thời điểm này.
        </p>

        <div className="bg-white border border-navy/10 rounded-lg p-6 mt-8 text-left">
          <p className="font-display text-lg text-navy mt-0.5">
            {data?.examTitle ?? 'Bài thi'}
          </p>

          <div className="mt-5 space-y-3 border-t border-navy/10 pt-4">
            <Row label="Thời điểm nộp bài" value={submittedAtText} />
            <Row label="Thời gian làm bài" value={durationText} />
            <Row
              label="Số câu đã trả lời"
              value={data ? `${data.answeredCount}/${data.totalQuestions}` : '—'}
            />
          </div>
        </div>

        <div className="bg-amber/10 border border-amber/30 rounded-lg p-4 mt-4 text-left">
          <p className="font-body text-xs text-navy leading-relaxed">
            Nếu đề thi có câu tự luận, hệ thống AI đang chấm điểm phần đó.
            Kiểm tra kết quả cuối cùng ở mục "Lịch sử thi".
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-8 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-xs text-slate-soft">{label}</span>
      <span className="font-mono text-xs text-navy">{value}</span>
    </div>
  )
}