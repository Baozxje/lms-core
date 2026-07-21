import { apiFetch } from './client.js'

export async function login(email, password) {
  const idToken = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  })
  return idToken
}

export async function register(email, password, fullName) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
    skipAuth: true,
  })
}

export async function confirmSignUp(email, confirmationCode) {
  return apiFetch('/api/auth/confirm', {
    method: 'POST',
    body: JSON.stringify({ email, confirmationCode }),
    skipAuth: true,
  })
}