import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RequireInstructor({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null // chờ AuthContext load xong token
  if (user?.role !== 'INSTRUCTOR') return <Navigate to="/403" replace />

  return children
}