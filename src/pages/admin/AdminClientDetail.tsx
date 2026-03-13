import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar,
  Shield,
  Package,
  Wrench,
  Cpu,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function AdminClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchClient = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/clients/${id}`, { credentials: 'include' })
      if (response.ok) {
        setClient(await response.json())
      }
    } catch (error) {
      console.error('Fetch client error:', error)
      toast.error('Erreur', { description: 'Impossible de charger le profil client' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClient()
  }, [id])

  if (isLoading) return (
    <div className="space-y-10 animate-pulse pb-20">
      <div className="h-12 w-48 bg-white/10 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 h-[400px] bg-white/5 rounded-3xl border border-white/5" />
        <div className="lg:col-span-8 h-[600px] bg-white/5 rounded-3xl border border-white/5" />
      </div>
    </div>
  )

  if (!client) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <h3 className="text-xl font-black uppercase italic">Client introuvable</h3>
      <Button variant="ghost" onClick={() => navigate('/admin/clients')}>Retour à la liste</Button>
    </div>
  )

  return (
    <PageWrapper className="space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/clients')} className="rounded-full bg-white/5 hover:bg-white/10 shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic uppercase leading-none tracking-tight">Profil <span className="text-accent underline decoration-4 underline-offset-8">Pilote</span></h1>
          <p className="text-text-muted font-medium font-mono text-[10px] uppercase tracking-widest">#{client.id.substring(0,8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-white/5 bg-bg-card/30 overflow-hidden relative">
            <CardHeader className="text-center pb-8 border-b border-white/5 pt-12">
               <div className="w-24 h-24 rounded-3xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {client.avatar ? <img src={client.avatar} className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-accent" />}
               </div>
               <CardTitle className="text-2xl font-black italic uppercase italic tracking-tight">{client.firstName} {client.lastName}</CardTitle>
               <Badge className="bg-accent text-bg-primary mt-2 uppercase text-[10px] font-black">{client.role}</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Email</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    {client.email}
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Membre depuis</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Type de compte</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-success" />
                    Standard Pilot
                  </p>
               </div>
               <Separator className="bg-white/5 my-4" />
               <Button className="w-full rounded-xl bg-white/5 hover:bg-white/10 border-white/5 text-[10px] font-black uppercase tracking-widest" onClick={() => window.location.href = `mailto:${client.email}`}>
                  Envoyer un email
               </Button>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-bg-card/40 overflow-hidden border-t-2 border-t-success/50">
             <CardHeader>
                <CardTitle className="text-md font-black uppercase italic tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  Statistiques Pilote
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Interventions</span>
                   <span className="font-black italic text-lg">{client.requests?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Dépensé</span>
                   <span className="font-mono font-black italic text-success text-lg">--- CHF</span>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Requests History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                <Package className="w-6 h-6 text-accent" />
                Historique des Interventions
             </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {client.requests && client.requests.length > 0 ? (
              client.requests.map((req: any) => (
                <Link key={req.id} to={`/admin/requests/${req.id}`} className="block group">
                  <Card className="border-white/5 bg-bg-card/30 hover:bg-bg-card/60 transition-all duration-300 overflow-hidden relative group-hover:border-accent/40 group-hover:scale-[1.01]">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-accent/30 group-hover:text-accent transition-all duration-500 shadow-inner">
                          {req.serviceType === 'REPAIR' ? <Wrench className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[8px] font-mono font-black text-accent uppercase tracking-widest">
                            {req.ticketNumber}
                            <Badge variant={req.status.toLowerCase() as any} className="uppercase text-[7px] font-black h-4 px-2 tracking-tighter">
                              {req.status}
                            </Badge>
                          </div>
                          <h4 className="font-black text-lg text-text-primary group-hover:text-accent transition-colors italic uppercase leading-none">{req.issueType}</h4>
                          <p className="text-[10px] text-text-muted font-bold opacity-60 italic">{new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-accent group-hover:text-bg-primary transition-all duration-300">
                        <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="py-20 text-center space-y-4 bg-white/5 rounded-2xl border border-dashed border-white/10 opacity-50">
                <Package className="w-12 h-12 mx-auto text-text-muted opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest italic">Aucune intervention enregistrée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
