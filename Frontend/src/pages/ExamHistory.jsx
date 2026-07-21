import { useState } from 'react'

const history = [
  {
    id: 'SES-1042',
    course: 'Cấu trúc dữ liệu & giải thuật',
    code: 'CS201',
    type: 'Thi cuối kỳ',
    date: '20/07/2026',
    duration: '42 phút',
    score: null,
    status: 'grading',
    riskLevel: 'normal',
  },
  {
    id: 'SES-0998',
    course: 'Cấu trúc dữ liệu & giải thuật',
    code: 'CS201',
    type: 'Kiểm tra giữa kỳ',
    date: '05/06/2026',
    duration: '38 phút',
    score: 8.5,
    status: 'graded',
    riskLevel: 'normal',
  },
  {
    id: 'SES-0876',
    course: 'Cơ sở dữ liệu',
    code: 'CS304',
    type: 'Thi giữa kỳ',
    date: '25/05/2026',
    duration: '40 phút',
    score: 6.0,
    status: 'graded',
    riskLevel: 'flagged',
  },
  {
    id: 'SES-0721',
    course: 'Nhập môn lập trình',
    code: 'CS101',
    type: 'Thi cuối kỳ',
    date: '12/01/2026',
    duration: '55 phút',
    score: 9.2,
    status: 'graded',
    riskLevel: 'normal',
  },
]

const riskStyle = {
  normal: { label: 'Bình thường', color: 'text-success', dot: 'bg-success' },
  flagged: { label: 'Có cảnh báo', color: 'text-amber-dark', dot: 'bg-amber' },
}

export default function ExamHistory() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-4xl mx-auto px-10 py-10">
        <h1 className="font-display text-3xl text-navy">Lịch sử thi</h1>
        <p className="font-body text-sm text-slate-soft mt-1">
          Xem lại điểm số và trạng thái giám thị của các bài thi đã tham gia.
        </p>

        <div className="mt-8 space-y-3">
          {history.map((h) => {
            const r = riskStyle[h.riskLevel]
            return (
              <button
                key={h.id}
                onClick={() => setSelected(h)}
                className="w-full text-left bg-white border border-navy/10 rounded-lg p-5 flex items-center justify-between hover:border-amber/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-soft uppercase tracking-wide bg-navy/5 px-2 py-0.5 rounded">
                      {h.code}
                    </span>
                    <span className={`flex items-center gap-1.5 font-body text-xs ${r.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                      {r.label}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-navy mt-2">
                    {h.course} — {h.type}
                  </h3>
                  <p className="font-body text-xs text-slate-soft mt-1">
                    {h.date} · Thời gian làm bài {h.duration}
                  </p>
                </div>

                <div className="text-right shrink-0 ml-4">
                  {h.status === 'graded' ? (
                    <p className="font-mono text-2xl text-navy">{h.score.toFixed(1)}</p>
                  ) : (
                    <p className="font-body text-xs text-amber-dark">Đang chấm</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div
          className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] text-slate-soft">{selected.id}</p>
                <h2 className="font-display text-xl text-navy mt-0.5">
                  {selected.course} — {selected.type}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="font-body text-sm text-slate-soft hover:text-navy"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3 border-t border-navy/10 pt-4">
              <Row label="Ngày thi" value={selected.date} />
              <Row label="Thời gian làm bài" value={selected.duration} />
              <Row
                label="Điểm số"
                value={selected.status === 'graded' ? selected.score.toFixed(1) : 'Đang chấm'}
              />
              <Row label="Trạng thái giám thị" value={riskStyle[selected.riskLevel].label} />
            </div>

            {selected.riskLevel === 'flagged' && (
              <div className="bg-amber/10 border border-amber/30 rounded-lg p-4 mt-4">
                <p className="font-body text-xs text-navy leading-relaxed">
                  Phiên thi này có một số cảnh báo được ghi nhận trong quá trình giám sát.
                  Liên hệ giảng viên nếu bạn cần giải trình.
                </p>
              </div>
            )}

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-6 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
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