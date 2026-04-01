"use client"

import { Calendar, Search, ChevronRight, Clock, CheckCircle2, XCircle, MapPin, PartyPopper } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CustomModal } from "@/components/ui/CustomModal"
import Link from "next/link"
import { useState } from "react"
import { useReservations } from "@/hooks/useReservations"
import { useAuth } from "@/hooks/useAuth"

export default function AccountReservationsPage() {
  const { user } = useAuth()
  const { getMyReservations, updateReservationStatus } = useReservations()
  const { data: reservations } = getMyReservations(user?.id || "")
  const [cancelId, setCancelId] = useState<string | null>(null)

  const handleCancelClick = (id: string) => {
    setCancelId(id)
  }

  const handleConfirmCancel = async () => {
    if (!cancelId) return
    try {
      await updateReservationStatus.mutateAsync({ id: cancelId, status: 'cancelled' })
      setCancelId(null)
    } catch (e) {
      alert("Errore durante l'annullamento")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-heading font-extrabold tracking-tight">Le Mie Prenotazioni</h2>
           <p className="text-muted-foreground">Gestisci i tuoi appuntamenti e gli allestimenti per i tuoi eventi.</p>
        </div>
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
           <Input placeholder="Cerca prenotazione..." className="pl-10 h-11 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {(reservations || []).map((res) => (
           <div key={res.id} className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all group">
              {/* Date Card */}
              <div className={`p-6 md:w-40 flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-border/30 transition-colors ${
                 res.status === 'confirmed' ? 'bg-success/5' : 
                 res.status === 'pending' ? 'bg-amber-500/5' : 
                 res.status === 'cancelled' || res.status === 'rejected' ? 'bg-destructive/5' : 'bg-secondary/50'
               }`}>
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{new Date(res.event_date).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</span>
                 <span className={`text-3xl font-heading font-black ${res.status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}`}>{new Date(res.event_date).getDate()}</span>
                 <span className="text-sm font-bold capitalize">{new Date(res.event_date).toLocaleDateString('it-IT', { weekday: 'long' })}</span>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-grow space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <div className="flex items-center space-x-2">
                          <PartyPopper className={`w-4 h-4 ${res.status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h3 className="text-xl font-heading font-extrabold capitalize">{res.event_type}</h3>
                       </div>
                       <div className="flex items-center text-sm text-muted-foreground font-medium">
                          <Clock className="w-4 h-4 mr-2" />
                          {res.slot_start.slice(0, 5)} - {res.slot_end.slice(0, 5)}
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-2" />
                          {res.location || "In Negozio"}
                       </div>
                    </div>
                    <div className={`flex items-center text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      res.status === 'confirmed' ? 'bg-success/10 text-success border-success/20' : 
                      res.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-200' :
                      res.status === 'cancelled' || res.status === 'rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      'bg-secondary text-muted-foreground border-border/50'
                    }`}>
                       {res.status === 'confirmed' ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <Clock className="w-3.5 h-3.5 mr-1.5" />}
                       {res.status}
                    </div>
                 </div>

                 <div className="bg-secondary/20 p-3 rounded-xl">
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed italic line-clamp-2">
                      "{res.notes || "Nessuna nota specificata."}"
                    </p>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-border/30">
                    <Link href={`/prenota/conferma/${res.id}`} className="flex-grow">
                      <Button variant="outline" className="w-full font-bold h-10 rounded-xl">Dettagli</Button>
                    </Link>
                    {res.status === 'pending' && (
                      <Button 
                        variant="ghost"
                        className="flex-grow font-bold h-10 rounded-xl text-destructive hover:bg-destructive/10"
                        onClick={() => handleCancelClick(res.id)}
                        disabled={updateReservationStatus.isPending}
                      >
                        {updateReservationStatus.isPending ? "Annullamento..." : "Annulla"}
                      </Button>
                    )}
                    <Link href="/prenota" className="flex-grow">
                      <Button variant="ghost" className="w-full font-bold h-10 rounded-xl text-primary hover:bg-primary/5">
                         Nuova
                      </Button>
                    </Link>
                 </div>
              </div>
           </div>
         ))}
         {(!reservations || reservations.length === 0) && (
           <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-12 text-center text-muted-foreground font-medium">
              Non hai ancora effettuato prenotazioni.
           </div>
         )}
      </div>

      <CustomModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleConfirmCancel}
        title="Annulla Prenotazione"
        description="Sei sicuro di voler annullare questa prenotazione? Questa azione non può essere annullata."
        confirmText="Conferma Annullamento"
        variant="destructive"
        isLoading={updateReservationStatus.isPending}
      />
    </div>
  )
}
