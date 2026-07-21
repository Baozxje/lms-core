import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const course = {
  code: 'CS201',
  name: 'Cấu trúc dữ liệu & giải thuật',
  instructor: 'TS. Nguyễn Định Nam',
  term: 'Học kỳ 2 · 2025-2026',
  description:
    'Môn học cung cấp nền tảng về các cấu trúc dữ liệu cơ bản (mảng, danh sách liên kết, cây, đồ thị) và các giải thuật sắp xếp, tìm kiếm, phân tích độ phức tạp.',
  progress: 100,
}

const items = [
  {
    id: 1,
    type: 'exam',
    title: 'Kiểm tra giữa kỳ',
    date: '05/06/2026',
    status: 'completed',
    score: '8.5/10',
  },
  {
    id: 2,
    type: 'assignment',
    title: 'Bài tập lớn: Cài đặt cây AVL',
    date: '20/06/2026',
    status: 'completed',
    score: '9.0/10',
  },
  {
    id: 3,
    type: 'exam',
    title: 'Thi cuối kỳ',
    date: '20/07/2026 · 10:00',
    status: 'active',
    score: null,
  },
  {
    id: 4,
    type: 'assignment',
    title: 'Bài tập tuần 15: Đồ thị và BFS/DFS',
    date: '18/07/2026',
    status: 'upcoming',
    score: null,
  },
]

const typeLabel = { exam: 'Bài thi', assignment: 'Bài tập' }

const statusMap = {
  completed: { label: 'Đã hoàn thành', color: 'text-success', dot: 'bg-success' },
  active: { label: 'Đang mở', color: 'text-amber-dark', dot: 'bg-amber' },
  upcoming: { label: 'Sắp tới', color: 'text-slate-soft', dot: 'bg-slate-soft' },
}

const tabs = ['Bài thi & bài tập', 'Tài liệu', 'Thông báo']

export default function CourseDetail() {
  const [tab, setTab] = useState(0)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ivory">
      {/* Banner khóa học */}
      <div className="bg-navy px-10 py-10">
        <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase">
          {course.code} · {course.term}
        </span>
        <h1 className="font-display text-3xl text-ivory mt-2">{course.name}</h1>
        <p className="font-body text-sm text-white/60 mt-3 max-w-2xl leading-relaxed">
          {course.description}
        </p>
        <p className="font-body text-xs text-white/40 mt-4">Giảng viên: {course.instructor}</p>
      </div>

      <div className="max-w-4xl mx-auto px-10 py-8">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-navy/10 mb-6">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`font-body text-sm px-4 py-2.5 -mb-px border-b-2 transition-colors ${
                tab === i
                  ? 'border-amber text-navy'
                  : 'border-transparent text-slate-soft hover:text-navy'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="space-y-3">
            {items.map((item) => {
              const s = statusMap[item.status]
              return (
                <div
                  key={item.id}
                  className="bg-white border border-navy/10 rounded-lg p-5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-soft uppercase tracking-wide bg-navy/5 px-2 py-0.5 rounded">
                        {typeLabel[item.type]}
                      </span>
                      <span className={`flex items-center gap-1.5 font-body text-xs ${s.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-navy mt-2">{item.title}</h3>
                    <p className="font-body text-xs text-slate-soft mt-1">{item.date}</p>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    {item.score && (
                      <p className="font-mono text-sm text-navy mb-2">{item.score}</p>
                    )}
                    {item.status === 'active' && item.type === 'exam' && (
                      <button
                        onClick={() => navigate('/exam')}
                        className="font-body text-sm bg-amber text-navy font-medium px-4 py-2 rounded-md hover:bg-amber-dark transition-colors"
                      >
                        Vào thi
                      </button>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="font-body text-xs text-slate-soft">Chưa mở</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 1 && (
          <div className="bg-white border border-navy/10 rounded-lg p-8 text-center">
            <p className="font-body text-sm text-slate-soft">Chưa có tài liệu nào được đăng.</p>
          </div>
        )}

        {tab === 2 && (
          <div className="bg-white border border-navy/10 rounded-lg p-8 text-center">
            <p className="font-body text-sm text-slate-soft">Chưa có thông báo nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}