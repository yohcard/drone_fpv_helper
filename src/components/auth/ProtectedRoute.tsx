import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'CLIENT' | 'ADMIN'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="text-sm text-text-muted font-heading uppercase tracking-widest">
          Initialisation...
        </p>
      </div>
    )
  }

  if (!user) {
    // Rediriger vers login s'il n'est pas connecté
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
    // Rediriger vers l'accueil ou une page 403 s'il n'a pas le rôle requis
    // (L'admin a accès à tout par défaut ici)
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
