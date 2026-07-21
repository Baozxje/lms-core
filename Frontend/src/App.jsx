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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam" element={<ExamRoom />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/course" element={<CourseDetail />} />
        <Route path="/exam-checkin" element={<ExamCheckIn />} />
        <Route path="/exam-submitted" element={<ExamSubmitted />} />
        <Route path="/history" element={<ExamHistory />} />
        <Route path="/report" element={<AIReport />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/courses" element={<CourseManagement />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/403" element={<ErrorPage code={403} />} />
        <Route path="*" element={<ErrorPage code={404} />} />
      </Routes>
    </BrowserRouter>
  )
}