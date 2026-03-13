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
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function AdminHome() {
  // Mock data globaux
  const kpis = [
    { label: 'Revenu Total', value: '4,250.00 CHF', subValue: '+12% ce mois', icon: Wallet, color: 'text-success', trend: 'up' },
    { label: 'Heures de Vol (Log)', value: '84.5 h', subValue: '+15h cette semaine', icon: Clock, color: 'text-accent', trend: 'up' },
    { label: 'Demandes Actives', value: '12', subValue: '3 urgentes', icon: AlertCircle, color: 'text-error', trend: 'neutral' },
    { label: 'Clients Uniques', value: '38', subValue: '2 nouveaux hier', icon: Users, color: 'text-blue-500', trend: 'up' },
  ]

  const alerts = [
    { title: 'Pièce manquante', desc: 'ESC T-Motor F55A pour Ticket #DR-2024-001', type: 'urgent' },
    { title: 'Rappel Facturation', desc: 'Ticket #DR-2023-156 prêt pour paiement', type: 'info' },
  ]

  const recentRequests = [
     { id: '1', ticket: 'DR-2024-001', client: 'John Wick', device: 'Nazgul5 V3', status: 'EN_REPARATION', price: '250.00 CHF' },
     { id: '2', ticket: 'DR-2024-002', client: 'Aris Drone', device: 'AOS 5.5', status: 'DIAGNOSTIC', price: '45.00 CHF' },
     { id: '3', ticket: 'DR-2024-003', client: 'Marc FPV', device: 'Chimera7', status: 'RECU', price: '0.00 CHF' },
  ]

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
        {kpis.map((kpi, i) => (
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
                                {recentRequests.map((req) => (
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
                                                <span className="text-sm font-medium">{req.device}</span>
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
                                ))}
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
                    {alerts.map((alert, i) => (
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
                    ))}
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
                            <p className="text-[10px] text-accent uppercase font-black">Heures Facturables</p>
                            <h4 className="text-3xl font-black">42.5 h</h4>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-text-muted uppercase font-bold">CA MO</p>
                             <h4 className="text-xl font-black italic">2,125 CHF</h4>
                        </div>
                    </div>
                    <p className="text-[10px] text-text-muted italic leading-relaxed">
                        Basé sur un taux horaire de 50 CHF. Calcul automatique incluant les sessions de travail validées.
                    </p>
                    <Button className="w-full h-10 rounded-xl">Ouvrir Timesheet</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </PageWrapper>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
