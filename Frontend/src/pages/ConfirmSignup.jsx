import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { confirmSignUp } from '../api/auth.js'

export default function ConfirmSignup() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await confirmSignUp(email, code)
      setSuccess('Xác nhận thành công! Đang chuyển tới trang đăng nhập…')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message || 'Mã xác nhận không đúng hoặc đã hết hạn.')
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
        <h2 className="font-display text-3xl text-navy mt-2">Xác nhận email</h2>
        <p className="font-body text-sm text-slate-soft mt-2">
          Nhập mã 6 số Cognito đã gửi tới email của bạn.
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
              className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm text-navy focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-navy mb-1.5">
              Mã xác nhận
            </label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-mono text-sm tracking-widest text-navy focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy text-ivory font-body text-sm font-medium py-2.5 hover:bg-navy-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Đang xác nhận…' : 'Xác nhận'}
          </button>
        </form>

        {error && (
          <p className="font-body text-xs text-danger mt-4 text-center">{error}</p>
        )}
        {success && (
          <p className="font-body text-xs text-success mt-4 text-center">{success}</p>
        )}

        <p className="font-body text-xs text-slate-soft mt-8 text-center">
          Chưa nhận được mã?{' '}
          <a href="/register" className="text-amber-dark hover:underline">
            Đăng ký lại
          </a>
        </p>
      </div>
    </div>
  )
}