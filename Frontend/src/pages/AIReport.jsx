import { useNavigate } from 'react-router-dom'

const report = {
  id: 'SES-1041',
  student: 'Trần Minh Khoa',
  mssv: '20210392',
  course: 'CS201 · Thi cuối kỳ',
  date: '20/07/2026 · 10:00 – 10:47',
  cheatScore: 78,
  summary:
    'Hệ thống ghi nhận nhiều dấu hiệu bất thường trong phiên thi này, tập trung ở khoảng phút 5–19. Có sự xuất hiện lặp lại của giọng nói thứ hai và một vật thể nghi vấn được Rekognition nhận diện là điện thoại di động. Đề xuất giảng viên xem lại đoạn video tương ứng trước khi ra quyết định.',
  breakdown: [
    { label: 'Nhận diện khuôn mặt bất thường', value: 35, color: 'bg-danger' },
    { label: 'Âm thanh nghi vấn (Transcribe)', value: 28, color: 'bg-danger' },
    { label: 'Vật thể cấm trong khung hình', value: 22, color: 'bg-amber' },
    { label: 'Rời khỏi màn hình', value: 15, color: 'bg-amber' },
  ],
  timeline: [
    { time: '10:00', level: 'info', text: 'Bắt đầu giám sát, xác thực danh tính thành công' },
    { time: '10:05', level: 'danger', text: 'Phát hiện giọng nói thứ hai trong phòng' },
    { time: '10:11', level: 'danger', text: 'Phát hiện vật thể nghi vấn (điện thoại)' },
    { time: '10:19', level: 'warning', text: 'Không phát hiện khuôn mặt trong 6 giây' },
    { time: '10:27', level: 'danger', text: 'Phát hiện người thứ hai trong khung hình' },
    { time: '10:35', level: 'info', text: 'Khuôn mặt được xác thực lại, không phát hiện thêm bất thường' },
    { time: '10:47', level: 'info', text: 'Thí sinh nộp bài' },
  ],
}

const levelStyle = {
  info: { dot: 'bg-success', text: 'text-success' },
  warning: { dot: 'bg-amber', text: 'text-amber-dark' },
  danger: { dot: 'bg-danger', text: 'text-danger' },
}

export default function AIReport() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-10 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="font-body text-xs text-slate-soft hover:text-navy mb-6"
        >
          ← Về trang giám sát
        </button>

        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-xs tracking-wide text-slate-soft">{report.id}</span>
            <h1 className="font-display text-3xl text-navy mt-1">{report.student}</h1>
            <p className="font-body text-sm text-slate-soft mt-1">
              MSSV {report.mssv} · {report.course}
            </p>
            <p className="font-body text-xs text-slate-soft mt-1">{report.date}</p>
          </div>
          <div className="text-center shrink-0">
            <p className="font-mono text-4xl text-danger">{report.cheatScore}</p>
            <p className="font-body text-xs text-slate-soft mt-1">Cheat score</p>
          </div>
        </div>

        {/* Tóm tắt AI */}
        <div className="bg-navy rounded-lg p-6 mt-8">
          <p className="font-mono text-[10px] text-amber uppercase tracking-[0.15em]">
            Tổng hợp bởi Amazon Bedrock
          </p>
          <p className="font-body text-sm text-white/80 mt-3 leading-relaxed">
            {report.summary}
          </p>
        </div>

        {/* Phân rã điểm rủi ro */}
        <section className="mt-8">
          <h2 className="font-body text-xs font-medium text-slate-soft uppercase tracking-wide mb-4">
            Phân rã điểm rủi ro
          </h2>
          <div className="space-y-3">
            {report.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-sm text-navy">{b.label}</span>
                  <span className="font-mono text-xs text-slate-soft">{b.value}</span>
                </div>
                <div className="h-2 bg-navy/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${b.color}`}
                    style={{ width: `${b.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video buổi thi */}
        <section className="mt-8">
          <h2 className="font-body text-xs font-medium text-slate-soft uppercase tracking-wide mb-4">
            Video buổi thi
          </h2>
          <div className="bg-navy rounded-lg aspect-video flex items-center justify-center">
            <span className="font-body text-xs text-white/40">Nguồn: Amazon S3 · session-{report.id}.mp4</span>
          </div>
        </section>

        {/* Dòng thời gian */}
        <section className="mt-8 mb-10">
          <h2 className="font-body text-xs font-medium text-slate-soft uppercase tracking-wide mb-4">
            Dòng thời gian sự kiện
          </h2>
          <div className="bg-white border border-navy/10 rounded-lg divide-y divide-navy/5">
            {report.timeline.map((t, i) => {
              const s = levelStyle[t.level]
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="font-mono text-xs text-slate-soft w-12 shrink-0">{t.time}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                  <span className={`font-body text-sm ${s.text}`}>{t.text}</span>
                </div>
              )
            })}
          </div>
        </section>

        <div className="flex gap-3 mb-10">
          <button className="flex-1 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors">
            Đánh dấu vi phạm
          </button>
          <button className="flex-1 font-body text-sm border border-navy/20 text-navy font-medium py-2.5 rounded-md hover:bg-navy/5 transition-colors">
            Xác nhận hợp lệ
          </button>
        </div>
      </div>
    </div>
  )
}