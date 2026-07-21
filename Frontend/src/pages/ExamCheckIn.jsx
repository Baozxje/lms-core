import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const rules = [
  'Giữ khuôn mặt trong khung hình camera trong suốt quá trình thi.',
  'Không sử dụng điện thoại, tài liệu, hoặc thiết bị hỗ trợ khác.',
  'Không rời khỏi màn hình quá 10 giây liên tục.',
  'Không có người khác xuất hiện trong phòng thi.',
  'Giữ im lặng, không trao đổi với người khác trong lúc thi.',
]

const steps = ['Kiểm tra thiết bị', 'Xác thực danh tính', 'Quy chế thi']

export default function ExamCheckIn() {
  const [step, setStep] = useState(0)
  const [camOk, setCamOk] = useState(null)
  const [micOk, setMicOk] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [captured, setCaptured] = useState(false)
  const videoRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let stream
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((s) => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
        setCamOk(true)
        setMicOk(true)
      })
      .catch(() => {
        setCamOk(false)
        setMicOk(false)
      })
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [])

  function captureIdentity() {
    setCapturing(true)
    setTimeout(() => {
      setCapturing(false)
      setCaptured(true)
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-mono text-xs ${
                  i < step
                    ? 'bg-success text-white'
                    : i === step
                    ? 'bg-navy text-ivory'
                    : 'bg-navy/10 text-slate-soft'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 ${i < step ? 'bg-success' : 'bg-navy/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-navy/10 rounded-lg p-8">
          {step === 0 && (
            <>
              <h2 className="font-display text-2xl text-navy">Kiểm tra thiết bị</h2>
              <p className="font-body text-sm text-slate-soft mt-1">
                Đảm bảo camera và microphone hoạt động trước khi vào phòng thi.
              </p>

              <div className="mt-6 bg-navy rounded-lg aspect-video relative overflow-hidden">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                {camOk === null && (
                  <span className="absolute inset-0 flex items-center justify-center font-body text-xs text-white/50">
                    Đang kết nối camera…
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <CheckRow label="Camera" ok={camOk} />
                <CheckRow label="Microphone" ok={micOk} />
              </div>

              {camOk === false && (
                <p className="font-body text-xs text-danger mt-3">
                  Không thể truy cập camera/mic. Vui lòng cấp quyền trong trình duyệt rồi tải lại trang.
                </p>
              )}

              <button
                disabled={!camOk || !micOk}
                onClick={() => setStep(1)}
                className="w-full mt-6 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors disabled:opacity-30 disabled:hover:bg-navy"
              >
                Tiếp tục
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-display text-2xl text-navy">Xác thực danh tính</h2>
              <p className="font-body text-sm text-slate-soft mt-1">
                Nhìn thẳng vào camera để hệ thống xác thực khuôn mặt trước khi bắt đầu.
              </p>

              <div className="mt-6 bg-navy rounded-lg aspect-video relative overflow-hidden flex items-center justify-center">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-4 border-amber/0 m-10 rounded-full" style={{ borderColor: captured ? '#3E7C59' : capturing ? '#D9A24B' : 'transparent', transition: 'border-color 0.3s' }} />
                {capturing && (
                  <span className="absolute bottom-3 font-body text-xs text-amber bg-black/40 px-2 py-1 rounded">
                    Đang xác thực khuôn mặt…
                  </span>
                )}
                {captured && (
                  <span className="absolute bottom-3 font-body text-xs text-success bg-black/40 px-2 py-1 rounded">
                    ✓ Xác thực thành công
                  </span>
                )}
              </div>

              {!captured ? (
                <button
                  onClick={captureIdentity}
                  disabled={capturing}
                  className="w-full mt-6 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors disabled:opacity-50"
                >
                  {capturing ? 'Đang xử lý…' : 'Bắt đầu xác thực'}
                </button>
              ) : (
                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors"
                >
                  Tiếp tục
                </button>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-2xl text-navy">Quy chế thi</h2>
              <p className="font-body text-sm text-slate-soft mt-1">
                Đọc kỹ và xác nhận trước khi vào phòng thi.
              </p>

              <ul className="mt-6 space-y-3">
                {rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm text-navy">
                    <span className="font-mono text-xs text-amber-dark mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>

              <label className="flex items-start gap-2.5 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-amber"
                />
                <span className="font-body text-sm text-navy">
                  Tôi đã đọc và đồng ý tuân thủ quy chế thi. Tôi hiểu rằng vi phạm có thể dẫn đến hủy bài thi.
                </span>
              </label>

              <button
                disabled={!agreed}
                onClick={() => navigate('/exam')}
                className="w-full mt-6 font-body text-sm bg-amber text-navy font-medium py-2.5 rounded-md hover:bg-amber-dark transition-colors disabled:opacity-30 disabled:hover:bg-amber"
              >
                Vào phòng thi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckRow({ label, ok }) {
  return (
    <div className="flex items-center justify-between font-body text-sm">
      <span className="text-navy">{label}</span>
      <span
        className={
          ok === null ? 'text-slate-soft' : ok ? 'text-success' : 'text-danger'
        }
      >
        {ok === null ? 'Đang kiểm tra…' : ok ? '✓ Hoạt động tốt' : '✕ Không phát hiện'}
      </span>
    </div>
  )
}