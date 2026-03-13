import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wrench, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/lib/AuthContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de la connexion')
      }

      login(data.user)
      toast.success('Réussite', {
        description: 'Bienvenue dans votre espace drone-builder.',
      })
      navigate('/dashboard')
    } catch (err: any) {
      toast.error('Erreur', {
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageWrapper className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05),transparent_70%)] pointer-events-none" />
      
      <Card className="w-full max-w-md border-border/50 bg-bg-card/80 backdrop-blur-sm shadow-2xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 group mb-4 mx-auto">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-300">
              <Wrench className="w-6 h-6 text-bg-primary" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              drone<span className="text-accent">fpv</span>builder
            </span>
          </Link>
          <CardTitle className="text-2xl font-bold">Heureux de vous revoir</CardTitle>
          <CardDescription className="text-text-muted">
            Connectez-vous pour gérer vos demandes de réparation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <Input
                  type="email"
                  placeholder="votre@email.ch"
                  className="pl-10 h-11 bg-bg-secondary/50 border-border/50 focus:border-accent/50 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-muted">Mot de passe</label>
                <Link to="/forgot-password" title="Mot de passe oublié ?" className="text-xs text-accent hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-bg-secondary/50 border-border/50 focus:border-accent/50 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-bg-primary font-bold tracking-tight shadow-lg shadow-accent/20" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Séparateur pour Google Auth (stub) */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-text-muted">
              <span className="bg-[#0a0a0a] px-2">Ou continuer avec</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-11 border-border/50 bg-bg-secondary/50 hover:bg-bg-secondary transition-all" disabled>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.36-2.08 4.44-1.12 1.04-2.88 1.92-5.76 1.92-4.72 0-8.6-3.88-8.6-8.6s3.88-8.6 8.6-8.6c2.56 0 4.4 1 5.8 2.32L21.08 3.4C18.92 1.36 15.92 0 12.48 0 5.56 0 0 5.56 0 12.48s5.56 12.48 12.48 12.48c3.76 0 6.6-1.24 8.84-3.52 2.32-2.32 3.04-5.56 3.04-8.2 0-.6-.04-1.2-.12-1.76H12.48z"
              />
            </svg>
            Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/50 py-6">
          <p className="text-sm text-text-muted">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-accent font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageWrapper>
  )
}
