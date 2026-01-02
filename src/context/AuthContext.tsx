import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/auth.service'
import { type LoginData, type RegisterData, type AuthState } from '../types/auth.type'

type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: string }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'REGISTER_SUCCESS' } // Nouvelle action
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
        token: action.payload, 
        user: null, // On l'initialise à null ou on le chargera plus tard via une autre action
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
        user: null, // On vide l'utilisateur à la déconnexion
        loading: false, 
        error: null 
      };
    default: 
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    token: localStorage.getItem('access_token'), 
    user: null,    // <-- AJOUTÉ ICI
    loading: false, 
    error: null 
  })
  
  // ... reste du code (login, register, logout)
  const navigate = useNavigate()

  // --- LOGIN ---
  const login = async (data: LoginData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const res = await loginUser(data)
      
      // Stockage local pour persistance
      localStorage.setItem('access_token', res.access_token)
      localStorage.setItem('refresh_token', res.refresh_token)
      
      dispatch({ type: 'AUTH_SUCCESS', payload: res.access_token })
      navigate('/dashboard')
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message })
    }
  }

  // --- REGISTER ---
  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      await registerUser(data)
      dispatch({ type: 'REGISTER_SUCCESS' })
      // On redirige vers login car l'user doit se connecter (ou confirmer email)
      navigate('/login', { state: { message: "Inscription réussie ! Connectez-vous." } })
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message })
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)