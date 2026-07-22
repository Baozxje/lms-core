import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ExamRoom from './pages/ExamRoom.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import ExamCheckIn from './pages/ExamCheckIn.jsx'
import ExamSubmitted from './pages/ExamSubmitted.jsx'
import ExamHistory from './pages/ExamHistory.jsx'
import AIReport from './pages/AIReport.jsx'
import Profile from './pages/Profile.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import CourseManagement from './pages/CourseManagement.jsx'
import StudentManagement from './pages/StudentManagement.jsx'
import Settings from './pages/Settings.jsx'
import Register from './pages/Register.jsx'
import ConfirmSignup from './pages/ConfirmSignup.jsx'
import RequireInstructor from './components/RequireInstructor.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm" element={<ConfirmSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam/:examId" element={<ExamRoom />} />
        <Route path="/admin" element={<RequireInstructor><AdminDashboard /></RequireInstructor>} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/exam-checkin/:examId" element={<ExamCheckIn />} />
        <Route path="/exam-submitted" element={<ExamSubmitted />} />
        <Route path="/history" element={<ExamHistory />} />
        <Route path="/report/:attemptId" element={<AIReport />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/courses" element={<RequireInstructor><CourseManagement /></RequireInstructor>} />
        <Route path="/admin/students" element={<RequireInstructor><StudentManagement /></RequireInstructor>} />
        <Route path="/admin/settings" element={<RequireInstructor><Settings /></RequireInstructor>} />
        <Route path="/403" element={<ErrorPage code={403} />} />
        <Route path="*" element={<ErrorPage code={404} />} />
      </Routes>
    </BrowserRouter>
  )
}