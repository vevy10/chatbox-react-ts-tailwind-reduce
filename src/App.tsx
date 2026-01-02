import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LoginPage } from './pages/Login'
import { SignupPage } from './pages/Signup'
import { DashboardPage } from './pages/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/layouts/AppLayout'
import { ForgotPasswordPage } from './pages/ForgotPassword'
import DynamicTitle from './components/DynamicTitle'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DynamicTitle />
        <AppLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />   
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />        
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App