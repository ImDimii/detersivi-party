"use client"

import { Calendar, Search, ChevronRight, Clock, CheckCircle2, XCircle, MapPin, PartyPopper } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useReservations } from "@/hooks/useReservations"
import { useAuth } from "@/hooks/useAuth"

export default function AccountReservationsPage() {
  const { user } = useAuth()
  const { getMyReservations } = useReservations()
  const { data: reservations } = getMyReservations(user?.id || "")

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
              <div className={`p-8 md:w-48 flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-border/30 transition-colors ${res.status === 'confirmed' ? 'bg-primary/5' : 'bg-secondary/10'}`}>
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{new Date(res.event_date).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</span>
                 <span className={`text-4xl font-heading font-black ${res.status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}`}>{new Date(res.event_date).getDate()}</span>
                 <span className="text-sm font-bold capitalize">{new Date(res.event_date).toLocaleDateString('it-IT', { weekday: 'long' })}</span>
              </div>
              
              {/* Content */}
              <div className="p-8 flex-grow space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <div className="flex items-center space-x-2">
                          <PartyPopper className={`w-4 h-4 ${res.status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h3 className="text-xl font-heading font-extrabold capitalize">{res.event_type}</h3>
                       </div>
                       <div className="flex items-center text-sm text-muted-foreground font-medium">
                          <Clock className="w-4 h-4 mr-2" />
                          {res.slot_start} - {res.slot_end}
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-2" />
                          {res.location || "In Negozio"}
                       </div>
                    </div>
                    <div className={`flex items-center text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      res.status === 'confirmed' ? 'bg-success/10 text-success border-success/20' : 'bg-secondary text-muted-foreground border-border/50'
                    }`}>
                       {res.status === 'confirmed' ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <Clock className="w-3.5 h-3.5 mr-1.5" />}
                       {res.status}
                    </div>
                 </div>

                 <div className="bg-secondary/20 p-4 rounded-xl">
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed italic line-clamp-2">
                      "{res.notes || "Nessuna nota specificata."}"
                    </p>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/30">
                    <Button variant="outline" className="flex-grow font-bold h-11 rounded-xl">Dettagli</Button>
                    <Link href="/prenota" className="flex-grow">
                      <Button variant="ghost" className="w-full font-bold h-11 rounded-xl text-primary hover:bg-primary/5">
                         Prenota un altro evento
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
    </div>
  )
}
