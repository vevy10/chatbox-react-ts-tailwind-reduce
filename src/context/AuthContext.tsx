import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser, uploadProfilePhoto, deleteProfilePhoto } from '../services/auth.service'
import { type LoginData, type RegisterData, type AuthState, type User } from '../types/auth.type'

type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'LOGOUT' }

const AuthContext = createContext<any>(null)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START': 
      return { 
        ...state, 
        loading: true, 
        error: null 
      };
    case 'AUTH_SUCCESS': 
      return { 
        token: action.payload.token, 
        user: action.payload.user,
        loading: false, 
        error: null 
      };
    case 'REGISTER_SUCCESS': 
      return { 
        ...state, 
        loading: false, 
        error: null 
      };
    case 'AUTH_ERROR': 
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    case 'LOGOUT': 
      return { 
        token: null, 
        user: null,
        loading: false, 
        error: null 
      };
    default: 
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const savedUser = localStorage.getItem('user_data')
  const [state, dispatch] = useReducer(authReducer, { 
    token: localStorage.getItem('access_token'), 
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false, 
    error: null 
  })
  
  const navigate = useNavigate()

  const login = async (data: LoginData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const res = await loginUser(data)
      console.log("Réponse API Login:", res)
      
      localStorage.setItem('access_token', res.access_token)
      localStorage.setItem('refresh_token', res.refresh_token)
      localStorage.setItem('user_data', JSON.stringify(res.user))
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          token: res.access_token, 
          user: res.user
        }
      })
      navigate('/chat')
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message })
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      await registerUser(data)
      dispatch({ type: 'REGISTER_SUCCESS' })
      navigate('/login', { state: { message: "Inscription réussie ! Connectez-vous." } })
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message })
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  const updatePhoto = async (userId: string, file: File) => {
    try {
      const res = await uploadProfilePhoto(Number(userId), file)
      
      const updatedUser = { ...state.user, profile_photo: res.path }
      
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { token: state.token!, user: updatedUser } 
      });
    } catch (err: any) {
      console.error(err.message)
    }
  }

  const removePhoto = async (userId: string) => {
    try {
      await deleteProfilePhoto(Number(userId))
      
      if (state.user) {
        const updatedUser = { ...state.user, profile_photo: null }
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { token: state.token!, user: updatedUser } 
        })
      }
    } catch (err: any) {
      console.error(err.message)
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updatePhoto, removePhoto }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)