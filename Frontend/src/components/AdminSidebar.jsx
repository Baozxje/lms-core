import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { label: 'Tổng quan giám thị', path: '/admin' },
  { label: 'Khóa học & đề thi', path: '/admin/courses' },
  { label: 'Sinh viên', path: '/admin/students' },
  { label: 'Cài đặt', path: '/admin/settings' },
]

export default function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="w-60 bg-navy shrink-0 flex flex-col py-6 px-4">
      <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase px-2">
        ProctorLMS
      </span>
      <nav className="mt-10 space-y-1">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full text-left font-body text-sm px-3 py-2 rounded-md transition-colors ${
              location.pathname === item.path
                ? 'bg-white/10 text-ivory'
                : 'text-white/50 hover:text-ivory hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}