import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Wrench, 
  Cpu, 
  User, 
  Calendar,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageWrapper } from '@/components/layout/PageWrapper'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/requests`)
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
    req.issueType.toLowerCase().includes(search.toLowerCase()) ||
    `${req.user?.firstName} ${req.user?.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic tracking-tight uppercase"><span className="text-accent underline decoration-4 underline-offset-8">Gérer</span> les interventions</h1>
          <p className="text-text-muted font-medium">Contrôle centralisé de tous les tickets clients ({requests.length})</p>
        </div>
        <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-xl border-white/10 hidden md:flex">Exporter CSV</Button>
             <Badge className="bg-success text-bg-primary h-8 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg border-none">Live DB Connected</Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center bg-bg-card/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl sticky top-24 z-20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
          <Input 
            placeholder="Rechercher par ticket, client ou machine..." 
            className="pl-12 h-11 bg-transparent border-none focus-visible:ring-0 text-md font-medium placeholder:italic"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full lg:w-auto flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-4 overflow-x-auto no-scrollbar">
          <Badge variant="outline" className="h-8 px-4 cursor-pointer hover:bg-white/5 transition-colors border-white/10 font-black tracking-tighter text-[10px]">TOUS</Badge>
          <Badge variant="outline" className="h-8 px-4 border-accent text-accent cursor-pointer hover:bg-accent/5 transition-colors font-black tracking-tighter text-[10px]">EN COURS</Badge>
          <Badge variant="outline" className="h-8 px-4 cursor-pointer hover:bg-white/5 transition-colors border-white/10 font-black tracking-tighter text-[10px]">RECU</Badge>
          <Badge variant="outline" className="h-8 px-4 cursor-pointer hover:bg-white/5 transition-colors border-white/10 font-black tracking-tighter text-[10px]">TERMINE</Badge>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 h-11 w-11 rounded-xl bg-white/5 hover:bg-accent/10 hover:text-accent transition-colors hidden lg:flex">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Datatable / Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
          ))
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <Link key={req.id} to={`/admin/requests/${req.id}`} className="block group">
              <Card className="border-white/5 bg-bg-card/30 hover:bg-bg-card/60 transition-all duration-300 overflow-hidden relative group-hover:border-accent/40 group-hover:scale-[1.005] group-hover:shadow-2xl group-hover:shadow-accent/5">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    {/* Urgency/Status indicator */}
                    <div className={cn(
                      "w-full md:w-1.5 h-1.5 md:h-auto self-stretch shrink-0",
                      req.status === 'EN_REPARATION' ? "bg-accent shadow-[0_0_15px_rgba(249,115,22,0.5)]" : "bg-white/10"
                    )} />
                    
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-accent/30 group-hover:text-accent transition-all duration-500 shadow-inner">
                          {req.serviceType === 'REPAIR' ? <Wrench className="w-7 h-7" /> : <Cpu className="w-7 h-7" />}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.2em]">{req.ticketNumber}</span>
                            <Badge variant={req.status.toLowerCase() as any} className="uppercase text-[9px] font-black h-5 border-none tracking-tighter shadow-sm">
                              {req.status}
                            </Badge>
                          </div>
                          <h3 className="font-black text-xl text-text-primary group-hover:text-accent transition-colors italic uppercase leading-none">{req.issueType}</h3>
                          <div className="flex items-center gap-5 text-[11px] text-text-muted font-bold">
                            <span className="flex items-center gap-2 group-hover:text-text-primary transition-colors">
                              <User className="w-3.5 h-3.5" />
                              {req.user?.firstName} {req.user?.lastName}
                            </span>
                            <span className="flex items-center gap-2 opacity-60">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        <div className="text-right hidden xl:block">
                           <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] font-black mb-1">Total Logs</p>
                           <p className="text-sm font-black italic">{(req.workSessions?.length || 0) * 0.5} h</p>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] font-black mb-1">Estimation</p>
                          <p className="text-lg font-black text-success font-mono">
                             {(req.expenses?.reduce((a: any, b: any) => a + Number(b.amount), 0) + (req.workSessions?.reduce((a: any, b: any) => a + Number(b.durationHalfHours), 0) || 0) * 25).toFixed(2)} CHF
                          </p>
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
              <h3 className="text-2xl font-black italic uppercase">Système Vide</h3>
              <p className="text-text-muted mt-2 font-medium">Aucun ticket ne correspond à vos paramètres de recherche.</p>
            </div>
            <Button variant="outline" className="rounded-xl px-8 border-accent/20 text-accent" onClick={() => setSearch('')}>Réinitialiser filtres</Button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
