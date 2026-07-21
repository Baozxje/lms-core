import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar.jsx'
import { getCourses } from '../api/courses.js'
import { getAttemptsByCourse } from '../api/attempts.js'

const statusMap = {
  COMPLETED: { label: 'Đã chấm', color: 'text-success' },
  PENDING_GRADING: { label: 'Đang chấm', color: 'text-amber-dark' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    getCourses()
      .then((page) => {
        const list = page?.content ?? []
        setCourses(list)
        if (list.length > 0) setCourseId(list[0].id)
      })
      .catch((err) => setError(err.message || 'Không tải được danh sách khóa học'))
  }, [])

  useEffect(() => {
    if (!courseId) return
    setLoading(true)
    getAttemptsByCourse(courseId)
      .then((data) => setAttempts(data ?? []))
      .catch((err) => setError(err.message || 'Không tải được danh sách bài thi'))
      .finally(() => setLoading(false))
  }, [courseId])

  const selected = attempts.find((a) => a.id === selectedId)
  const completedCount = attempts.filter((a) => a.status === 'COMPLETED').length
  const pendingCount = attempts.filter((a) => a.status === 'PENDING_GRADING').length

  return (
    <div className="min-h-screen bg-ivory flex">
      <AdminSidebar />

      <main className="flex-1 px-10 py-8 max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-navy">Quản lý bài thi</h1>
            <p className="font-body text-sm text-slate-soft mt-1">
              Danh sách bài thi sinh viên đã nộp theo khóa học.
            </p>
          </div>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="rounded-md border border-navy/15 bg-white px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label="Đã chấm xong" value={completedCount} accent="text-success" />
          <StatCard label="Đang chờ chấm" value={pendingCount} accent="text-amber-dark" />
        </div>

        {error && <p className="font-body text-sm text-danger mb-4">{error}</p>}
        {loading && <p className="font-body text-sm text-slate-soft">Đang tải…</p>}

        {!loading && attempts.length === 0 && (
          <p className="font-body text-sm text-slate-soft">Chưa có bài thi nào được nộp trong khóa học này.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <section className="bg-white border border-navy/10 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="font-body text-xs text-slate-soft uppercase tracking-wide">
                  <th className="text-left font-medium px-5 py-2.5">Sinh viên</th>
                  <th className="text-left font-medium px-5 py-2.5">Bài thi</th>
                  <th className="text-left font-medium px-5 py-2.5">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => {
                  const s = statusMap[a.status] ?? statusMap.PENDING_GRADING
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`cursor-pointer border-t border-navy/5 transition-colors ${
                        selectedId === a.id ? 'bg-amber/10' : 'hover:bg-navy/5'
                      }`}
                    >
                      <td className="px-5 py-3">
                        <p className="font-body text-sm text-navy">{a.studentName}</p>
                        <p className="font-mono text-[11px] text-slate-soft">{a.studentEmail}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-body text-sm text-navy">{a.examTitle}</p>
                        <span className={`font-body text-xs ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-5 py-3 font-mono text-sm text-navy">
                        {a.status === 'COMPLETED' ? a.totalScore?.toFixed(1) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          {selected && (
            <aside className="bg-white border border-navy/10 rounded-lg p-5 h-fit">
              <p className="font-display text-lg text-navy">{selected.studentName}</p>
              <p className="font-mono text-[11px] text-slate-soft">{selected.studentEmail}</p>

              <div className="mt-5 space-y-3 border-t border-navy/10 pt-4">
                <Row label="Bài thi" value={selected.examTitle} />
                <Row label="Ngày nộp" value={new Date(selected.createdAt).toLocaleString('vi-VN')} />
                <Row
                  label="Điểm"
                  value={selected.status === 'COMPLETED' ? selected.totalScore?.toFixed(1) : 'Đang chấm'}
                />
              </div>
            </aside>
          )}
        </div>
      </main>
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

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-navy/10 rounded-lg p-5">
      <p className="font-body text-xs text-slate-soft uppercase tracking-wide">{label}</p>
      <p className={`font-display text-3xl mt-1 ${accent}`}>{value}</p>
    </div>
  )
}