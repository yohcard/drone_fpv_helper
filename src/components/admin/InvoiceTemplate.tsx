import { Wrench } from "lucide-react"

interface InvoiceProps {
  request: any
}

export default function InvoiceTemplate({ request }: InvoiceProps) {
  const totalExpenses = request.expenses?.reduce((acc: number, exp: any) => acc + Number(exp.amount), 0) || 0
  const totalWorkHours = (request.workSessions?.reduce((acc: number, session: any) => acc + Number(session.durationHalfHours), 0) || 0) * 0.5
  const workCost = totalWorkHours * 50
  const grandTotal = workCost + totalExpenses

  return (
    <div id="invoice-print" className="p-12 bg-white text-slate-900 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">drone<span className="text-orange-600">fpv</span>builder</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Maintenance & High Performance Build</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <h2 className="text-3xl font-black uppercase text-slate-300 tracking-tighter">FACTURE</h2>
          <p className="text-sm font-bold text-slate-600">{request.ticketNumber}</p>
          <p className="text-xs text-slate-400">{new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-2 gap-20 mb-16">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-600 border-b border-orange-100 pb-2">Émis par :</h3>
          <div className="text-sm space-y-1 font-medium italic">
            <p className="font-black not-italic">Yohan Cardis - Drone FPV Builder</p>
            <p>Route du Village 12</p>
            <p>1234 Maintenance City</p>
            <p>Suisse</p>
            <p className="text-slate-400 pt-2 font-bold not-italic">support@dronefpvbuilder.shop</p>
          </div>
        </div>
        <div className="space-y-4 text-right">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Destinataire :</h3>
          <div className="text-sm space-y-1 font-medium italic">
            <p className="font-black not-italic">{request.user?.firstName} {request.user?.lastName}</p>
            <p>{request.user?.email}</p>
            <p className="text-slate-300 pt-4">ID Client: #{request.user?.id?.substring(0,8)}</p>
          </div>
        </div>
      </div>

      {/* Intervention Detail */}
      <div className="mb-12">
         <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Objet de l'intervention :</h4>
            <p className="text-lg font-black italic uppercase text-slate-800">{request.issueType}</p>
            <p className="text-xs text-slate-500 italic mt-1 font-medium leading-relaxed">Symptômes: {request.issueDescription}</p>
         </div>
      </div>

      {/* Table */}
      <div className="flex flex-col mb-16">
        <div className="grid grid-cols-12 bg-slate-900 text-white rounded-t-lg p-4 text-[10px] font-black uppercase tracking-widest">
          <div className="col-span-7">Désignation / Service</div>
          <div className="col-span-2 text-center">Qté</div>
          <div className="col-span-1 text-right">Unité</div>
          <div className="col-span-2 text-right">Montant</div>
        </div>
        
        {/* Main d'œuvre */}
        {totalWorkHours > 0 && (
            <div className="grid grid-cols-12 border-b border-slate-100 p-4 text-sm font-medium items-center">
                <div className="col-span-7">
                    <p className="font-black italic uppercase text-slate-800">Main d'œuvre Technique</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Expertise, réparation et tests en vol</p>
                </div>
                <div className="col-span-2 text-center font-bold text-slate-600">{totalWorkHours} h</div>
                <div className="col-span-1 text-right text-slate-400 font-mono">50.00</div>
                <div className="col-span-2 text-right font-black font-mono text-slate-800">{workCost.toFixed(2)} CHF</div>
            </div>
        )}

        {/* Pièces */}
        {request.expenses?.map((exp: any) => (
            <div key={exp.id} className="grid grid-cols-12 border-b border-slate-100 p-4 text-sm font-medium items-center">
                <div className="col-span-7">
                    <p className="font-black italic uppercase text-slate-800">{exp.description}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Pièce de remplacement / Consommables</p>
                </div>
                <div className="col-span-2 text-center font-bold text-slate-600">1</div>
                <div className="col-span-1 text-right text-slate-400 font-mono">{Number(exp.amount).toFixed(2)}</div>
                <div className="col-span-2 text-right font-black font-mono text-slate-800">{Number(exp.amount).toFixed(2)} CHF</div>
            </div>
        ))}

        {/* Empty state if nothing */}
        {totalWorkHours === 0 && (!request.expenses || request.expenses.length === 0) && (
            <div className="p-12 text-center text-slate-300 italic font-medium">Aucun service ou pièce facturé.</div>
        )}
      </div>

      {/* Totals */}
      <div className="flex justify-end pr-4">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm text-slate-500 font-bold uppercase tracking-widest">
            <span>Sous-Total</span>
            <span>{grandTotal.toFixed(2)} CHF</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500 font-bold uppercase tracking-widest">
            <span>TVA (0%)</span>
            <span>0.00 CHF</span>
          </div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between items-end pb-4">
            <span className="text-xs font-black uppercase tracking-tighter text-slate-900">Total Net à payer</span>
            <span className="text-3xl font-black text-orange-600 font-mono italic leading-none">{grandTotal.toFixed(2)} <span className="text-sm">CHF</span></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-12 left-12 right-12 flex justify-between items-end border-t border-slate-100 pt-8 mt-auto">
        <div className="space-y-2">
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Informations Bancaires</p>
          <div className="text-[10px] space-y-0.5 text-slate-600 font-bold italic">
            <p>Banque : Cantone de Vaud (BCV)</p>
            <p>IBAN : CH84 0000 0000 0000 0000 0</p>
            <p>Titulaire : Yohan Cardis</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xs font-black italic uppercase text-slate-300">Merci de votre confiance !</p>
           <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Fly Safe • DroneFPVBuilder</p>
        </div>
      </div>
    </div>
  )
}
