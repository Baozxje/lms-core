import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getCourses } from '../api/courses.js'
import StudentSidebar from '../components/StudentSidebar.jsx'

const statusMap = {
  ready: { label: 'Sẵn sàng', color: 'text-success', dot: 'bg-success' },
  'in-progress': { label: 'Đang diễn ra', color: 'text-amber-dark', dot: 'bg-amber' },
  locked: { label: 'Chưa mở', color: 'text-slate-soft', dot: 'bg-slate-soft' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCourses()
      .then((page) => setCourses(page?.content ?? []))
      .catch((err) => setError(err.message || 'Không tải được danh sách khóa học'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-ivory flex">
      <StudentSidebar user={user} />

      <main className="flex-1 px-10 py-8 max-w-5xl">
        <header className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl text-navy">Chào {user?.name?.split(' ').slice(-1)[0] ?? ''},</h1>
            <p className="font-body text-sm text-slate-soft mt-1">
              {loading ? 'Đang tải danh sách khóa học…' : `Bạn có ${courses.length} khóa học.`}
            </p>
          </div>
          <ProgressRing value={65} label="Học kỳ" />
        </header>

        <section>
          <h2 className="font-body text-xs font-medium text-slate-soft uppercase tracking-wide mb-4">
            Khóa học của bạn
          </h2>

          {error && (
            <p className="font-body text-sm text-danger mb-4">{error}</p>
          )}

          {!loading && !error && courses.length === 0 && (
            <p className="font-body text-sm text-slate-soft">Bạn chưa có khóa học nào.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} onClick={() => navigate(`/course/${c.id}`)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function CourseCard({ course, onClick }) {
  const status = 'ready'
  const progress = 100
  const s = statusMap[status]

  return (
    <div
      onClick={onClick}
      className="bg-white border border-navy/10 rounded-lg p-5 hover:border-amber/50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] text-slate-soft">{course.instructorName}</p>
          <h3 className="font-display text-lg text-navy mt-0.5">{course.title}</h3>
        </div>
        <span className={`flex items-center gap-1.5 font-body text-xs ${s.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>
      <p className="font-body text-xs text-slate-soft mt-3 line-clamp-2">{course.description}</p>
      <div className="mt-3 h-1 bg-navy/5 rounded-full overflow-hidden">
        <div className="h-full bg-amber rounded-full" style={{ width: `${progress}%` }} />
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
          cx="32" cy="32" r={r} stroke="#D9A24B" strokeWidth="5" fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
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