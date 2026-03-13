import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  User, 
  Mail, 
  Shield,
  MoreVertical,
  ExternalLink,
  Package,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/clients`, {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setClients(data)
        }
      } catch (error) {
        console.error('Fetch clients error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase()
    return fullName.includes(search.toLowerCase()) || 
           client.email.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <PageWrapper className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic tracking-tight uppercase">Base de données <span className="text-accent underline decoration-4 underline-offset-8">Clients</span></h1>
          <p className="text-text-muted font-medium">Gestion et suivi de la communauté FPV ({clients.length} pilotes)</p>
        </div>
        <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-xl border-white/10 hidden md:flex">Exporter CSV</Button>
             <Badge className="bg-success text-bg-primary h-8 px-4 font-black uppercase tracking-widest text-[10px] rounded-lg border-none">CRM Active</Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center bg-bg-card/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl sticky top-24 z-20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
          <Input 
            placeholder="Rechercher par nom, email..." 
            className="pl-12 h-11 bg-transparent border-none focus-visible:ring-0 text-md font-medium placeholder:italic text-text-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 w-full bg-white/5 animate-pulse rounded-3xl border border-white/5" />
          ))
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client.id} className="border-white/5 bg-bg-card/30 hover:bg-bg-card/60 transition-all duration-300 overflow-hidden relative group hover:border-accent/40 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/5 rounded-3xl">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent/30 group-hover:text-accent transition-all duration-500 overflow-hidden shadow-inner">
                      {client.avatar ? (
                        <img src={client.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-text-primary group-hover:text-accent transition-colors italic uppercase leading-none">{client.firstName} {client.lastName}</h3>
                      <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest mt-1 opacity-60">Depuis {new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white/5">
                        <MoreVertical className="w-4 h-4 text-text-muted" />
                      </Button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-bg-card border-white/10 rounded-xl">
                        <DropdownMenuItem 
                            className="text-xs font-bold focus:bg-accent focus:text-bg-primary cursor-pointer gap-2"
                            asChild
                        >
                          <Link to={`/admin/clients/${client.id}`}>
                            <ExternalLink className="w-3.5 h-3.5" /> Voir profil complet
                          </Link>
                        </DropdownMenuItem>
                      <DropdownMenuItem
                          className="text-xs font-bold focus:bg-accent focus:text-bg-primary cursor-pointer gap-2"
                          asChild
                      >
                        <Link to={`/admin/requests?search=${client.firstName} ${client.lastName}`}>
                          <Package className="w-3.5 h-3.5" /> Toutes les commandes
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-text-muted group-hover:text-text-primary transition-colors">
                    <Mail className="w-3.5 h-3.5 text-accent/50" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-text-muted">
                    <Shield className="w-3.5 h-3.5 text-accent/50" />
                    <span className="uppercase tracking-widest text-[9px] font-black">Role: {client.role}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <div className="flex -space-x-2">
                        {/* Placeholder for request status counts or similar info */}
                        <div className="w-6 h-6 rounded-full bg-accent/20 border-2 border-bg-primary flex items-center justify-center text-[8px] font-black text-accent uppercase">R</div>
                        <div className="w-6 h-6 rounded-full bg-success/20 border-2 border-bg-primary flex items-center justify-center text-[8px] font-black text-success uppercase">M</div>
                   </div>
                   <Button
                      variant="ghost"
                      size="sm"
                      className="text-[10px] font-black uppercase tracking-widest h-7 px-4 hover:bg-accent hover:text-bg-primary rounded-lg transition-all"
                      onClick={() => window.location.href = `mailto:${client.email}`}
                  >
                      Contacter
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-24 text-center space-y-6 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-24 h-24 bg-accent/5 rounded-full flex items-center justify-center mx-auto border border-accent/10">
              <AlertCircle className="w-12 h-12 text-accent/40" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase">Aucun client trouvé</h3>
              <p className="text-text-muted mt-2 font-medium">Réessayez avec un autre nom ou email.</p>
            </div>
            <Button variant="outline" className="rounded-xl px-8 border-accent/20 text-accent" onClick={() => setSearch('')}>Réinitialiser</Button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
