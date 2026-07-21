import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const loggedInUser = await login(email, password)
    navigate(loggedInUser?.role === 'INSTRUCTOR' ? '/admin' : '/dashboard')
  } catch (err) {
    setError(err.message || 'Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Panel trái: bối cảnh phòng thi */}
      <div className="hidden lg:flex relative bg-navy overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #F5F3EE 0px, #F5F3EE 1px, transparent 1px, transparent 48px), repeating-linear-gradient(0deg, #F5F3EE 0px, #F5F3EE 1px, transparent 1px, transparent 48px)',
            }}
          />
        </div>

        <div className="relative z-10">
          <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase">
            ProctorLMS
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <ExamClockMotif />
          <h1 className="font-display text-4xl text-ivory leading-tight mt-8">
            Kỳ thi công bằng,
            <br />
            giám sát bằng AI.
          </h1>
          <p className="font-body text-navy-light text-sm mt-4 text-white/60 leading-relaxed">
            Mỗi phiên thi được theo dõi theo thời gian thực — nhận diện khuôn
            mặt, âm thanh và hành vi bất thường — để đảm bảo tính toàn vẹn
            học thuật.
          </p>
        </div>

        <div className="relative z-10 font-mono text-[11px] text-white/40">
          © 2026 ProctorLMS · Bảo mật bởi AWS Cognito
        </div>
      </div>

      {/* Panel phải: form đăng nhập */}
      <div className="flex items-center justify-center p-8 bg-ivory">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <span className="font-mono text-xs tracking-[0.2em] text-amber-dark uppercase">
              ProctorLMS
            </span>
          </div>

          <h2 className="font-display text-3xl text-navy">Đăng nhập</h2>
          <p className="font-body text-sm text-slate-soft mt-2">
            Dùng tài khoản do trường cấp để vào hệ thống.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block font-body text-xs font-medium text-navy mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@truong.edu.vn"
                className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm text-navy placeholder:text-slate-soft/60 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-body text-xs font-medium text-navy">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  className="font-body text-xs text-amber-dark hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm text-navy placeholder:text-slate-soft/60 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-slate-soft hover:text-navy"
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-navy text-ivory font-body text-sm font-medium py-2.5 hover:bg-navy-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'Đang đăng nhập…' : 'Vào hệ thống'}
            </button>
          </form>

          {error && (
            <p className="font-body text-xs text-danger mt-4 text-center">{error}</p>
          )}

          <p className="font-body text-xs text-slate-soft mt-8 text-center">
  Chưa có tài khoản?{' '}
  <a href="/register" className="text-amber-dark hover:underline">
    Đăng ký ngay
  </a>
</p>
<p className="font-body text-xs text-slate-soft mt-2 text-center">
  Gặp sự cố đăng nhập? Liên hệ phòng đào tạo.
</p>
        </div>
      </div>
    </div>
  )
}

function ExamClockMotif() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="33" stroke="#F5F3EE" strokeOpacity="0.15" strokeWidth="2" />
      <circle
        cx="36"
        cy="36"
        r="33"
        stroke="#D9A24B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="207"
        strokeDashoffset="52"
        transform="rotate(-90 36 36)"
      />
      <line x1="36" y1="36" x2="36" y2="18" stroke="#F5F3EE" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="36" x2="48" y2="40" stroke="#D9A24B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="36" r="2.5" fill="#D9A24B" />
    </svg>
  )
}