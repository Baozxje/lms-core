import { useEffect, useState } from 'react'
import { getCourses, createCourse } from '../api/courses.js'

export default function CourseManagement() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', price: '' })
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function loadCourses() {
    setLoading(true)
    getCourses()
      .then((page) => setCourses(page?.content ?? []))
      .catch((err) => setError(err.message || 'Không tải được danh sách khóa học'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCourses()
  }, [])

  async function handleCreateCourse(e) {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      await createCourse(
        { title: form.title, description: form.description, price: Number(form.price) || 0 },
        thumbnailFile
      )
      setModalOpen(false)
      setForm({ title: '', description: '', price: '' })
      setThumbnailFile(null)
      loadCourses()
    } catch (err) {
      setSubmitError(err.message || 'Tạo khóa học thất bại. Kiểm tra lại quyền tài khoản (cần vai trò giảng viên).')
    } finally {
      setSubmitting(false)
    }
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
              {loading ? 'Đang tải...' : `${courses.length} khóa học trong hệ thống.`}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="font-body text-sm bg-navy text-ivory font-medium px-4 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
          >
            + Tạo khóa học mới
          </button>
        </header>

        {error && <p className="font-body text-sm text-danger mb-4">{error}</p>}

        {!loading && !error && courses.length === 0 && (
          <p className="font-body text-sm text-slate-soft">Chưa có khóa học nào. Bấm "Tạo khóa học mới" để bắt đầu.</p>
        )}

        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="bg-white border border-navy/10 rounded-lg p-5 flex items-center gap-4">
              {c.thumbnailUrl && (
                <img
                  src={c.thumbnailUrl}
                  alt=""
                  className="w-20 h-20 rounded-md object-cover shrink-0 bg-navy/5"
                />
              )}
              <div className="flex-1">
                <p className="font-mono text-[11px] text-slate-soft">{c.instructorName}</p>
                <p className="font-display text-lg text-navy">{c.title}</p>
                <p className="font-body text-xs text-slate-soft mt-1 line-clamp-2">{c.description}</p>
              </div>
              {c.price != null && (
                <p className="font-mono text-sm text-amber-dark shrink-0">
                  {c.price === 0 ? 'Miễn phí' : `${c.price.toLocaleString('vi-VN')}đ`}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50"
          onClick={() => !submitting && setModalOpen(false)}
        >
          <form
            onSubmit={handleCreateCourse}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-sm w-full p-6"
          >
            <h2 className="font-display text-xl text-navy">Tạo khóa học mới</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Tên khóa học</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="VD: Cấu trúc dữ liệu & giải thuật"
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Mô tả</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber resize-none"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Giá (VNĐ, để 0 nếu miễn phí)</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0"
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Ảnh thumbnail (tùy chọn)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                  className="w-full font-body text-sm"
                />
              </div>
            </div>

            {submitError && (
              <p className="font-body text-xs text-danger mt-3">{submitError}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setModalOpen(false)}
                className="flex-1 font-body text-sm border border-navy/20 text-navy font-medium py-2.5 rounded-md hover:bg-navy/5 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors disabled:opacity-60"
              >
                {submitting ? 'Đang tạo…' : 'Tạo khóa học'}
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