import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Wrench,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { cn } from '@/lib/utils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function AdminHome() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/stats`, {
          credentials: 'include'
        })
        if (response.ok) {
          const stats = await response.json()
          setData(stats)
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const kpis = data ? [
    { label: 'Revenu Total', value: `${data.kpis.totalRevenue.toFixed(2)} CHF`, subValue: 'Depuis le début', icon: Wallet, color: 'text-success', trend: 'neutral' },
    { label: 'Heures de Travail', value: `${data.kpis.totalFlightHours} h`, subValue: 'Total cumulé', icon: Clock, color: 'text-accent', trend: 'neutral' },
    { label: 'Demandes Actives', value: data.kpis.activeRequests.toString(), subValue: `${data.kpis.urgentRequests} urgentes`, icon: AlertCircle, color: 'text-error', trend: 'neutral' },
    { label: 'Clients Uniques', value: data.kpis.uniqueClients.toString(), subValue: `${data.kpis.newClientsYesterday} nouveaux hier`, icon: Users, color: 'text-blue-500', trend: 'neutral' },
  ] : []

  const alerts = data?.alerts || []
  const recentRequests = data?.recentRequests || []

  return (
    <PageWrapper className="space-y-10 pb-20">
      {/* Header Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight font-heading uppercase italic">Control <span className="text-accent underline decoration-4 underline-offset-8">Center</span></h1>
            <p className="text-text-muted font-medium">Monitoring global de l'activité drone-builder.ch</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="border-accent/20 bg-accent/5 text-accent hover:bg-accent/10 rounded-xl">Exporter Rapport</Button>
            <Button className="rounded-xl shadow-lg shadow-accent/20">Système Live</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-white/5 bg-bg-card/40 h-32 animate-pulse" />
          ))
        ) : kpis.map((kpi, i) => (
          <Card key={i} className="border-white/5 bg-bg-card/40 hover:bg-bg-card/60 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <kpi.icon className="w-16 h-16" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-white/5 ${kpi.color}`}>
                   <kpi.icon className="w-5 h-5" />
                </div>
                {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-success" /> : kpi.trend === 'down' ? <ArrowDownRight className="w-4 h-4 text-error" /> : null}
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{kpi.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-black">{kpi.value}</h3>
                </div>
                <p className="text-[10px] text-text-muted mt-1 font-medium italic">{kpi.subValue}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed: All Requests */}
        <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-accent" />
                    Flux de Réparations
                </h2>
                <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10" asChild>
                    <Link to="/admin/requests">Tout voir <ArrowUpRight className="w-4 h-4 ml-2" /></Link>
                </Button>
            </div>
            
            <Card className="border-white/5 bg-bg-card/20 backdrop-blur-sm overflow-hidden border-t-accent/30 border-t-2">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Ticket / Client</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Machine</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Statut</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center">
                                            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : recentRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-5 text-center text-sm font-medium text-text-muted">
                                            Aucune réparation en cours
                                        </td>
                                    </tr>
                                ) : (
                                    recentRequests.map((req: any) => (
                                        <tr key={req.id} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => {}}>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono text-accent font-bold group-hover:underline">{req.ticket}</span>
                                                    <span className="text-sm font-bold mt-1">{req.client}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white/5 rounded-lg">
                                                        <Package className="w-4 h-4 text-text-muted" />
                                                    </div>
                                                    <span className="text-sm font-medium">{req.device || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <Badge variant={req.status.toLowerCase() as any} className="uppercase text-[9px] font-black tracking-tighter">
                                                    {req.status}
                                                </Badge>
                                            </td>
                                            <td className="p-5 text-right font-mono font-bold text-sm text-success">
                                                {req.price}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Feed: Alerts & Tools */}
        <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-error" />
                    Alertes Systèmes
                </h2>
                <div className="space-y-3">
                    {isLoading ? (
                         <div className="p-4 rounded-2xl border bg-white/5 border-white/5 h-20 animate-pulse" />
                    ) : alerts.length === 0 ? (
                        <div className="p-4 rounded-2xl border bg-white/5 border-white/5 text-center text-sm text-text-muted">
                            Aucune alerte pour le moment
                        </div>
                    ) : (
                        alerts.map((alert: any, i: number) => (
                            <div key={i} className={cn(
                                "p-4 rounded-2xl border flex gap-4 transition-all duration-300 hover:scale-[1.02]",
                                alert.type === 'urgent' ? "bg-error/5 border-error/20" : "bg-white/5 border-white/5"
                            )}>
                                <div className={cn(
                                    "p-2 h-fit rounded-lg shadow-inner",
                                    alert.type === 'urgent' ? "bg-error text-error-foreground" : "bg-accent text-bg-primary"
                                )}>
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">{alert.title}</h4>
                                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{alert.desc}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Card className="border-accent/20 bg-accent/5 overflow-hidden relative">
                <div className="absolute -bottom-4 -right-4 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                </div>
                <CardHeader>
                    <CardTitle className="text-lg uppercase font-black italic">Rendement Tech</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end border-b border-accent/10 pb-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-accent uppercase font-black">Heures</p>
                            <h4 className="text-3xl font-black">{data?.kpis.totalFlightHours || 0} h</h4>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-text-muted uppercase font-bold">CA MO</p>
                             <h4 className="text-xl font-black italic">{(data?.kpis.totalRevenue || 0).toFixed(2)} CHF</h4>
                        </div>
                    </div>
                    <p className="text-[10px] text-text-muted italic leading-relaxed">
                        Basé sur les sessions de travail validées et les dépenses facturées.
                    </p>
                    <Button className="w-full h-10 rounded-xl" asChild>
                        <Link to="/admin/requests">Voir les demandes</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
