import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Wrench, 
  Cpu, 
  Send, 
  ArrowLeft, 
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const SERVICE_TYPES = [
  { 
    id: 'REPAIR', 
    title: 'Réparation', 
    description: 'Votre drone est cassé ou ne fonctionne plus correctement.',
    icon: Wrench,
    color: 'text-accent',
    bg: 'bg-accent/5'
  },
  { 
    id: 'BUILD', 
    title: 'Montage', 
    description: 'Vous avez des pièces et voulez un montage professionnel.',
    icon: Cpu,
    color: 'text-blue-500',
    bg: 'bg-blue-500/5'
  }
]

export default function NewRequest() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    serviceType: '',
    issueType: '',
    issueDescription: '',
    additionalDescription: '',
  })

  const handleServiceSelect = (id: string) => {
    setFormData({ ...formData, serviceType: id })
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Erreur lors de la création de la demande')

      const data = await response.json()
      toast.success('Demande enregistrée', {
        description: 'Votre ticket de réparation a été créé avec succès.',
      })
      navigate(`/dashboard/requests/${data.id}`)
    } catch (error) {
      toast.error('Erreur', {
        description: "Une erreur est survenue lors de la création.",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageWrapper className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}
          className="rounded-full bg-white/5 hover:bg-white/10 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Nouvelle demande</h1>
          <div className="flex items-center gap-3">
             <p className="text-[10px] font-black uppercase text-accent tracking-widest leading-none">Transmission de données sécurisée</p>
             <div className="h-px w-8 bg-accent/30" />
             <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none">Étape {step} sur 2</p>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_TYPES.map((type) => (
            <Card 
              key={type.id}
              className={cn(
                "cursor-pointer transition-all duration-500 border-border/50 bg-bg-card/40 backdrop-blur-md hover:border-accent hover:shadow-2xl hover:shadow-accent/10 group relative overflow-hidden",
                formData.serviceType === type.id && "border-accent bg-accent/5 ring-1 ring-accent/30"
              )}
              onClick={() => handleServiceSelect(type.id)}
            >
              <CardContent className="p-8 text-center space-y-6 relative z-10">
                <div className={cn("w-20 h-20 rounded-3xl mx-auto flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-2xl", type.bg, type.color)}>
                  <type.icon className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic uppercase tracking-tight transition-colors group-hover:text-accent">{type.title}</h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed font-medium">
                    {type.description}
                  </p>
                </div>
              </CardContent>
              {formData.serviceType === type.id && (
                  <div className="absolute top-4 right-4 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <Card className="border-border/50 bg-bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden border-t-2 border-t-accent">
          <form onSubmit={handleSubmit}>
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black italic uppercase tracking-tight">Détails de l'intervention</CardTitle>
              <CardDescription className="font-medium text-text-muted">
                Expliquez-nous précisément ce qu'il se passe avec votre machine.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-accent tracking-widest">Type de drone / Composant concerné</label>
                <Input 
                  placeholder="Ex: Nazgul5 V3, ESC 4in1, Smoke stopper..."
                  className="h-12 bg-white/5 border-white/10 focus:border-accent/40 rounded-xl font-bold italic"
                  value={formData.issueType}
                  onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-accent tracking-widest">Description du problème</label>
                <Textarea 
                  placeholder="Décrivez précisément les symptômes ou vos attentes..."
                  className="min-h-[160px] bg-white/5 border-white/10 focus:border-accent/40 rounded-2xl p-6 font-medium leading-relaxed italic"
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Informations complémentaires (Optionnel)</label>
                <Textarea 
                  placeholder="Contexte du crash, liste des pièces fournies..."
                  className="min-h-[100px] bg-white/5 border-white/10 focus:border-accent/40 rounded-2xl p-6 font-medium italic opacity-70"
                  value={formData.additionalDescription}
                  onChange={(e) => setFormData({...formData, additionalDescription: e.target.value})}
                />
              </div>

              <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10 flex gap-4 backdrop-blur-sm">
                <div className="p-2.5 bg-accent/10 rounded-xl shrink-0 self-start">
                  <Info className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-accent tracking-widest leading-none">Transmission Multi-média</p>
                    <p className="text-xs text-text-primary/70 leading-relaxed font-medium">
                        Vous pourrez ajouter des photos de votre drone une fois la demande créée, directement dans l'interface de tchat.
                    </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 bg-white/5 border-t border-white/5">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl shadow-xl shadow-accent/20 font-black italic uppercase tracking-widest text-lg transition-transform hover:scale-[1.01]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Initialisation..." : "Transmettre la demande"}
                <Send className="w-5 h-5 ml-3" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-white/5 bg-bg-card/40 flex items-center gap-5 group backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shrink-0 border border-success/20 group-hover:scale-110 transition-transform duration-500">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-success tracking-widest">Tarification Fixe</h4>
            <p className="text-sm font-black italic uppercase tracking-tight">50 CHF / Heure</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Facturation min. 30min</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-bg-card/40 flex items-center gap-5 group backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20 group-hover:scale-110 transition-transform duration-500">
            <AlertTriangle className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-accent tracking-widest">Matériel & Logistique</h4>
            <p className="text-sm font-black italic uppercase tracking-tight">Pièces sur mesure</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Incluses sur Devis Final</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
