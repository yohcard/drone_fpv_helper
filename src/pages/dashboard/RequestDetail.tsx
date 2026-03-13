import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Clock, 
  ShieldCheck,
  Package,
  History,
  Info,
  ExternalLink,
  Paperclip,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/AuthContext'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function RequestDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [request, setRequest] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [reqRes, msgRes] = await Promise.all([
          fetch(`${API_URL}/requests/${id}`, { credentials: 'include' }),
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

    fetchDetail()
  }, [id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, senderRole: 'CLIENT' }),
        credentials: 'include'
      })

      if (response.ok) {
        const sent = await response.json()
        setMessages([...messages, { ...sent, sender: user }])
        setNewMessage('')
        toast.success('Message envoyé')
      }
    } catch (error) {
      toast.error('Erreur', { description: 'Impossible d\'envoyer le message' })
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
      <Button variant="ghost" asChild>
        <Link to="/dashboard/requests">Retour à la liste</Link>
      </Button>
    </div>
  )

  const totalCost = request.expenses?.reduce((acc: number, exp: any) => acc + Number(exp.amount), 0) || 0
  const totalWorkHours = (request.workSessions?.reduce((acc: number, session: any) => acc + Number(session.durationHalfHours), 0) || 0) * 0.5
  const workCost = totalWorkHours * 50

  return (
    <PageWrapper className="space-y-8 pb-12">
      {/* Header & Sub-nav */}
      <div className="flex flex-col gap-4">
        <Link to="/dashboard/requests" className="flex items-center text-sm text-text-muted hover:text-accent transition-colors w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest">{request.ticketNumber}</span>
              <Badge variant={request.status.toLowerCase() as any}>
                {request.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{request.issueType}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9">
              <History className="w-4 h-4 mr-2" />
              Historique
            </Button>
            <Button size="sm" className="rounded-lg h-9">
              <Info className="w-4 h-4 mr-2" />
              Devis / Facture
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details & Chat */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Info */}
          <Card className="border-border/50 bg-bg-card/50 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Détails du drone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-heading">Service</p>
                  <p className="text-sm font-medium">{request.serviceType === 'REPAIR' ? 'Réparation' : 'Montage'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-heading">Créé le</p>
                  <p className="text-sm font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-heading">Photos</p>
                  <p className="text-sm font-medium">{request.attachments?.length || 0} fiches</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-heading">Priorité</p>
                  <Badge variant="outline" className="text-[10px] h-5 bg-success/5 text-success border-success/20">Standard</Badge>
                </div>
              </div>
              <Separator className="bg-border/50" />
              <div className="space-y-2">
                <p className="text-sm font-bold">Description initiale</p>
                <div className="p-4 rounded-xl bg-bg-secondary/40 text-sm text-text-muted leading-relaxed">
                  {request.issueDescription}
                </div>
              </div>
              {request.additionalDescription && (
                <div className="space-y-2">
                  <p className="text-sm font-bold">Informations complémentaires</p>
                  <div className="p-4 rounded-xl bg-bg-secondary/40 text-sm italic text-text-muted leading-relaxed">
                    {request.additionalDescription}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat / Communication */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              Discussion avec le technicien
            </h2>
            <Card className="border-border/50 bg-bg-card/50 overflow-hidden flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 opacity-40">
                    <MessageSquare className="w-12 h-12" />
                    <p className="text-sm italic">Aucun message pour le moment. Le technicien vous contactera prochainement.</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId === user?.id
                    return (
                      <div key={i} className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "items-start")}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                            {isMe ? 'Vous' : `${msg.sender?.firstName} (Technicien)`}
                          </span>
                          <span className="text-[9px] text-text-muted">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm shadow-sm",
                          isMe 
                            ? "bg-accent text-bg-primary rounded-tr-none font-medium" 
                            : "bg-bg-secondary text-text-primary rounded-tl-none border border-border/50"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <div className="p-4 bg-bg-secondary/50 border-t border-border">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <div className="relative flex-1">
                    <Textarea 
                      placeholder="Votre message..."
                      className="min-h-[44px] h-[44px] py-3 resize-none bg-bg-card border-border/50 focus-visible:ring-accent/30 rounded-xl pr-10"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                        }
                      }}
                    />
                    <button type="button" className="absolute right-3 top-3 text-text-muted hover:text-accent transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                  <Button type="submit" size="icon" className="h-[44px] w-[44px] rounded-xl shrink-0" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Status & Cost */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          
          {/* Timeline / Progress */}
          <Card className="border-border/50 bg-bg-card shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base uppercase tracking-widest font-heading text-text-muted">Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['RECU', 'DIAGNOSTIC', 'EN_REPARATION', 'TERMINE'].map((st, i, arr) => {
                const isCompleted = arr.indexOf(request.status) >= i
                const isCurrent = request.status === st
                return (
                  <div key={st} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                        isCompleted ? "bg-accent text-bg-primary scale-110 shadow-lg shadow-accent/20" : "bg-bg-secondary text-text-muted border border-border"
                      )}>
                        {isCompleted ? <ShieldCheck className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      {i < 3 && <div className={cn("w-0.5 h-8 my-1 rounded-full", arr.indexOf(request.status) > i ? "bg-accent" : "bg-border")} />}
                    </div>
                    <div className="pb-6">
                      <p className={cn("text-sm font-bold", isCurrent ? "text-accent" : isCompleted ? "text-text-primary" : "text-text-muted")}>
                        {st.replace(/_/g, ' ')}
                      </p>
                      {isCurrent && <p className="text-[10px] text-accent font-medium mt-0.5 animate-pulse italic">Intervention actuelle</p>}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Billing Overview */}
          <Card className="border-accent/20 bg-accent/5 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Estimation Actuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Main d'œuvre ({totalWorkHours}h)</span>
                  <span className="font-medium">{workCost.toFixed(2)} CHF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Pièces détachées</span>
                  <span className="font-medium text-success">+{totalCost.toFixed(2)} CHF</span>
                </div>
                <Separator className="bg-accent/10" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold">TOTAL ESTIMÉ</span>
                  <span className="text-2xl font-black text-accent">{(workCost + totalCost).toFixed(2)} CHF</span>
                </div>
              </div>
              
              <div className="p-3 bg-bg-card rounded-xl border border-border/50 text-[10px] text-text-muted leading-relaxed">
                <p>Ce montant est une estimation basée sur les heures logguées et les pièces déjà facturées. Le total final peut varier.</p>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/5 pt-0">
              <Button variant="outline" size="sm" className="w-full border-accent/20 hover:bg-accent/10 transition-colors h-9 group">
                Payer la facture
                <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
} 

