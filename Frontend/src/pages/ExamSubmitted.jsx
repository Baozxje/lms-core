import { useNavigate } from 'react-router-dom'

const summary = {
  course: 'Cấu trúc dữ liệu & giải thuật',
  code: 'CS201 · Thi cuối kỳ',
  submittedAt: '20/07/2026 · 10:42',
  duration: '42 phút 18 giây',
  answered: 4,
  total: 4,
}

export default function ExamSubmitted() {
  const navigate = useNavigate()

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
          <p className="font-mono text-[11px] text-slate-soft uppercase tracking-wide">
            {summary.code}
          </p>
          <p className="font-display text-lg text-navy mt-0.5">{summary.course}</p>

          <div className="mt-5 space-y-3 border-t border-navy/10 pt-4">
            <Row label="Thời điểm nộp bài" value={summary.submittedAt} />
            <Row label="Thời gian làm bài" value={summary.duration} />
            <Row label="Số câu đã trả lời" value={`${summary.answered}/${summary.total}`} />
          </div>
        </div>

        <div className="bg-amber/10 border border-amber/30 rounded-lg p-4 mt-4 text-left">
          <p className="font-body text-xs text-navy leading-relaxed">
            Video và log giám thị của phiên thi này đang được hệ thống AI phân tích.
            Kết quả sẽ được giảng viên xem xét trước khi công bố điểm chính thức.
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