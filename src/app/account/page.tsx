"use client"

import { 
  ShoppingBag, 
  Calendar, 
  ArrowRight,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/hooks/useOrders"
import { useReservations } from "@/hooks/useReservations"
import { useAuth } from "@/hooks/useAuth"

export default function AccountOverview() {
  const { user } = useAuth()
  const { getMyOrders } = useOrders()
  const { getMyReservations } = useReservations()

  const { data: userOrders } = getMyOrders(user?.id || "")
  const { data: userReservations } = getMyReservations(user?.id || "")

  const lastOrder = userOrders?.[0]
  const nextReservation = userReservations?.[0]

  return (
    <div className="space-y-8">
      <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
           <h2 className="text-3xl font-heading font-extrabold tracking-tight">Il mio Account</h2>
           <p className="text-muted-foreground max-w-md">Controlla i tuoi ordini e gestisci le tue prenotazioni attive.</p>
        </div>
        <Link href="/catalogo">
          <Button size="lg" className="h-14 px-8 font-bold shadow-xl rounded-xl">Fai un Nuovo Ordine</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Recent Orders Overview */}
         <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-secondary/10 flex justify-between items-center">
               <h3 className="font-heading font-bold flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
                  Ultimo Ordine
               </h3>
               <Link href="/account/ordini" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Vedi Tutti</Link>
            </div>
            <div className="p-8 flex-grow space-y-6">
               {lastOrder ? (
                 <>
                   <div className="flex justify-between items-center">
                      <div className="space-y-1">
                         <p className="font-bold">Ordine {lastOrder.order_number}</p>
                         <p className="text-xs text-muted-foreground uppercase font-bold">{new Date(lastOrder.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-200">
                         {lastOrder.status}
                      </span>
                   </div>
                   
                   <div className="flex -space-x-3 overflow-hidden">
                      {/* We could fetch order items here if needed, or just show a placeholder */}
                      <div className="w-12 h-12 rounded-xl bg-secondary border-2 border-white shadow-sm flex items-center justify-center">
                         <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                   </div>

                   <div className="pt-4 border-t border-border/30 flex justify-between items-center">
                      <p className="font-bold text-lg text-primary">€{Number(lastOrder.total).toFixed(2)}</p>
                      <Link href={`/ordine/conferma/${lastOrder.id}`}>
                        <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold">Dettagli</Button>
                      </Link>
                   </div>
                 </>
               ) : (
                 <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground text-sm">Non hai ancora effettuato ordini.</p>
                    <Link href="/catalogo">
                       <Button variant="secondary" size="sm" className="rounded-xl font-bold">Sfoglia Catalogo</Button>
                    </Link>
                 </div>
               )}
            </div>
         </div>

         {/* Upcoming Reservation Overview */}
         <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-secondary/10 flex justify-between items-center">
               <h3 className="font-heading font-bold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Prossima Prenotazione
               </h3>
               <Link href="/account/prenotazioni" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Tutte</Link>
            </div>
            <div className="p-8 flex-grow space-y-6">
               {nextReservation ? (
                 <>
                   <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-primary border border-primary/20">
                         <span className="text-xs font-bold uppercase">{new Date(nextReservation.event_date).toLocaleDateString('it-IT', { month: 'short' })}</span>
                         <span className="text-xl font-heading font-black">{new Date(nextReservation.event_date).getDate()}</span>
                      </div>
                      <div>
                         <p className="font-bold">{nextReservation.event_type} - {nextReservation.type}</p>
                         <p className="text-sm text-muted-foreground">{new Date(nextReservation.event_date).toLocaleDateString('it-IT', { weekday: 'long' })}, ore {nextReservation.slot_start.slice(0, 5)}</p>
                      </div>
                   </div>
                   
                   <div className="bg-secondary/20 p-4 rounded-xl space-y-2">
                      <p className="text-xs font-medium text-muted-foreground leading-relaxed italic line-clamp-2">
                        "{nextReservation.notes || "Nessuna nota specificata."}"
                      </p>
                   </div>

                   <div className="pt-4 border-t border-border/30">
                      <Link href="/account/prenotazioni">
                        <Button variant="ghost" className="w-full font-bold text-primary hover:bg-primary/5">
                           Gestisci Prenotazione <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                   </div>
                 </>
               ) : (
                 <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground text-sm">Nessuna prenotazione attiva.</p>
                    <Link href="/prenota">
                       <Button variant="secondary" size="sm" className="rounded-xl font-bold">Prenota Ora</Button>
                    </Link>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
