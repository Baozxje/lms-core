import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const sessions = [
  {
    id: 'SES-1042',
    student: 'Nguyễn Đức Hiếu',
    mssv: '2280600952',
    course: 'CS201 · Thi cuối kỳ',
    cheatScore: 12,
    status: 'active',
    startedAt: '10:00',
    alerts: [
      { time: '10:14', level: 'info', text: 'Đã xác thực lại danh tính qua khuôn mặt' },
      { time: '10:22', level: 'warning', text: 'Ánh mắt rời khỏi màn hình 4 giây' },
    ],
  },
  {
    id: 'SES-1041',
    student: 'Lâm Gia Bảo',
    mssv: '20210392',
    course: 'CS201 · Thi cuối kỳ',
    cheatScore: 78,
    status: 'active',
    startedAt: '10:00',
    alerts: [
      { time: '10:05', level: 'danger', text: 'Phát hiện giọng nói thứ hai trong phòng' },
      { time: '10:11', level: 'danger', text: 'Phát hiện vật thể nghi vấn (điện thoại)' },
      { time: '10:19', level: 'warning', text: 'Không phát hiện khuôn mặt trong 6 giây' },
      { time: '10.27', level: 'danger', text: 'Phát hiện người thứ hai trong khung hình' },
    ],
  },
  {
    id: 'SES-1038',
    student: 'Nguyễn Thiên Hưng',
    mssv: '20210271',
    course: 'CS304 · Thi giữa kỳ',
    cheatScore: 5,
    status: 'submitted',
    startedAt: '09:00',
    alerts: [{ time: '09:12', level: 'info', text: 'Bắt đầu giám sát phiên thi' }],
  },
  {
    id: 'SES-1035',
    student: 'Nguyễn Định Nam',
    mssv: '20210603',
    course: 'CS304 · Thi giữa kỳ',
    cheatScore: 41,
    status: 'submitted',
    startedAt: '09:00',
    alerts: [
      { time: '09:18', level: 'warning', text: 'Ánh mắt rời khỏi màn hình nhiều lần' },
      { time: '09:33', level: 'warning', text: 'Phát hiện tiếng nói không rõ nguồn' },
    ],
  },
]

const levelStyle = {
  info: { dot: 'bg-success', text: 'text-success' },
  warning: { dot: 'bg-amber', text: 'text-amber-dark' },
  danger: { dot: 'bg-danger', text: 'text-danger' },
}

function riskLevel(score) {
  if (score >= 60) return { label: 'Rủi ro cao', color: 'text-danger', bar: 'bg-danger' }
  if (score >= 25) return { label: 'Cần xem xét', color: 'text-amber-dark', bar: 'bg-amber' }
  return { label: 'Bình thường', color: 'text-success', bar: 'bg-success' }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(sessions[1].id)
  const [filter, setFilter] = useState('all')

  const filtered = sessions.filter((s) => {
    if (filter === 'all') return true
    if (filter === 'active') return s.status === 'active'
    if (filter === 'risk') return s.cheatScore >= 25
    return true
  })

  const selected = sessions.find((s) => s.id === selectedId)
  const activeCount = sessions.filter((s) => s.status === 'active').length
  const highRiskCount = sessions.filter((s) => s.cheatScore >= 60).length
  const totalAlerts = sessions.reduce((sum, s) => sum + s.alerts.length, 0)

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className="w-60 bg-navy shrink-0 flex flex-col py-6 px-4">
        <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase px-2">
          ProctorLMS
        </span>
        <nav className="mt-10 space-y-1">
          <NavItem label="Tổng quan giám thị" active />
          <NavItem label="Danh sách kỳ thi" />
          <NavItem label="Báo cáo AI" />
          <NavItem label="Cài đặt" />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 px-10 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-navy">Giám sát kỳ thi</h1>
          <p className="font-body text-sm text-slate-soft mt-1">
            CS201 · Thi cuối kỳ — theo dõi theo thời gian thực
          </p>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Phiên đang diễn ra" value={activeCount} accent="text-navy" />
          <StatCard label="Rủi ro cao" value={highRiskCount} accent="text-danger" />
          <StatCard label="Tổng cảnh báo" value={totalAlerts} accent="text-amber-dark" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Bảng thí sinh */}
          <section className="bg-white border border-navy/10 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-navy/10">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'active', label: 'Đang thi' },
                { key: 'risk', label: 'Cần xem xét' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`font-body text-xs px-3 py-1.5 rounded-md transition-colors ${
                    filter === f.key
                      ? 'bg-navy text-ivory'
                      : 'text-slate-soft hover:bg-navy/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <table className="w-full">
              <thead>
                <tr className="font-body text-xs text-slate-soft uppercase tracking-wide">
                  <th className="text-left font-medium px-5 py-2.5">Thí sinh</th>
                  <th className="text-left font-medium px-5 py-2.5">Trạng thái</th>
                  <th className="text-left font-medium px-5 py-2.5">Cheat score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const r = riskLevel(s.cheatScore)
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`cursor-pointer border-t border-navy/5 transition-colors ${
                        selectedId === s.id ? 'bg-amber/10' : 'hover:bg-navy/5'
                      }`}
                    >
                      <td className="px-5 py-3">
                        <p className="font-body text-sm text-navy">{s.student}</p>
                        <p className="font-mono text-[11px] text-slate-soft">MSSV {s.mssv}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`font-body text-xs ${
                            s.status === 'active' ? 'text-success' : 'text-slate-soft'
                          }`}
                        >
                          {s.status === 'active' ? 'Đang thi' : 'Đã nộp bài'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-navy/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${r.bar}`}
                              style={{ width: `${s.cheatScore}%` }}
                            />
                          </div>
                          <span className={`font-mono text-xs ${r.color}`}>{s.cheatScore}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          {/* Chi tiết phiên thi */}
          {selected && (
            <aside className="bg-white border border-navy/10 rounded-lg p-5 h-fit">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg text-navy">{selected.student}</p>
                  <p className="font-mono text-[11px] text-slate-soft">{selected.id}</p>
                </div>
                <span className={`font-body text-xs font-medium ${riskLevel(selected.cheatScore).color}`}>
                  {riskLevel(selected.cheatScore).label}
                </span>
              </div>

              <div className="mt-4 bg-navy rounded-md aspect-video flex items-center justify-center">
                <span className="font-body text-xs text-white/40">Video buổi thi (S3)</span>
              </div>

              <p className="font-body text-xs font-medium text-slate-soft uppercase tracking-wide mt-5 mb-3">
                Lịch sử cảnh báo
              </p>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {selected.alerts.map((a, i) => {
                  const s = levelStyle[a.level]
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                      <div>
                        <p className={`font-body text-xs ${s.text}`}>{a.text}</p>
                        <p className="font-mono text-[10px] text-slate-soft/70">{a.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => navigate('/report')}
                className="w-full mt-5 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors"
              >
                Xem báo cáo chi tiết (AI)
              </button>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}

function NavItem({ label, active }) {
  return (
    <button
      className={`w-full text-left font-body text-sm px-3 py-2 rounded-md transition-colors ${
        active ? 'bg-white/10 text-ivory' : 'text-white/50 hover:text-ivory hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-navy/10 rounded-lg p-5">
      <p className="font-body text-xs text-slate-soft uppercase tracking-wide">{label}</p>
      <p className={`font-display text-3xl mt-1 ${accent}`}>{value}</p>
    </div>
  )
}