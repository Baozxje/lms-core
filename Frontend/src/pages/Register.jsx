import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/auth.js'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, fullName)
      navigate('/confirm', { state: { email } })
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
      <div className="w-full max-w-sm">
        <span className="font-mono text-xs tracking-[0.2em] text-amber-dark uppercase">
          ProctorLMS
        </span>
        <h2 className="font-display text-3xl text-navy mt-2">Tạo tài khoản</h2>
        <p className="font-body text-sm text-slate-soft mt-2">
          Đăng ký bằng email để bắt đầu học và thi trên hệ thống.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block font-body text-xs font-medium text-navy mb-1.5">
              Họ và tên
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm text-navy focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors"
            />
          </div>

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
              className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm text-navy focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-navy mb-1.5">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm text-navy focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors"
            />
            <p className="font-body text-[11px] text-slate-soft mt-1.5">
              Cognito yêu cầu mật khẩu có chữ hoa, chữ thường, số (tùy policy đã cấu hình).
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy text-ivory font-body text-sm font-medium py-2.5 hover:bg-navy-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Đang tạo tài khoản…' : 'Đăng ký'}
          </button>
        </form>

        {error && (
          <p className="font-body text-xs text-danger mt-4 text-center">{error}</p>
        )}

        <p className="font-body text-xs text-slate-soft mt-8 text-center">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-amber-dark hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  )
}