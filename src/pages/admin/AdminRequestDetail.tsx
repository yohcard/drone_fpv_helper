import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Clock, 
  ShieldCheck,
  Package,
  Plus,
  TrendingUp,
  FileText,
  Check,
  User,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/AuthContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const STATUS_ORDER = ['RECU', 'DIAGNOSTIC', 'EN_REPARATION', 'TERMINE']

export default function AdminRequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [request, setRequest] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // States for logging
  const [sessionDuration, setSessionDuration] = useState('1')
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')

  const fetchDetail = async () => {
    try {
      const [reqRes, msgRes] = await Promise.all([
        fetch(`${API_URL}/admin/requests/${id}`, { credentials: 'include' }),
        fetch(`${API_URL}/messages/${id}`, { credentials: 'include' })
      ])

      if (reqRes.ok) setRequest(await reqRes.json())
      if (msgRes.ok) setMessages(await msgRes.json())
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await fetch(`${API_URL}/admin/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      })
      fetchDetail()
    } catch (error) {
       console.error(error)
    }
  }

  const handleAddWorkSession = async () => {
    try {
      await fetch(`${API_URL}/admin/requests/${id}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationHalfHours: Number(sessionDuration) }),
        credentials: 'include'
      })
      toast.success('Temps enregistré', {
        description: `Session de ${Number(sessionDuration) * 0.5}h ajoutée avec succès.`,
      })
      fetchDetail()
    } catch (error) {
       toast.error('Erreur', { description: 'Échec de l\'enregistrement du temps' })
       console.error(error)
    }
  }

  const handleAddExpense = async () => {
    if (!expenseTitle || !expenseAmount) return
    try {
      await fetch(`${API_URL}/admin/requests/${id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: expenseTitle, amount: Number(expenseAmount) }),
        credentials: 'include'
      })
      setExpenseTitle('')
      setExpenseAmount('')
      toast.success('Pièce ajoutée', {
        description: `${expenseTitle} a été ajoutée à la facturation.`,
      })
      fetchDetail()
    } catch (error) {
       toast.error('Erreur', { description: 'Échec de l\'ajout de la pièce' })
       console.error(error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, senderRole: 'ADMIN' }),
        credentials: 'include'
      })

      if (response.ok) {
        const sent = await response.json()
        setMessages([...messages, { ...sent, sender: user }])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Send message error:', error)
    }
  }

  if (isLoading) return (
    <div className="space-y-10 animate-pulse pb-20">
      <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/5">
        <div className="space-y-4">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-8 w-64 bg-white/10 rounded" />
        </div>
        <div className="h-12 w-48 bg-white/10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-[600px] bg-white/5 rounded-3xl border border-white/5" />
        <div className="lg:col-span-4 h-[400px] bg-white/5 rounded-3xl border border-white/5" />
      </div>
    </div>
  )

  if (!request) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <h3 className="text-xl font-black uppercase italic">Demande introuvable</h3>
      <Button variant="ghost" onClick={() => navigate('/admin/requests')}>Retour à la liste</Button>
    </div>
  )

  const totalExpenses = request.expenses?.reduce((acc: number, exp: any) => acc + Number(exp.amount), 0) || 0
  const totalWorkHours = (request.workSessions?.reduce((acc: number, session: any) => acc + Number(session.durationHalfHours), 0) || 0) * 0.5
  const workCost = totalWorkHours * 50

  return (
    <PageWrapper className="space-y-10 pb-20 relative">
      {/* Admin Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/requests')} className="rounded-full bg-white/5 hover:bg-white/10 shrink-0">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black font-mono text-accent uppercase tracking-[0.2em]">{request.ticketNumber}</span>
                    <Badge variant={request.status.toLowerCase() as any} className="uppercase font-black text-[9px] px-3">{request.status}</Badge>
                </div>
                <h1 className="text-3xl font-black italic uppercase leading-none tracking-tight">{request.issueType}</h1>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
            {STATUS_ORDER.map((st, i) => {
                const isActive = request.status === st
                const isPast = STATUS_ORDER.indexOf(request.status) > i
                return (
                    <Button 
                        key={st} 
                        size="sm" 
                        variant={isActive ? 'default' : 'ghost'} 
                        className={cn(
                            "rounded-xl text-[10px] font-black uppercase tracking-widest px-4 h-9",
                            isPast && "text-success hover:text-success hover:bg-success/10"
                        )}
                        onClick={() => handleUpdateStatus(st)}
                    >
                        {isPast ? <Check className="w-3.5 h-3.5 mr-1" /> : null}
                        {st.replace(/_/g, ' ')}
                    </Button>
                )
            })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Intervention Stats & Management */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Main Info Card */}
            <Card className="border-white/5 bg-bg-card/30 overflow-hidden relative border-t-2 border-t-accent/50">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Package className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-black italic uppercase tracking-tight">Détails de l'intervention</CardTitle>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-white/40">{new Date(request.createdAt).toLocaleDateString()}</Badge>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Client</p>
                            <p className="text-sm font-black italic">{request.user?.firstName} {request.user?.lastName}</p>
                            <p className="text-[10px] text-accent font-mono">{request.user?.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Type Service</p>
                            <p className="text-sm font-black italic">{request.serviceType === 'REPAIR' ? 'Réparation' : 'Montage Professional'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Heures Log (MO)</p>
                            <p className="text-sm font-black font-mono text-accent">{totalWorkHours} h</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Poste Actuel</p>
                            <p className="text-sm font-black italic uppercase text-accent">{request.status.replace(/_/g, ' ')}</p>
                        </div>
                    </div>

                    <Separator className="bg-white/5" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <h4 className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                Symptômes initiaux
                            </h4>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-sm leading-relaxed font-medium italic text-text-muted">
                                "{request.issueDescription}"
                            </div>
                         </div>
                         <div className="space-y-3">
                            <h4 className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                Informations Client
                            </h4>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-sm leading-relaxed font-medium text-text-muted">
                                {request.additionalDescription || "Aucune note additionnelle de la part du client."}
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loggers: Sessions & Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Work Sessions */}
                <Card className="border-white/5 bg-bg-card/40 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-md font-black uppercase italic tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            Session de Travail
                        </CardTitle>
                        <Badge className="bg-accent/10 text-accent border-none">{totalWorkHours}h total</Badge>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <div className="flex gap-2">
                            <div className="flex-1 flex bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                                <button 
                                    className={cn("flex-1 p-2 text-xs font-black transition-colors hover:bg-white/5", sessionDuration === '1' && "bg-accent text-bg-primary")}
                                    onClick={() => setSessionDuration('1')}
                                >
                                    0.5h
                                </button>
                                <button 
                                    className={cn("flex-1 p-2 text-xs font-black transition-colors border-l border-white/5 hover:bg-white/5", sessionDuration === '2' && "bg-accent text-bg-primary")}
                                    onClick={() => setSessionDuration('2')}
                                >
                                    1h
                                </button>
                                <button 
                                    className={cn("flex-1 p-2 text-xs font-black transition-colors border-l border-white/5 hover:bg-white/5", sessionDuration === '4' && "bg-accent text-bg-primary")}
                                    onClick={() => setSessionDuration('4')}
                                >
                                    2h
                                </button>
                            </div>
                            <Button size="icon" className="rounded-xl h-10 w-10 shrink-0 shadow-lg shadow-accent/20" onClick={handleAddWorkSession}>
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        <div className="space-y-2 mt-4 max-h-[160px] overflow-y-auto no-scrollbar">
                            {request.workSessions?.map((session: any) => (
                                <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-accent/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                        <span className="text-xs font-black italic">{session.durationHalfHours * 0.5} h d'intervention</span>
                                    </div>
                                    <span className="text-[10px] text-text-muted font-mono">{new Date(session.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Parts / Expenses */}
                <Card className="border-white/5 bg-bg-card/40 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-md font-black uppercase italic tracking-wider flex items-center gap-2">
                            <Plus className="w-4 h-4 text-success" />
                            Pièces Détachées
                        </CardTitle>
                        <Badge className="bg-success text-bg-primary border-none">{totalExpenses.toFixed(0)} CHF</Badge>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <Input 
                                placeholder="Désignation" 
                                className="col-span-2 h-10 bg-white/5 border-white/5 text-xs font-bold rounded-xl"
                                value={expenseTitle}
                                onChange={(e) => setExpenseTitle(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="CHF" 
                                    className="h-10 bg-white/5 border-white/5 text-xs font-bold rounded-xl font-mono text-success"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                />
                                <Button size="icon" className="rounded-xl h-10 w-10 shrink-0 bg-success hover:bg-success/80 text-bg-primary shadow-lg shadow-success/20" onClick={handleAddExpense}>
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 mt-4 max-h-[160px] overflow-y-auto no-scrollbar">
                           {request.expenses?.map((exp: any) => (
                               <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-success/30 transition-all">
                                   <div className="flex items-center gap-3 font-black text-xs">
                                       <span className="text-text-primary px-2">{exp.title}</span>
                                   </div>
                                   <span className="font-mono font-bold text-success text-sm italic">{Number(exp.amount).toFixed(2)}</span>
                               </div>
                           ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Communication Panel (Reused from client, but styled for admin) */}
            <Card className="border-white/5 bg-bg-card/40 overflow-hidden flex flex-col h-[550px] shadow-2xl">
                <CardHeader className="border-b border-white/5 bg-white/5">
                    <CardTitle className="text-lg font-black uppercase italic tracking-widest flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-accent" />
                        Communication Directe Client
                    </CardTitle>
                </CardHeader>
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                            <MessageSquare className="w-16 h-16" />
                            <p className="font-black italic uppercase tracking-widest">En attente du premier contact</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const isMe = msg.senderId === user?.id
                            return (
                                <div key={i} className={cn("flex flex-col max-w-[85%] animate-fade-in", isMe ? "ml-auto items-end" : "items-start")}>
                                    <div className="flex items-center gap-2 mb-2 px-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                                            {isMe ? 'Technicien HUB' : `${request.user?.firstName} ${request.user?.lastName}`.toUpperCase()}
                                        </span>
                                        <span className="text-[8px] font-mono text-text-muted">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={cn(
                                        "p-5 rounded-3xl text-sm leading-relaxed shadow-xl",
                                        isMe 
                                            ? "bg-accent text-bg-primary rounded-tr-none font-bold" 
                                            : "bg-white/5 text-text-primary rounded-tl-none border border-white/10 backdrop-blur-md"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                <div className="p-6 bg-white/5 border-t border-white/5">
                    <form onSubmit={handleSendMessage} className="flex gap-4">
                        <Textarea 
                            placeholder="Écrire au client..."
                            className="min-h-[50px] h-[50px] py-4 rounded-2xl bg-bg-card border-white/5 focus-visible:ring-accent/40 font-bold italic resize-none"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon" className="h-[50px] w-[50px] rounded-2xl shrink-0 shadow-lg shadow-accent/20" disabled={!newMessage.trim()}>
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>

        {/* Financial Recap & Global Status */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
            <Card className="border-accent/40 bg-accent/5 overflow-hidden border-2 shadow-2xl shadow-accent/5 relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                </div>
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Récapitulatif de facturation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Main d'œuvre ({totalWorkHours}h)</span>
                            <span className="font-mono font-black italic">{workCost.toFixed(2)} CHF</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pièces & Composants</span>
                            <span className="font-mono font-black italic text-success">+{totalExpenses.toFixed(2)} CHF</span>
                        </div>
                        <div className="pt-4 flex flex-col gap-2">
                             <div className="flex justify-between items-end">
                                <span className="text-sm font-black italic uppercase tracking-widest">Grand Total</span>
                                <span className="text-4xl font-black text-accent font-mono shadow-sm">{(workCost + totalExpenses).toFixed(2)}</span>
                             </div>
                             <span className="text-[10px] text-accent font-black text-right tracking-[0.2em]">DEV. CHF</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-white/5 pt-6 flex flex-col gap-3">
                    <Button className="w-full h-12 rounded-2xl shadow-xl shadow-success/10 bg-success hover:bg-success/90 text-bg-primary font-black uppercase tracking-widest transition-transform hover:scale-[1.02]">
                        Générer Facture Finale
                    </Button>
                    <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-text-muted">
                        Archiver l'intervention
                    </Button>
                </CardFooter>
            </Card>

            <Card className="border-white/5 bg-bg-card/40 overflow-hidden">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-primary border border-white/5 group-hover:border-accent/30 transition-all duration-500">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Compte Client</p>
                            <h4 className="text-md font-black italic leading-none">{request.user?.firstName} {request.user?.lastName}</h4>
                        </div>
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex items-center gap-4 text-xs font-bold text-text-muted">
                        <ShieldCheck className="w-4 h-4 text-success" />
                        ID Client: <span className="font-mono text-accent">#{request.user?.id?.substring(0,8)}</span>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                        Détails du client
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </PageWrapper>
  )
} 
