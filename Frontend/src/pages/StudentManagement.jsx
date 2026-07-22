import { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar.jsx'
import { getAllUsers } from '../api/users.js'

const roleLabel = {
  STUDENT: 'Sinh viên',
  INSTRUCTOR: 'Giảng viên',
  ADMIN: 'Quản trị',
}

export default function StudentManagement() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data ?? []))
      .catch((err) => setError(err.message || 'Không tải được danh sách người dùng'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-ivory flex">
      <AdminSidebar />

      <main className="flex-1 px-10 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-navy">Người dùng</h1>
          <p className="font-body text-sm text-slate-soft mt-1">
            {loading ? 'Đang tải...' : `${users.length} người dùng trong hệ thống.`}
          </p>
        </header>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc email…"
          className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm mb-4 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
        />

        {error && <p className="font-body text-sm text-danger mb-4">{error}</p>}

        <div className="bg-white border border-navy/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="font-body text-xs text-slate-soft uppercase tracking-wide">
                <th className="text-left font-medium px-5 py-2.5">Họ tên</th>
                <th className="text-left font-medium px-5 py-2.5">Email</th>
                <th className="text-left font-medium px-5 py-2.5">Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-navy/5">
                  <td className="px-5 py-3 font-body text-sm text-navy">{u.fullName}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-soft">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] bg-navy/5 px-2 py-0.5 rounded text-slate-soft">
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center font-body text-sm text-slate-soft">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}