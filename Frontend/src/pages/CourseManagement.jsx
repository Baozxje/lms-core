import { useState } from 'react'

const initialCourses = [
  {
    id: 1,
    code: 'CS201',
    name: 'Cấu trúc dữ liệu & giải thuật',
    students: 42,
    exams: [
      { id: 1, title: 'Kiểm tra giữa kỳ', date: '05/06/2026', questions: 20 },
      { id: 2, title: 'Thi cuối kỳ', date: '20/07/2026', questions: 30 },
    ],
  },
  {
    id: 2,
    code: 'CS304',
    name: 'Cơ sở dữ liệu',
    students: 35,
    exams: [{ id: 3, title: 'Thi giữa kỳ', date: '25/07/2026', questions: 25 }],
  },
]

export default function CourseManagement() {
  const [courses, setCourses] = useState(initialCourses)
  const [expandedId, setExpandedId] = useState(1)
  const [modalCourseId, setModalCourseId] = useState(null)
  const [form, setForm] = useState({ title: '', date: '', questions: '' })

  function openModal(courseId) {
    setModalCourseId(courseId)
    setForm({ title: '', date: '', questions: '' })
  }

  function handleCreateExam(e) {
    e.preventDefault()
    setCourses((prev) =>
      prev.map((c) =>
        c.id === modalCourseId
          ? {
              ...c,
              exams: [
                ...c.exams,
                {
                  id: Date.now(),
                  title: form.title,
                  date: form.date,
                  questions: Number(form.questions) || 0,
                },
              ],
            }
          : c
      )
    )
    setModalCourseId(null)
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      <aside className="w-60 bg-navy shrink-0 flex flex-col py-6 px-4">
        <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase px-2">
          ProctorLMS
        </span>
        <nav className="mt-10 space-y-1">
          <NavItem label="Tổng quan giám thị" />
          <NavItem label="Khóa học & đề thi" active />
          <NavItem label="Báo cáo AI" />
          <NavItem label="Cài đặt" />
        </nav>
      </aside>

      <main className="flex-1 px-10 py-8 max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-navy">Khóa học & đề thi</h1>
            <p className="font-body text-sm text-slate-soft mt-1">
              Quản lý danh sách khóa học và các bài thi trong từng môn.
            </p>
          </div>
        </header>

        <div className="space-y-4">
          {courses.map((c) => {
            const expanded = expandedId === c.id
            return (
              <div key={c.id} className="bg-white border border-navy/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedId(expanded ? null : c.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-navy/5 transition-colors"
                >
                  <div className="text-left">
                    <span className="font-mono text-[11px] text-slate-soft">{c.code}</span>
                    <p className="font-display text-lg text-navy">{c.name}</p>
                    <p className="font-body text-xs text-slate-soft mt-0.5">
                      {c.students} sinh viên · {c.exams.length} bài thi
                    </p>
                  </div>
                  <span className="font-body text-slate-soft text-lg">{expanded ? '−' : '+'}</span>
                </button>

                {expanded && (
                  <div className="border-t border-navy/10 px-5 py-4">
                    <div className="space-y-2">
                      {c.exams.map((ex) => (
                        <div
                          key={ex.id}
                          className="flex items-center justify-between font-body text-sm py-2 border-b border-navy/5 last:border-0"
                        >
                          <span className="text-navy">{ex.title}</span>
                          <span className="font-mono text-xs text-slate-soft">
                            {ex.date} · {ex.questions} câu
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => openModal(c.id)}
                      className="mt-4 font-body text-xs text-amber-dark hover:underline"
                    >
                      + Tạo đề thi mới
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* Modal tạo đề thi */}
      {modalCourseId && (
        <div
          className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50"
          onClick={() => setModalCourseId(null)}
        >
          <form
            onSubmit={handleCreateExam}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-sm w-full p-6"
          >
            <h2 className="font-display text-xl text-navy">Tạo đề thi mới</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">
                  Tên bài thi
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="VD: Thi cuối kỳ"
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">
                  Ngày thi
                </label>
                <input
                  required
                  type="date"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      date: new Date(e.target.value).toLocaleDateString('vi-VN'),
                    }))
                  }
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">
                  Số câu hỏi
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.questions}
                  onChange={(e) => setForm((f) => ({ ...f, questions: e.target.value }))}
                  placeholder="VD: 20"
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setModalCourseId(null)}
                className="flex-1 font-body text-sm border border-navy/20 text-navy font-medium py-2.5 rounded-md hover:bg-navy/5 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors"
              >
                Tạo đề thi
              </button>
            </div>
          </form>
        </div>
      )}
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