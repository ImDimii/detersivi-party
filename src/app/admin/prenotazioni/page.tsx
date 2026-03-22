"use client"

import { useState } from "react"
import { 
  Calendar, 
  Search, 
  MoreVertical, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Users,
  PartyPopper,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Info
} from "lucide-react"
import { useReservations } from "@/hooks/useReservations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useToast } from "@/hooks/useToast"
import { CustomModal } from "@/components/ui/CustomModal"

export default function AdminReservationsPage() {
  const { getReservations, updateReservationStatus } = useReservations()
  const { addToast } = useToast()
  const [view, setView] = useState<"list" | "calendar">("list")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const reservations = getReservations.data || []
  
  const filteredReservations = reservations.filter(r => 
    statusFilter === "all" ? true : r.status === statusFilter
  )

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateReservationStatus.mutateAsync({ id, status: status as any })
      addToast(`Prenotazione ${status === 'confirmed' ? 'confermata' : status}`, "success")
    } catch (err: any) {
      addToast("Errore aggiornamento: " + err.message, "error")
    }
  }

  const handleCancelReservation = async () => {
    if (!reservationToCancel) return
    setIsCancelling(true)
    try {
      await updateReservationStatus.mutateAsync({ id: reservationToCancel, status: 'cancelled' })
      addToast("Prenotazione annullata", "success")
    } catch (err: any) {
      addToast("Errore annullamento: " + err.message, "error")
    } finally {
      setIsCancelling(false)
      setReservationToCancel(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-200"
      case "confirmed": return "bg-success/10 text-success border-success/20"
      case "rejected": return "bg-destructive/10 text-destructive border-destructive/20"
      case "completed": return "bg-secondary text-muted-foreground border-border/50"
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20"
      default: return "bg-secondary text-muted-foreground"
    }
  }

  const stats = [
    { label: "Oggi", value: reservations.filter(r => new Date(r.event_date).toDateString() === new Date().toDateString()).length.toString(), icon: Clock, color: "text-primary" },
    { label: "In Attesa", value: reservations.filter(r => r.status === 'pending').length.toString(), icon: AlertCircle, color: "text-amber-500" },
    { label: "Confermate", value: reservations.filter(r => r.status === 'confirmed').length.toString(), icon: CheckCircle2, color: "text-success" },
    { label: "Totali", value: reservations.length.toString(), icon: Users, color: "text-indigo-500" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-extrabold tracking-tight">Prenotazioni</h1>
           <p className="text-muted-foreground">Gestisci il calendario degli appuntamenti e degli allestimenti.</p>
        </div>
        <Tabs value={view} onValueChange={(v: any) => setView(v)} className="bg-white p-1 rounded-xl border border-border/50 shadow-sm h-14">
           <TabsList className="grid grid-cols-2 bg-transparent h-full p-0">
              <TabsTrigger value="list" className="rounded-lg font-bold text-xs uppercase h-full data-[state=active]:bg-primary data-[state=active]:text-white">Lista</TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-lg font-bold text-xs uppercase h-full data-[state=active]:bg-primary data-[state=active]:text-white">Calendario</TabsTrigger>
           </TabsList>
        </Tabs>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {stats.map((stat) => (
           <div key={stat.label} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${stat.color} bg-current/10`}>
                 <stat.icon className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                 <p className="text-xl font-heading font-extrabold">{getReservations.isLoading ? "..." : stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {view === "list" ? (
        <div className="space-y-6">
           {getReservations.isLoading ? (
              [1, 2].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border" />)
           ) : filteredReservations.map((res) => (
             <div key={res.id} className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col md:flex-row">
                <div className={`p-8 md:w-48 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/30 ${res.status === 'confirmed' ? 'bg-success/5' : 'bg-amber-500/5'}`}>
                   <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{new Date(res.event_date).toLocaleDateString('it-IT', { month: 'long' })}</span>
                   <span className="text-4xl font-heading font-black text-foreground">{new Date(res.event_date).getDate()}</span>
                   <span className="text-xs font-bold text-muted-foreground uppercase">{res.slot_start}</span>
                </div>
                
                <div className="p-8 flex-grow space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <div className="flex items-center space-x-2">
                            <PartyPopper className="w-4 h-4 text-primary" />
                            <h3 className="text-xl font-heading font-extrabold">{res.customer_name}</h3>
                         </div>
                         <div className="flex items-center text-sm font-medium text-muted-foreground">
                            <span className="bg-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase mr-3">{res.type}</span>
                            Evento: <span className="capitalize ml-1 font-bold text-foreground">{res.event_type}</span>
                         </div>
                      </div>
                      <div className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${getStatusColor(res.status)}`}>
                         {res.status === 'confirmed' ? 'Confermata' : res.status === 'pending' ? 'Da Approvare' : res.status === 'cancelled' ? 'Annullata' : res.status}
                      </div>
                   </div>

                   <p className="text-sm text-muted-foreground line-clamp-2 italic">
                      "{res.notes || "Nessuna nota aggiuntiva."}"
                   </p>

                   <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/30">
                      <Button variant="outline" className="h-11 rounded-xl font-bold flex-grow">
                         <Eye className="w-4 h-4 mr-3" /> Vedi Dettagli
                      </Button>
                      <div className="flex gap-2 flex-grow">
                         {res.status === 'pending' && (
                            <>
                               <Button 
                                  onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                                  className="bg-success hover:bg-success/90 h-11 rounded-xl font-bold flex-grow text-white"
                               >
                                  Accetta
                               </Button>
                               <Button 
                                  onClick={() => setReservationToCancel(res.id)}
                                  variant="ghost" 
                                  className="text-destructive hover:bg-destructive/5 h-11 rounded-xl font-bold border border-destructive/20"
                               >
                                  <XCircle className="w-4 h-4" />
                               </Button>
                            </>
                         )}
                         {res.status === 'confirmed' && (
                            <Button variant="secondary" className="h-11 rounded-xl font-bold flex-grow">
                               Invia Promemoria
                            </Button>
                         )}
                      </div>
                   </div>
                </div>
             </div>
           ))}
           {!getReservations.isLoading && filteredReservations.length === 0 && (
             <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-20 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="font-bold">Nessuna prenotazione trovata</p>
             </div>
           )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-border/50 shadow-xl p-12 text-center space-y-6">
           <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Calendar className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-heading font-extrabold">Vista Calendario</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">La vista calendario interattiva sarà disponibile a breve per una gestione visuale degli slot orari.</p>
           </div>
           <Button variant="secondary" onClick={() => setView("list")} className="font-bold">Torna alla Lista</Button>
        </div>
      )}

      <CustomModal 
        isOpen={!!reservationToCancel}
        onClose={() => setReservationToCancel(null)}
        onConfirm={handleCancelReservation}
        title="Annulla Prenotazione"
        description="Sei sicuro di voler annullare questa prenotazione? Questa azione non può essere annullata."
        confirmText="Annulla"
        variant="destructive"
        isLoading={isCancelling}
      />
    </div>
  )
}

