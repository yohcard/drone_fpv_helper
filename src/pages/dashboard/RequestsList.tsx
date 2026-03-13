import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Wrench, 
  Cpu, 
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageWrapper } from '@/components/layout/PageWrapper'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function RequestsList() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

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
        console.error('Fetch requests error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(req => 
    req.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
    req.issueType.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic tracking-tight uppercase"><span className="text-accent underline decoration-4 underline-offset-8">Gérer</span> mes demandes</h1>
          <p className="text-text-muted font-medium">Suivez l'état de vos réparations en temps réel ({requests.length})</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-accent/20 font-black uppercase italic tracking-widest h-12 px-8" asChild>
          <Link to="/dashboard/new-request">Nouvelle demande</Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center bg-bg-card/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl sticky top-24 z-20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
          <Input 
            placeholder="Rechercher par ticket ou machine..." 
            className="pl-12 h-11 bg-transparent border-none focus-visible:ring-0 text-md font-medium placeholder:italic"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 h-11 w-11 rounded-xl bg-white/5 hover:bg-accent/10 hover:text-accent transition-colors hidden lg:flex">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
          ))
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <Link key={req.id} to={`/dashboard/requests/${req.id}`} className="block group">
              <Card className="border-white/5 bg-bg-card/30 hover:bg-bg-card/60 transition-all duration-300 overflow-hidden relative group-hover:border-accent/40 group-hover:scale-[1.005] group-hover:shadow-2xl group-hover:shadow-accent/5">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-accent/30 group-hover:text-accent transition-all duration-500 shadow-inner">
                          {req.serviceType === 'REPAIR' ? <Wrench className="w-8 h-8" /> : <Cpu className="w-8 h-8" />}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.2em]">{req.ticketNumber}</span>
                            <Badge variant={req.status.toLowerCase() as any} className="uppercase text-[9px] font-black h-5 border-none tracking-tighter shadow-sm">
                              {req.status}
                            </Badge>
                          </div>
                          <h3 className="font-black text-xl text-text-primary group-hover:text-accent transition-colors italic uppercase leading-none">{req.issueType}</h3>
                          <div className="flex items-center gap-4 text-[11px] text-text-muted font-bold">
                            <span className="uppercase tracking-widest opacity-60">Créé le {new Date(req.createdAt).toLocaleDateString()}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                            <span className="uppercase tracking-widest">{req.serviceType === 'REPAIR' ? 'Réparation' : 'Montage'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        <div className="text-right">
                          <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] font-black mb-1">Dernière MAJ</p>
                          <p className="text-sm font-black italic">{new Date(req.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-accent group-hover:text-bg-primary transition-all duration-300">
                           <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="py-24 text-center space-y-6 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-24 h-24 bg-accent/5 rounded-full flex items-center justify-center mx-auto border border-accent/10">
              <AlertCircle className="w-12 h-12 text-accent/40" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase">Aucune demande trouvée</h3>
              <p className="text-text-muted mt-2 font-medium">Commencez par créer votre première demande de réparation.</p>
            </div>
            <Button asChild variant="outline" className="rounded-xl border-border/50 h-12 px-8 font-black uppercase tracking-widest hover:bg-accent hover:text-bg-primary transition-all">
              <Link to="/dashboard/new-request">Nouvelle demande</Link>
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
