import { apiFetch } from './client.js'

export async function getMyAttempts() {
  return apiFetch('/api/v1/attempts/me')
}