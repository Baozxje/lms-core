const courses = [
  {
    name: 'Cấu trúc dữ liệu & giải thuật',
    code: 'CS201',
    exam: 'Thi cuối kỳ · 20/07/2026',
    progress: 100,
    status: 'ready',
  },
  {
    name: 'Cơ sở dữ liệu',
    code: 'CS304',
    exam: 'Thi giữa kỳ · 25/07/2026',
    progress: 65,
    status: 'in-progress',
  },
  {
    name: 'Mạng máy tính',
    code: 'CS312',
    exam: 'Chưa mở lịch thi',
    progress: 0,
    status: 'locked',
  },
]

const statusMap = {
  ready: { label: 'Sẵn sàng', color: 'text-success', dot: 'bg-success' },
  'in-progress': { label: 'Đang diễn ra', color: 'text-amber-dark', dot: 'bg-amber' },
  locked: { label: 'Chưa mở', color: 'text-slate-soft', dot: 'bg-slate-soft' },
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className="w-60 bg-navy shrink-0 flex flex-col justify-between py-6 px-4">
        <div>
          <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase px-2">
            ProctorLMS
          </span>
          <nav className="mt-10 space-y-1">
            <NavItem label="Tổng quan" active />
            <NavItem label="Khóa học & bài thi" />
            <NavItem label="Lịch sử thi" />
            <NavItem label="Cảnh báo" />
          </nav>
        </div>
        <div className="px-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center font-body text-xs font-medium text-amber">
            NT
          </div>
          <div className="leading-tight">
            <p className="font-body text-xs text-ivory">Mặt Trời Nhỏ</p>
            <p className="font-mono text-[10px] text-white/40">MSSV 20210458</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-10 py-8 max-w-5xl">
        <header className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl text-navy">Chào Mặt Trời Nhỏ,</h1>
            <p className="font-body text-sm text-slate-soft mt-1">
              Bạn có 1 bài thi đang diễn ra và 1 bài sắp tới.
            </p>
          </div>
          <ProgressRing value={65} label="Học kỳ" />
        </header>

        <section>
          <h2 className="font-body text-xs font-medium text-slate-soft uppercase tracking-wide mb-4">
            Khóa học của bạn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <CourseCard key={c.code} course={c} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function NavItem({ label, active }) {
  return (
    <button
      className={`w-full text-left font-body text-sm px-3 py-2 rounded-md transition-colors ${
        active
          ? 'bg-white/10 text-ivory'
          : 'text-white/50 hover:text-ivory hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  )
}

function CourseCard({ course }) {
  const s = statusMap[course.status]
  return (
    <div className="bg-white border border-navy/10 rounded-lg p-5 hover:border-amber/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] text-slate-soft">{course.code}</p>
          <h3 className="font-display text-lg text-navy mt-0.5">{course.name}</h3>
        </div>
        <span className={`flex items-center gap-1.5 font-body text-xs ${s.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>
      <p className="font-body text-xs text-slate-soft mt-3">{course.exam}</p>
      <div className="mt-3 h-1 bg-navy/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber rounded-full"
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>
  )
}

function ProgressRing({ value, label }) {
  const r = 26
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} stroke="#16213E" strokeOpacity="0.08" strokeWidth="5" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={r}
          stroke="#D9A24B"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="36" textAnchor="middle" className="font-mono" fontSize="13" fill="#16213E">
          {value}%
        </text>
      </svg>
      <span className="font-body text-xs text-slate-soft">{label}</span>
    </div>
  )
}