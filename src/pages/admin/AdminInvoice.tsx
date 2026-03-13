import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import InvoiceTemplate from '@/components/admin/InvoiceTemplate'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export default function AdminInvoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/requests/${id}`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setRequest(data)
          // Attendre un peu que le rendu soit fini avant de lancer l'impression
          setTimeout(() => {
            window.print()
          }, 1000)
        }
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-900 border-none">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-4" />
        <p className="font-black uppercase italic tracking-widest text-sm">Préparation de la facture...</p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-900 border-none text-center p-8">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-black uppercase italic mb-4">Erreur de chargement</h2>
        <Button onClick={() => window.close()}>Fermer l'onglet</Button>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
        {/* On force l'affichage ici car on est sur une page dédiée */}
        <div className="block print:block">
            <InvoiceTemplate request={request} />
        </div>
        
        {/* Un petit bouton flottant pour ceux qui ont bloqué le print auto */}
        <div className="fixed bottom-8 right-8 no-print">
            <Button 
                onClick={() => window.print()}
                className="bg-slate-900 text-white hover:bg-slate-800 shadow-2xl rounded-2xl h-14 px-8 font-black uppercase tracking-widest italic"
            >
                Imprimer en PDF
            </Button>
        </div>
    </div>
  )
}
