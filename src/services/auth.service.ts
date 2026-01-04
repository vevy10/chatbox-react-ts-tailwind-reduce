import { type RegisterData, type LoginData, type TokenResponse, type User } from '../types/auth.type'

const API_URL = 'http://127.0.0.1:8000/auth'

export async function registerUser(data: RegisterData): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const responseData = await res.json()
  if (!res.ok) throw new Error(responseData.detail || 'Erreur lors de l’inscription')

  return responseData
}

export async function loginUser(data: LoginData): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.detail || 'Identifiants invalides');

  return responseData as TokenResponse;
}

export async function uploadProfilePhoto(userId: number, file: File): Promise<{ path: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/upload-photo/${userId}`, {
    method: 'POST',
    body: formData, 
  })

  if (!res.ok) throw new Error('Erreur lors de l’upload de la photo');

  return res.json()
}

export async function deleteProfilePhoto(userId: number): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/delete-photo/${userId}`, {
    method: 'DELETE',
  })

  if (!res.ok) throw new Error('Erreur lors de la suppression de la photo')
  return res.json()
}

export async function forgotPassword(identifier: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  return res.json()
}

export async function resetPassword(identifier: string, code: string, newPassword: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, code, new_password: newPassword }),
  })

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Erreur lors de la réinitialisation');
  return data
}

export async function getAllUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Erreur lors de la récupération des utilisateurs')
  return res.json()
}