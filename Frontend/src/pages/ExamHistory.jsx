import { useEffect, useState } from 'react'
import { getMyAttempts } from '../api/attempts.js'

const statusMap = {
  COMPLETED: { label: 'Đã chấm', color: 'text-success', dot: 'bg-success' },
  PENDING_GRADING: { label: 'Đang chấm', color: 'text-amber-dark', dot: 'bg-amber' },
}

export default function ExamHistory() {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getMyAttempts()
      .then((data) => setAttempts(data ?? []))
      .catch((err) => setError(err.message || 'Không tải được lịch sử thi'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-4xl mx-auto px-10 py-10">
        <h1 className="font-display text-3xl text-navy">Lịch sử thi</h1>
        <p className="font-body text-sm text-slate-soft mt-1">
          Xem lại điểm số và trạng thái các bài thi đã tham gia.
        </p>

        {loading && <p className="font-body text-sm text-slate-soft mt-8">Đang tải…</p>}
        {error && <p className="font-body text-sm text-danger mt-8">{error}</p>}
        {!loading && !error && attempts.length === 0 && (
          <p className="font-body text-sm text-slate-soft mt-8">Bạn chưa nộp bài thi nào.</p>
        )}

        <div className="mt-8 space-y-3">
          {attempts.map((a) => {
            const s = statusMap[a.status] ?? statusMap.PENDING_GRADING
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="w-full text-left bg-white border border-navy/10 rounded-lg p-5 flex items-center justify-between hover:border-amber/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 font-body text-xs ${s.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-navy mt-2">
                    {a.courseTitle} — {a.examTitle}
                  </h3>
                  <p className="font-body text-xs text-slate-soft mt-1">
                    {new Date(a.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>

                <div className="text-right shrink-0 ml-4">
                  {a.status === 'COMPLETED' ? (
                    <p className="font-mono text-2xl text-navy">{a.totalScore?.toFixed(1)}</p>
                  ) : (
                    <p className="font-body text-xs text-amber-dark">Đang chấm</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50"
          onClick={() => setSelected(null)}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="font-display text-xl text-navy">
                {selected.courseTitle} — {selected.examTitle}
              </h2>
              <button onClick={() => setSelected(null)} className="font-body text-sm text-slate-soft hover:text-navy">
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3 border-t border-navy/10 pt-4">
              <Row label="Ngày nộp bài" value={new Date(selected.createdAt).toLocaleString('vi-VN')} />
              <Row
                label="Điểm số"
                value={selected.status === 'COMPLETED' ? selected.totalScore?.toFixed(1) : 'Đang chấm'}
              />
              <Row label="Trạng thái" value={statusMap[selected.status]?.label ?? selected.status} />
            </div>

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