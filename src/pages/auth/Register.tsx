import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wrench, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/lib/AuthContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Erreur de validation', {
          description: 'Les mots de passe ne correspondent pas',
        })
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de l\'inscription')
      }

      login(data.user)
      toast.success('Compte créé', {
        description: 'Bienvenue chez drone-builder.ch !',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription className="text-text-muted">
            Rejoignez la communauté dronefpvbuilder.shop
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                  <Input
                    name="firstName"
                    placeholder="Jean"
                    className="pl-10 h-11 bg-bg-secondary/50 border-border/50 focus:border-accent/50"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                  <Input
                    name="lastName"
                    placeholder="Dupont"
                    className="pl-10 h-11 bg-bg-secondary/50 border-border/50 focus:border-accent/50"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <Input
                  name="email"
                  type="email"
                  placeholder="votre@email.ch"
                  className="pl-10 h-11 bg-bg-secondary/50 border-border/50 focus:border-accent/50"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-bg-secondary/50 border-border/50 focus:border-accent/50"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-bg-secondary/50 border-border/50 focus:border-accent/50"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-bg-primary font-bold tracking-tight shadow-lg shadow-accent/20" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  S'inscrire
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/50 py-6">
          <p className="text-sm text-text-muted">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageWrapper>
  )
}
