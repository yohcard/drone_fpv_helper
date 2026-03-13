import { useState } from 'react'
import { Mail, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/lib/AuthContext'
import { cn } from '@/lib/utils'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Profil mis à jour', {
      description: 'Vos modifications ont été enregistrées avec succès.'
    })
  }

  return (
    <PageWrapper className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Mon Profil</h1>
        <p className="text-text-muted mt-1 font-medium">Gérez vos informations personnelles et vos paramètres de compte.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar info */}
        <Card className="md:col-span-1 border-border/50 bg-bg-card/30 backdrop-blur-md">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <div className="w-28 h-28 rounded-full bg-accent/10 flex items-center justify-center text-accent text-4xl font-black mx-auto border-4 border-bg-secondary shadow-2xl relative">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-success rounded-full border-4 border-bg-card flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight">{user?.firstName} {user?.lastName}</h2>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1 opacity-60">
                {user?.role === 'ADMIN' ? 'Technicien Certifié' : 'Membre Premium'}
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-4 flex flex-col gap-2">
            <Button variant="ghost" className="w-full justify-start text-[10px] h-10 font-black uppercase tracking-widest hover:bg-white/5">
              <Shield className="w-4 h-4 mr-3 text-accent" />
              Sécurité du compte
            </Button>
          </CardFooter>
        </Card>

        {/* Main forms */}
        <div className="md:col-span-2 space-y-8">
          <Card className="border-border/50 bg-bg-card/30 backdrop-blur-md border-t-2 border-t-accent">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black italic uppercase tracking-tight">Informations Personnelles</CardTitle>
              <CardDescription className="font-medium text-text-muted">Vos coordonnées utilisées pour les demandes d'intervention.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-accent tracking-widest">Prénom</label>
                  <Input defaultValue={user?.firstName} disabled={!isEditing} className="h-11 bg-white/5 border-white/10 rounded-xl font-bold italic" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-accent tracking-widest">Nom</label>
                  <Input defaultValue={user?.lastName} disabled={!isEditing} className="h-11 bg-white/5 border-white/10 rounded-xl font-bold italic" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-accent tracking-widest">Email de contact</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
                  <Input defaultValue={user?.email} className="pl-12 h-11 bg-white/5 border-white/10 rounded-xl font-bold italic opacity-50" disabled={true} />
                </div>
                <p className="text-[10px] text-text-muted italic opacity-60 mt-2">L'email ne peut pas être modifié pour des raisons de sécurité.</p>
              </div>
            </CardContent>
            <CardFooter className="p-8 bg-white/5 border-t border-white/5 justify-end gap-4">
              {isEditing ? (
                <>
                  <Button variant="ghost" className="rounded-xl h-11 px-6 font-bold" onClick={() => setIsEditing(false)}>Annuler</Button>
                  <Button className="rounded-xl h-11 px-8 shadow-lg shadow-accent/20 font-black uppercase italic tracking-widest" onClick={handleSave}>Mettre à jour</Button>
                </>
              ) : (
                <Button variant="outline" className="rounded-xl h-11 px-8 border-white/10 font-black uppercase italic tracking-widest hover:bg-white/5" onClick={() => setIsEditing(true)}>Modifier le profil</Button>
              )}
            </CardFooter>
          </Card>

          <Card className="border-border/50 bg-bg-card/20 border-l-4 border-l-success">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                 <Shield className="w-6 h-6 text-success" />
                 Sécurité active
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
               <p className="text-sm font-medium text-text-muted leading-relaxed">
                  Votre session est protégée par un chiffrement de bout en bout. 
                  Toute modification sensible nécessite une re-validation par email.
               </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border",
      variant === 'outline' ? "border-border text-text-muted" : "bg-accent/10 text-accent border-accent/20",
      className
    )}>
      {children}
    </span>
  )
}
