import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { label: 'Tổng quan', path: '/dashboard' },
  { label: 'Khóa học & bài thi', path: '/dashboard' },
  { label: 'Lịch sử thi', path: '/history' },
  { label: 'Hồ sơ cá nhân', path: '/profile' },
]

export default function StudentSidebar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="w-60 bg-navy shrink-0 flex flex-col justify-between py-6 px-4">
      <div>
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
      </div>

      <button
        onClick={() => navigate('/profile')}
        className="px-2 flex items-center gap-3 hover:bg-white/5 rounded-md py-2 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center font-body text-xs font-medium text-amber shrink-0">
          {(user?.name ?? '?').slice(0, 1).toUpperCase()}
        </div>
        <div className="leading-tight overflow-hidden">
          <p className="font-body text-xs text-ivory truncate">{user?.name ?? 'Đang tải...'}</p>
          <p className="font-mono text-[10px] text-white/40 truncate">{user?.email}</p>
        </div>
      </button>
    </aside>
  )
}