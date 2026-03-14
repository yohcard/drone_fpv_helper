import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, ArrowRight, ClipboardList, Clock, CheckCircle2, MessageSquare, Wrench, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/AuthContext'
import { cn } from '@/lib/utils'
import { PageWrapper } from '@/components/layout/PageWrapper'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function DashboardHome() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${API_URL}/requests/my`, {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setRequests(data)
        }
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const stats = [
    { 
      label: 'En cours', 
      value: requests.filter(r => ['RECU', 'DIAGNOSTIC', 'EN_REPARATION', 'WAITING_PARTS'].includes(r.status)).length.toString(), 
      icon: Clock, 
      color: 'text-accent' 
    },
    { 
      label: 'Terminées', 
      value: requests.filter(r => r.status === 'TERMINE').length.toString(), 
      icon: CheckCircle2, 
      color: 'text-success' 
    },
    { label: 'Messages', value: '0', icon: MessageSquare, color: 'text-blue-500' },
  ]

  const recentRequests = requests.slice(0, 5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <PageWrapper className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            Bonjour, <span className="text-accent underline decoration-4 underline-offset-8 decoration-accent/30">{user?.firstName}</span> 👋
          </h1>
          <p className="text-text-muted font-medium">Monitoring de votre flotte et de vos interventions en cours.</p>
        </div>
        <Button size="lg" className="h-14 px-8 rounded-2xl shadow-2xl shadow-accent/20 font-black uppercase italic tracking-widest transition-transform hover:scale-[1.02]" asChild>
          <Link to="/dashboard/new-request">
            <PlusCircle className="w-5 h-5 mr-3" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-bg-card/50 overflow-hidden group hover:border-accent/30 transition-all duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={cn("p-4 rounded-2xl bg-bg-secondary group-hover:bg-accent/10 transition-colors duration-300", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-accent" />
              Demandes récentes
            </h2>
            <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10" asChild>
              <Link to="/dashboard/requests">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : recentRequests.length === 0 ? (
              <Card className="border-border/40 bg-bg-card/40 p-12 text-center">
                <p className="text-text-muted">Vous n'avez pas encore de demandes.</p>
              </Card>
            ) : (
              recentRequests.map((req) => (
                <Link key={req.id} to={`/dashboard/requests/${req.id}`} className="block group">
                  <Card className="border-border/40 bg-bg-card/40 hover:bg-bg-card/60 transition-all cursor-pointer group hover:border-accent/30 hover:scale-[1.01]">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                          <Wrench className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-accent">{req.ticketNumber}</span>
                            <Badge variant={req.status.toLowerCase() as any}>
                              {req.status}
                            </Badge>
                          </div>
                          <h3 className="font-medium mt-1">{req.issueType}</h3>
                          <p className="text-xs text-text-muted">Créée le {formatDate(req.createdAt)} • {req.serviceType === 'REPAIR' ? 'Réparation' : 'Montage'}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                        <span>Gérer</span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Tips / Help */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-accent" />
            Besoin d'aide ?
          </h2>
          <Card className="border-border/50 bg-gradient-to-br from-bg-card to-accent/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wrench className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Processus de réparation</CardTitle>
              <CardDescription>Simple et efficace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <ol className="space-y-3">
                <li className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-accent text-bg-primary flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  Soumettez votre demande avec photos.
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-accent text-bg-primary flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  Recevez un devis et envoyez votre drone.
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-accent text-bg-primary flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  Suivez la progression en temps réel.
                </li>
              </ol>
              <Button className="w-full h-10" asChild>
                <a href="/#process">En savoir plus</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}

