import { apiFetch } from './client.js'

export async function getAllUsers() {
  return apiFetch('/api/v1/users')
}

export async function updateUserRole(userId, role) {
  return apiFetch(`/api/v1/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}