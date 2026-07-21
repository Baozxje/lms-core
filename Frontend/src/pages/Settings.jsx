import { useState } from 'react'

export default function Settings() {
  const [thresholds, setThresholds] = useState({
    lookAway: 10,
    noFace: 5,
    secondVoice: true,
    phoneDetection: true,
    secondPerson: true,
  })
  const [warnScore, setWarnScore] = useState(25)
  const [flagScore, setFlagScore] = useState(60)
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      <aside className="w-60 bg-navy shrink-0 flex flex-col py-6 px-4">
        <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase px-2">
          ProctorLMS
        </span>
        <nav className="mt-10 space-y-1">
          <NavItem label="Tổng quan giám thị" />
          <NavItem label="Khóa học & đề thi" />
          <NavItem label="Sinh viên" />
          <NavItem label="Cài đặt" active />
        </nav>
      </aside>

      <main className="flex-1 px-10 py-8 max-w-2xl">
        <h1 className="font-display text-3xl text-navy">Cài đặt hệ thống</h1>
        <p className="font-body text-sm text-slate-soft mt-1">
          Cấu hình ngưỡng cảnh báo và quy tắc phát hiện của pipeline AI giám thị.
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          <section className="bg-white border border-navy/10 rounded-lg p-6">
            <h2 className="font-body text-sm font-medium text-navy mb-4">Ngưỡng thời gian</h2>
            <div className="space-y-4">
              <SliderField
                label="Cảnh báo khi rời khỏi màn hình quá"
                unit="giây"
                value={thresholds.lookAway}
                onChange={(v) => setThresholds((t) => ({ ...t, lookAway: v }))}
                min={3}
                max={30}
              />
              <SliderField
                label="Cảnh báo khi không phát hiện khuôn mặt quá"
                unit="giây"
                value={thresholds.noFace}
                onChange={(v) => setThresholds((t) => ({ ...t, noFace: v }))}
                min={2}
                max={20}
              />
            </div>
          </section>

          <section className="bg-white border border-navy/10 rounded-lg p-6">
            <h2 className="font-body text-sm font-medium text-navy mb-4">Quy tắc phát hiện (Rekognition / Transcribe)</h2>
            <div className="space-y-3">
              <ToggleField
                label="Phát hiện giọng nói thứ hai"
                checked={thresholds.secondVoice}
                onChange={(v) => setThresholds((t) => ({ ...t, secondVoice: v }))}
              />
              <ToggleField
                label="Phát hiện điện thoại / vật thể cấm"
                checked={thresholds.phoneDetection}
                onChange={(v) => setThresholds((t) => ({ ...t, phoneDetection: v }))}
              />
              <ToggleField
                label="Phát hiện người thứ hai trong khung hình"
                checked={thresholds.secondPerson}
                onChange={(v) => setThresholds((t) => ({ ...t, secondPerson: v }))}
              />
            </div>
          </section>

          <section className="bg-white border border-navy/10 rounded-lg p-6">
            <h2 className="font-body text-sm font-medium text-navy mb-4">Ngưỡng cheat score</h2>
            <div className="space-y-4">
              <SliderField
                label="Mức 'Cần xem xét' bắt đầu từ"
                unit="điểm"
                value={warnScore}
                onChange={setWarnScore}
                min={10}
                max={50}
              />
              <SliderField
                label="Mức 'Rủi ro cao' bắt đầu từ"
                unit="điểm"
                value={flagScore}
                onChange={setFlagScore}
                min={40}
                max={90}
              />
              <p className="font-body text-xs text-slate-soft">
                SNS sẽ gửi cảnh báo khẩn tới quản trị viên khi cheat score vượt mức "Rủi ro cao".
              </p>
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="font-body text-sm bg-navy text-ivory font-medium px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors"
            >
              Lưu cấu hình
            </button>
            {saved && <p className="font-body text-xs text-success">✓ Đã lưu thành công</p>}
          </div>
        </form>
      </main>
    </div>
  )
}

function SliderField({ label, unit, value, onChange, min, max }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-body text-sm text-navy">{label}</label>
        <span className="font-mono text-xs text-amber-dark">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber"
      />
    </div>
  )
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="font-body text-sm text-navy">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full relative transition-colors ${
          checked ? 'bg-amber' : 'bg-navy/15'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

function NavItem({ label, active }) {
  return (
    <button
      className={`w-full text-left font-body text-sm px-3 py-2 rounded-md transition-colors ${
        active ? 'bg-white/10 text-ivory' : 'text-white/50 hover:text-ivory hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  )
}