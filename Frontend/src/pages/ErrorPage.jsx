import { useNavigate } from 'react-router-dom'

const content = {
  404: {
    title: 'Không tìm thấy trang',
    desc: 'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.',
  },
  403: {
    title: 'Không có quyền truy cập',
    desc: 'Tài khoản của bạn không có quyền xem trang này. Liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.',
  },
}

export default function ErrorPage({ code = 404 }) {
  const navigate = useNavigate()
  const c = content[code] || content[404]

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="font-mono text-6xl text-navy/15">{code}</p>
        <h1 className="font-display text-2xl text-navy mt-2">{c.title}</h1>
        <p className="font-body text-sm text-slate-soft mt-2 leading-relaxed">{c.desc}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 font-body text-sm bg-navy text-ivory font-medium px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  )
}