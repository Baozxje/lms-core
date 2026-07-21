const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function getToken() {
  return localStorage.getItem('idToken')
}

export async function apiFetch(path, options = {}) {
  const token = options.skipAuth ? null : getToken()

  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    let message = `Lỗi ${res.status}`
    try {
      const body = await res.json()
      message = typeof body.message === 'string' ? body.message : JSON.stringify(body.message) || message
    } catch {
      // response không phải JSON
    }
    throw new ApiError(message, res.status)
  }

  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}