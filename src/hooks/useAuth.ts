import { useState } from 'react'
import { registerUser, loginUser, uploadProfilePhoto } from '../services/auth.service'
import { type RegisterData, type LoginData, type TokenResponse } from '../types/auth.type'

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false) // Pour savoir si l'inscription a réussi

  const register = async (data: RegisterData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await registerUser(data)
      setSuccess(true)
      // Note: Le backend renvoie {"message": "..."}, on n'enregistre pas de token ici
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l’inscription')
    } finally {
      setLoading(false)
    }
  }

  const login = async (data: LoginData) => {
    setLoading(true)
    setError(null)
    try {
      const res: TokenResponse = await loginUser(data)
      setToken(res.access_token)
      // Persistance locale simple
      localStorage.setItem('token', res.access_token)
      localStorage.setItem('refresh_token', res.refresh_token)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
  }

  // Optionnel: Ajouter une fonction pour la photo directement dans le hook
  const updatePhoto = async (userId: number, file: File) => {
    setLoading(true)
    try {
      await uploadProfilePhoto(userId, file)
    } catch (err: unknown) {
      setError('Erreur lors de l’upload de la photo')
    } finally {
      setLoading(false)
    }
  }

  return { token, loading, error, success, register, login, logout, updatePhoto }
}