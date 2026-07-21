import { createContext, useContext, useEffect, useState } from 'react'
import { decodeJwt } from '../api/jwt.js'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('idToken')
    if (token) {
      const claims = decodeJwt(token)
      if (claims) setUser(claimsToUser(claims))
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const idToken = await authApi.login(email, password)
    localStorage.setItem('idToken', idToken)
    const claims = decodeJwt(idToken)
    const nextUser = claimsToUser(claims)
    setUser(nextUser)
    return nextUser
  }

  function logout() {
    localStorage.removeItem('idToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function claimsToUser(claims) {
  if (!claims) return null
  const groups = claims['cognito:groups'] || []
  return {
    sub: claims.sub,
    name: claims.name || claims.email || 'Người dùng',
    email: claims.email,
    role: groups.includes('INSTRUCTOR') ? 'INSTRUCTOR' : 'STUDENT',
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được gọi bên trong <AuthProvider>')
  return ctx
}