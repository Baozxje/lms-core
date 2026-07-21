import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  getCourseById,
  getSectionsByCourse,
  getLessonsBySection,
  getExamsByCourse,
  createSection,
  createLesson,
} from '../api/courses.js'
import { createExam } from '../api/exams.js'

const tabs = ['Nội dung khóa học', 'Bài thi & bài tập', 'Thông báo']

const emptyQuestion = () => ({
  content: '',
  type: 'MULTIPLE_CHOICE',
  points: 1,
  gradingRubric: '',
  answerOptions: [
    { content: '', isCorrect: true },
    { content: '', isCorrect: false },
  ],
})

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isInstructor = user?.role === 'INSTRUCTOR'
  const [tab, setTab] = useState(0)
  const [course, setCourse] = useState(null)
  const [sections, setSections] = useState([])
  const [exams, setExams] = useState([])
  const [lessonsBySection, setLessonsBySection] = useState({})
  const [expandedSection, setExpandedSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [sectionTitle, setSectionTitle] = useState('')
  const [sectionSubmitting, setSectionSubmitting] = useState(false)
  const [sectionError, setSectionError] = useState('')

  const [lessonModalSectionId, setLessonModalSectionId] = useState(null)
  const [lessonForm, setLessonForm] = useState({ title: '', content: '' })
  const [lessonVideoFile, setLessonVideoFile] = useState(null)
  const [lessonSubmitting, setLessonSubmitting] = useState(false)
  const [lessonError, setLessonError] = useState('')

  const [examModalOpen, setExamModalOpen] = useState(false)
  const [examForm, setExamForm] = useState({ title: '', durationMinutes: 30, passScore: 5 })
  const [examQuestions, setExamQuestions] = useState([emptyQuestion()])
  const [examSubmitting, setExamSubmitting] = useState(false)
  const [examError, setExamError] = useState('')

  async function loadCourseAndSections() {
    setLoading(true)
    setError('')
    try {
      const [courseData, sectionData, examData] = await Promise.all([
        getCourseById(id),
        getSectionsByCourse(id),
        getExamsByCourse(id),
      ])
      setCourse(courseData)
      setSections(sectionData ?? [])
      setExams(examData ?? [])
    } catch (err) {
      setError(err.message || 'Không tải được thông tin khóa học')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourseAndSections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function loadLessons(sectionId) {
    try {
      const lessons = await getLessonsBySection(sectionId)
      setLessonsBySection((prev) => ({ ...prev, [sectionId]: lessons ?? [] }))
    } catch {
      setLessonsBySection((prev) => ({ ...prev, [sectionId]: [] }))
    }
  }

  async function toggleSection(sectionId) {
    if (expandedSection === sectionId) {
      setExpandedSection(null)
      return
    }
    setExpandedSection(sectionId)
    if (!lessonsBySection[sectionId]) {
      await loadLessons(sectionId)
    }
  }

  async function handleCreateSection(e) {
    e.preventDefault()
    setSectionError('')
    setSectionSubmitting(true)
    try {
      await createSection({
        courseId: id,
        title: sectionTitle,
        sectionOrder: sections.length + 1,
      })
      setSectionModalOpen(false)
      setSectionTitle('')
      await loadCourseAndSections()
    } catch (err) {
      setSectionError(err.message || 'Tạo chương thất bại.')
    } finally {
      setSectionSubmitting(false)
    }
  }

  function openLessonModal(sectionId) {
    setLessonModalSectionId(sectionId)
    setLessonForm({ title: '', content: '' })
    setLessonVideoFile(null)
    setLessonError('')
  }

  async function handleCreateLesson(e) {
    e.preventDefault()
    setLessonError('')
    setLessonSubmitting(true)
    try {
      const currentLessons = lessonsBySection[lessonModalSectionId] ?? []
      await createLesson(
        {
          sectionId: lessonModalSectionId,
          title: lessonForm.title,
          content: lessonForm.content,
          lessonOrder: currentLessons.length + 1,
        },
        lessonVideoFile
      )
      const sectionId = lessonModalSectionId
      setLessonModalSectionId(null)
      await loadLessons(sectionId)
    } catch (err) {
      setLessonError(err.message || 'Tạo bài học thất bại.')
    } finally {
      setLessonSubmitting(false)
    }
  }

  function openExamModal() {
    setExamModalOpen(true)
    setExamForm({ title: '', durationMinutes: 30, passScore: 5 })
    setExamQuestions([emptyQuestion()])
    setExamError('')
  }

  function updateQuestion(index, patch) {
    setExamQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  function updateOption(qIndex, oIndex, patch) {
    setExamQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        const answerOptions = q.answerOptions.map((o, j) => (j === oIndex ? { ...o, ...patch } : o))
        return { ...q, answerOptions }
      })
    )
  }

  function setCorrectOption(qIndex, oIndex) {
    setExamQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        const answerOptions = q.answerOptions.map((o, j) => ({ ...o, isCorrect: j === oIndex }))
        return { ...q, answerOptions }
      })
    )
  }

  function addOption(qIndex) {
    setExamQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, answerOptions: [...q.answerOptions, { content: '', isCorrect: false }] } : q
      )
    )
  }

  function removeOption(qIndex, oIndex) {
    setExamQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, answerOptions: q.answerOptions.filter((_, j) => j !== oIndex) } : q
      )
    )
  }

  function addQuestion() {
    setExamQuestions((prev) => [...prev, emptyQuestion()])
  }

  function removeQuestion(index) {
    setExamQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleCreateExam(e) {
    e.preventDefault()
    setExamError('')
    setExamSubmitting(true)
    try {
      const payload = {
        title: examForm.title,
        durationMinutes: Number(examForm.durationMinutes),
        passScore: Number(examForm.passScore),
        courseId: id,
        questions: examQuestions.map((q) => ({
          content: q.content,
          type: q.type,
          points: Number(q.points),
          gradingRubric: q.type === 'ESSAY' ? q.gradingRubric : null,
          answerOptions: q.type === 'MULTIPLE_CHOICE' ? q.answerOptions : null,
        })),
      }
      await createExam(payload)
      setExamModalOpen(false)
      await loadCourseAndSections()
    } catch (err) {
      setExamError(err.message || 'Tạo đề thi thất bại.')
    } finally {
      setExamSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-body text-sm text-slate-soft">Đang tải khóa học…</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-body text-sm text-danger">{error || 'Không tìm thấy khóa học.'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-navy px-10 py-10">
        <span className="font-mono text-xs tracking-[0.2em] text-amber uppercase">
          {course.instructorName}
        </span>
        <h1 className="font-display text-3xl text-ivory mt-2">{course.title}</h1>
        <p className="font-body text-sm text-white/60 mt-3 max-w-2xl leading-relaxed">
          {course.description}
        </p>
        {course.price != null && (
          <p className="font-mono text-xs text-amber mt-4">
            {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')}đ`}
          </p>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-10 py-8">
        <div className="flex items-center justify-between mb-6 border-b border-navy/10">
          <div className="flex gap-1">
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
          {tab === 0 && isInstructor && (
            <button
              onClick={() => {
                setSectionModalOpen(true)
                setSectionError('')
              }}
              className="font-body text-xs text-amber-dark hover:underline mb-2"
            >
              + Thêm chương
            </button>
          )}
          {tab === 1 && isInstructor && (
            <button onClick={openExamModal} className="font-body text-xs text-amber-dark hover:underline mb-2">
              + Tạo đề thi
            </button>
          )}
        </div>

        {tab === 0 && (
          <div className="space-y-3">
            {sections.length === 0 && (
              <p className="font-body text-sm text-slate-soft">
                Khóa học chưa có chương học nào. Bấm "+ Thêm chương" để bắt đầu.
              </p>
            )}

            {sections.map((section) => {
              const expanded = expandedSection === section.id
              const lessons = lessonsBySection[section.id]
              return (
                <div key={section.id} className="bg-white border border-navy/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-navy/5 transition-colors"
                  >
                    <p className="font-display text-lg text-navy text-left">{section.title}</p>
                    <span className="font-body text-slate-soft text-lg">{expanded ? '−' : '+'}</span>
                  </button>

                  {expanded && (
                    <div className="border-t border-navy/10 px-5 py-4">
                      {lessons === undefined && (
                        <p className="font-body text-xs text-slate-soft">Đang tải bài học…</p>
                      )}
                      {lessons?.length === 0 && (
                        <p className="font-body text-xs text-slate-soft">Chương này chưa có bài học.</p>
                      )}
                      <div className="space-y-2">
                        {lessons?.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between font-body text-sm py-2 border-b border-navy/5 last:border-0"
                          >
                            <span className="text-navy">{lesson.title}</span>
                            {lesson.videoUrl && (
                              <span className="font-mono text-[10px] text-amber-dark uppercase">Video</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {isInstructor && (
                        <button
                          onClick={() => openLessonModal(section.id)}
                          className="mt-4 font-body text-xs text-amber-dark hover:underline"
                        >
                          + Thêm bài học
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            {exams.length === 0 && (
              <p className="font-body text-sm text-slate-soft">
                Khóa học chưa có bài thi nào. Bấm "+ Tạo đề thi" để bắt đầu.
              </p>
            )}
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border border-navy/10 rounded-lg p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-display text-lg text-navy">{exam.title}</p>
                  <p className="font-body text-xs text-slate-soft mt-1">
                    {exam.durationMinutes} phút · {exam.questionCount} câu
                    {exam.passScore != null && ` · Điểm đạt ${exam.passScore}`}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/exam-checkin/${exam.id}`)}
                  className="font-body text-sm bg-amber text-navy font-medium px-4 py-2 rounded-md hover:bg-amber-dark transition-colors shrink-0"
                >
                  Vào thi
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div className="bg-white border border-navy/10 rounded-lg p-8 text-center">
            <p className="font-body text-sm text-slate-soft">Chưa có thông báo nào.</p>
          </div>
        )}
      </div>

      {/* Modal tạo chương */}
      {sectionModalOpen && (
        <div
          className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50"
          onClick={() => !sectionSubmitting && setSectionModalOpen(false)}
        >
          <form
            onSubmit={handleCreateSection}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-sm w-full p-6"
          >
            <h2 className="font-display text-xl text-navy">Thêm chương mới</h2>
            <div className="mt-5">
              <label className="block font-body text-xs font-medium text-navy mb-1.5">Tên chương</label>
              <input
                required
                autoFocus
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="VD: Chương 1 - Giới thiệu"
                className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>

            {sectionError && <p className="font-body text-xs text-danger mt-3">{sectionError}</p>}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={sectionSubmitting}
                onClick={() => setSectionModalOpen(false)}
                className="flex-1 font-body text-sm border border-navy/20 text-navy font-medium py-2.5 rounded-md hover:bg-navy/5 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={sectionSubmitting}
                className="flex-1 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors disabled:opacity-60"
              >
                {sectionSubmitting ? 'Đang tạo…' : 'Tạo chương'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal tạo bài học */}
      {lessonModalSectionId && (
        <div
          className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50"
          onClick={() => !lessonSubmitting && setLessonModalSectionId(null)}
        >
          <form
            onSubmit={handleCreateLesson}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-sm w-full p-6"
          >
            <h2 className="font-display text-xl text-navy">Thêm bài học mới</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Tên bài học</label>
                <input
                  required
                  autoFocus
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="VD: Bài 1 - Tổng quan"
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Nội dung</label>
                <textarea
                  rows={3}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full rounded-md border border-navy/15 px-3.5 py-2.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber resize-none"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Video (tùy chọn)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setLessonVideoFile(e.target.files?.[0] ?? null)}
                  className="w-full font-body text-sm"
                />
              </div>
            </div>

            {lessonError && <p className="font-body text-xs text-danger mt-3">{lessonError}</p>}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={lessonSubmitting}
                onClick={() => setLessonModalSectionId(null)}
                className="flex-1 font-body text-sm border border-navy/20 text-navy font-medium py-2.5 rounded-md hover:bg-navy/5 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={lessonSubmitting}
                className="flex-1 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors disabled:opacity-60"
              >
                {lessonSubmitting ? 'Đang tạo…' : 'Tạo bài học'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal tạo đề thi */}
      {examModalOpen && (
        <div className="fixed inset-0 bg-navy/40 flex items-center justify-center p-6 z-50 overflow-y-auto">
          <form
            onSubmit={handleCreateExam}
            className="bg-white rounded-lg max-w-2xl w-full p-6 my-10"
          >
            <h2 className="font-display text-xl text-navy">Tạo đề thi mới</h2>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Tên đề thi</label>
                <input
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-md border border-navy/15 px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Thời gian (phút)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={examForm.durationMinutes}
                  onChange={(e) => setExamForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                  className="w-full rounded-md border border-navy/15 px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-navy mb-1.5">Điểm đạt</label>
                <input
                  required
                  type="number"
                  step="0.1"
                  value={examForm.passScore}
                  onChange={(e) => setExamForm((f) => ({ ...f, passScore: e.target.value }))}
                  className="w-full rounded-md border border-navy/15 px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
            </div>

            <div className="mt-6 space-y-5 max-h-[50vh] overflow-y-auto pr-1">
              {examQuestions.map((q, qIndex) => (
                <div key={qIndex} className="border border-navy/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-slate-soft">Câu {qIndex + 1}</span>
                    {examQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="font-body text-xs text-danger hover:underline"
                      >
                        Xóa câu
                      </button>
                    )}
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder="Nội dung câu hỏi"
                    value={q.content}
                    onChange={(e) => updateQuestion(qIndex, { content: e.target.value })}
                    className="w-full rounded-md border border-navy/15 px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber resize-none"
                  />

                  <div className="flex items-center gap-3 mt-3">
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(qIndex, { type: e.target.value })}
                      className="rounded-md border border-navy/15 px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                    >
                      <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                      <option value="ESSAY">Tự luận</option>
                    </select>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Điểm"
                      value={q.points}
                      onChange={(e) => updateQuestion(qIndex, { points: e.target.value })}
                      className="w-24 rounded-md border border-navy/15 px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                    />
                  </div>

                  {q.type === 'MULTIPLE_CHOICE' ? (
                    <div className="mt-3 space-y-2">
                      {q.answerOptions.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={opt.isCorrect}
                            onChange={() => setCorrectOption(qIndex, oIndex)}
                            className="accent-amber shrink-0"
                          />
                          <input
                            required
                            placeholder={`Đáp án ${oIndex + 1}`}
                            value={opt.content}
                            onChange={(e) => updateOption(qIndex, oIndex, { content: e.target.value })}
                            className="flex-1 rounded-md border border-navy/15 px-3 py-1.5 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                          />
                          {q.answerOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="font-body text-xs text-danger shrink-0"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="font-body text-xs text-amber-dark hover:underline"
                      >
                        + Thêm đáp án
                      </button>
                    </div>
                  ) : (
                    <textarea
                      rows={2}
                      placeholder="Tiêu chí chấm điểm (gradingRubric)"
                      value={q.gradingRubric}
                      onChange={(e) => updateQuestion(qIndex, { gradingRubric: e.target.value })}
                      className="w-full mt-3 rounded-md border border-navy/15 px-3 py-2 font-body text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber resize-none"
                    />
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="font-body text-sm text-amber-dark hover:underline"
              >
                + Thêm câu hỏi
              </button>
            </div>

            {examError && <p className="font-body text-xs text-danger mt-3">{examError}</p>}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={examSubmitting}
                onClick={() => setExamModalOpen(false)}
                className="flex-1 font-body text-sm border border-navy/20 text-navy font-medium py-2.5 rounded-md hover:bg-navy/5 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={examSubmitting}
                className="flex-1 font-body text-sm bg-navy text-ivory font-medium py-2.5 rounded-md hover:bg-navy-dark transition-colors disabled:opacity-60"
              >
                {examSubmitting ? 'Đang tạo…' : 'Tạo đề thi'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}