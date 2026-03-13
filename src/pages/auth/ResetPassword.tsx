import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Token manquant', {
        description: 'Le lien de réinitialisation est invalide.'
      })
      navigate('/login')
    }
  }, [token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Erreur', {
        description: 'Les mots de passe ne correspondent pas.'
      })
      return
    }

    if (password.length < 6) {
      toast.error('Erreur', {
        description: 'Le mot de passe doit faire au moins 6 caractères.'
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setIsSuccess(true)
      toast.success('Succès', {
        description: 'Votre mot de passe a été réinitialisé.'
      })
      
      setTimeout(() => navigate('/login'), 3000)
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageWrapper className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full border-border/50 bg-bg-card/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <CardHeader className="space-y-4 pt-10">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 -rotate-3">
              <Lock className="w-8 h-8 text-accent rotate-3" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">
              Nouveau mot de passe
            </CardTitle>
            <CardDescription className="text-text-muted font-medium">
              Choisissez un mot de passe robuste pour votre compte.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted transition-colors group-focus-within:text-accent" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 bg-white/5 border-white/10 rounded-xl font-bold italic transition-all focus:bg-white/10 focus:border-accent/50 focus:ring-accent/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted transition-colors group-focus-within:text-accent" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl font-bold italic transition-all focus:bg-white/10 focus:border-accent/50 focus:ring-accent/20"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl shadow-lg shadow-accent/20 font-black uppercase italic tracking-widest text-base group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Enregistrer</>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center border-4 border-success/20 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <p className="text-sm text-center text-text-muted font-medium px-4 leading-relaxed">
                Mot de passe mis à jour avec succès !<br />
                Redirection vers la connexion...
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pb-10 pt-4 text-center">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight">
            Besoin d'aide ? <Link to="/contact" className="text-accent hover:underline">Contactez le support</Link>
          </p>
        </CardFooter>
      </Card>
    </PageWrapper>
  )
}
