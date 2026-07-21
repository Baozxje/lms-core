import { useState } from 'react'

const initialStudents = [
  { id: 1, name: 'Nguyễn Đức Hiếu', mssv: '2280600952', course: 'CS201', email: 'hieuchucc91@gmail.com' },
  { id: 2, name: 'Lâm Gia Bảo', mssv: '20210392', course: 'CS201', email: 'bao.lg@student.edu.vn' },
  { id: 3, name: 'Nguyễn Thiên Hưng', mssv: '20210271', course: 'CS304', email: 'hung.lh@student.edu.vn' },
  { id: 4, name: 'Nguyễn Định Nam', mssv: '20210603', course: 'CS304', email: 'map.pg@student.edu.vn' },
]

export default function StudentManagement() {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', mssv: '', course: 'CS201', email: '' })

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.mssv.includes(search)
  )

  function handleAdd(e) {
    e.preventDefault()
    setStudents((prev) => [...prev, { id: Date.now(), ...form }])
    setForm({ name: '', mssv: '', course: 'CS201', email: '' })
    setModalOpen(false)
  }

  function handleRemove(id) {
    if (window.confirm('Xóa sinh viên này khỏi danh sách?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id))
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
          <NavItem label="Khóa học & đề thi" />
          <NavItem label="Sinh viên" active />
          <NavItem label="Cài đặt" />
        </nav>
      </aside>

      <main className="flex-1 px-10 py-8 max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-navy">Sinh viên</h1>
            <p className="font-body text-sm text-slate-soft mt-1">
              {students.length} sinh viên trong hệ thống.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="font-body text-sm bg-navy text-ivory font-medium px-4 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
          >
            + Thêm sinh viên
          </button>
        </header>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc MSSV…"
          className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm mb-4 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
        />

        <div className="bg-white border border-navy/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="font-body text-xs text-slate-soft uppercase tracking-wide">
                <th className="text-left font-medium px-5 py-2.5">Họ tên</th>
                <th className="text-left font-medium px-5 py-2.5">MSSV</th>
                <th className="text-left font-medium px-5 py-2.5">Lớp học phần</th>
                <th className="text-left font-medium px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-navy/5">
                  <td className="px-5 py-3">
                    <p className="font-body text-sm text-navy">{s.name}</p>
                    <p className="font-mono text-[11px] text-slate-soft">{s.email}</p>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-soft">{s.mssv}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] bg-navy/5 px-2 py-0.5 rounded text-slate-soft">
                      {s.course}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleRemove(s.id)}
                      className="font-body text-xs text-danger hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center font-body text-sm text-slate-soft">
                    Không tìm thấy sinh viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50"
          onClick={() => setModalOpen(false)}
        >
          <form
            onSubmit={handleAdd}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-sm w-full p-6"
          >
            <h2 className="font-display text-xl text-navy">Thêm sinh viên</h2>
            <div className="mt-5 space-y-4">
              <TextField label="Họ và tên" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <TextField label="MSSV" value={form.mssv} onChange={(v) => setForm((f) => ({ ...f, mssv: v }))} />
              <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Lớp học phần</label>
                <select
                  value={form.course}
                  onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                >
                  <option value="CS201">CS201 · Cấu trúc dữ liệu</option>
                  <option value="CS304">CS304 · Cơ sở dữ liệu</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 font-body text-sm border border-navy/20 text-navy font-medium py-2.5 rounded-md hover:bg-navy/5 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors"
              >
                Thêm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function TextField({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block font-body text-xs font-medium text-navy mb-1.5">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
      />
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