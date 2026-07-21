import { useEffect, useState } from 'react'

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export default function OfflineOverlay() {
  const [secondsGone, setSecondsGone] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSecondsGone((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fixed inset-0 bg-navy/90 backdrop-blur-sm flex items-center justify-center z-[999] p-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-danger/20 flex items-center justify-center mx-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
        </div>
        <h1 className="font-display text-2xl text-ivory mt-5">Mất kết nối mạng</h1>
        <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
          Bài làm của bạn được lưu tự động, nhưng hệ thống giám thị tạm thời không thể
          ghi nhận. Vui lòng kiểm tra lại kết nối internet.
        </p>
        <p className="font-mono text-xs text-amber mt-4">
          Đã mất kết nối {secondsGone} giây
        </p>
      </div>
    </div>
  )
}