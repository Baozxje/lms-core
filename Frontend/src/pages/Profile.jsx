import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [saved, setSaved] = useState(false)

  function handleSavePassword(e) {
    e.preventDefault()
    // TODO: gọi API đổi mật khẩu qua Cognito (ChangePassword / ForgotPassword flow)
    setSaved(true)
    setPw({ current: '', next: '', confirm: '' })
    setTimeout(() => setSaved(false), 3000)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-xl mx-auto px-10 py-10">
        <h1 className="font-display text-3xl text-navy">Hồ sơ cá nhân</h1>
        <p className="font-body text-sm text-slate-soft mt-1">
          Thông tin tài khoản và bảo mật.
        </p>

        <section className="bg-white border border-navy/10 rounded-lg p-6 mt-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber/20 flex items-center justify-center font-display text-lg text-amber-dark">
              {(user?.name ?? '?').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="font-display text-lg text-navy">{user?.name ?? 'Đang tải...'}</p>
              <p className="font-mono text-xs text-slate-soft">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Field label="Họ và tên" value={user?.name ?? ''} disabled />
            <Field label="Email" value={user?.email ?? ''} disabled />
            <Field label="Vai trò" value={user?.role ?? ''} disabled />
          </div>
          <p className="font-body text-xs text-slate-soft mt-3">
            Thông tin này lấy từ tài khoản Cognito, liên hệ phòng đào tạo nếu cần chỉnh sửa.
          </p>
        </section>

        <section className="bg-white border border-navy/10 rounded-lg p-6 mt-6">
          <h2 className="font-body text-sm font-medium text-navy">Đổi mật khẩu</h2>
          <form onSubmit={handleSavePassword} className="mt-4 space-y-4">
            <Field
              label="Mật khẩu hiện tại"
              type="password"
              value={pw.current}
              onChange={(v) => setPw((p) => ({ ...p, current: v }))}
            />
            <Field
              label="Mật khẩu mới"
              type="password"
              value={pw.next}
              onChange={(v) => setPw((p) => ({ ...p, next: v }))}
            />
            <Field
              label="Xác nhận mật khẩu mới"
              type="password"
              value={pw.confirm}
              onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
            />
            <button
              type="submit"
              className="font-body text-sm bg-navy text-ivory font-medium px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
            >
              Cập nhật mật khẩu
            </button>
            {saved && (
              <p className="font-body text-xs text-success">
                ✓ (Demo) Chưa nối API đổi mật khẩu thật — cần thêm endpoint Cognito ChangePassword ở backend
              </p>
            )}
          </form>
        </section>

        <button
          onClick={handleLogout}
          className="w-full mt-6 font-body text-sm border border-danger/30 text-danger font-medium py-2.5 rounded-md hover:bg-danger/5 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, disabled, type = 'text', onChange }) {
  return (
    <div>
      <label className="block font-body text-xs font-medium text-navy mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 font-body text-sm text-navy disabled:bg-navy/5 disabled:text-slate-soft focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber transition-colors"
      />
    </div>
  )
}