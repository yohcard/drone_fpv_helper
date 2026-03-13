import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/lib/AuthContext'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardRoutes from '@/pages/dashboard'
import AdminRoutes from '@/pages/admin'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './App.css'

/** Application principale avec routing */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Toaster 
            theme="dark"
            position="bottom-right" 
            toastOptions={{
              style: { 
                background: '#0a0a0a', 
                border: '1px solid #262626', 
                color: '#f5f5f5' 
              }
            }}
          />
          <Header />
          <main className="flex-1 pt-16">
            <Routes>
              {/* Pages publiques */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Dashboard client (Phase 5) */}
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <DashboardRoutes />
                  </ProtectedRoute>
                } 
              />

              {/* Admin (Phase 6) */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminRoutes />
                  </ProtectedRoute>
                } 
              />

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <SpeedInsights />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
