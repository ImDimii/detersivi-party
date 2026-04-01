"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  PartyPopper,
  Mail,
  Home,
  CheckCircle2,
  Bell,
  AlertCircle,
  XCircle,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSettings } from "@/hooks/useSettings"

interface ReservationData {
  id: string
  reservation_number: string
  customer_name: string
  type: string
  event_type: string
  event_date: string
  slot_start: string
  slot_end: string
  location: string | null
  status: string
  created_at: string
}

export default function ReservationConfirmationPage() {
  const params = useParams()
  const resId = params.id as string
  const supabase = createClient()

  const [res, setRes] = useState<ReservationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getSettings } = useSettings()
  const settings = getSettings.data || {}
  const shopName = settings.shop_name || "DetersiviParty"

  useEffect(() => {
    if (!resId) return
    supabase
      .from("reservations")
      .select("*")
      .eq("id", resId)
      .single()
      .then(({ data, error }) => {
        if (error) setError("Prenotazione non trovata.")
        else setRes(data as ReservationData)
        setLoading(false)
      })
  }, [resId])

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !res) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          <PartyPopper className="w-16 h-16 text-muted-foreground opacity-50" />
          <h1 className="text-2xl font-black font-heading text-muted-foreground">{error || "Errore sconosciuto"}</h1>
          <Link href="/account/prenotazioni">
            <Button>Torna alle Prenotazioni</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const getStatusConfig = () => {
    switch (res.status) {
      case "confirmed":
        return {
          bgClass: "bg-success",
          icon: <CheckCircle2 className="w-10 h-10 text-success" />,
          title: "Prenotazione Confermata!",
          message: "Ottime notizie! Il tuo evento è stato approvato dall'amministratore.",
          note: { bg: "bg-success/10 border-success/20", icon: <CheckCircle2 className="text-success" />, text: "Preparati per il grande giorno! Contattaci per qualsiasi variazione." }
        }
      case "pending":
        return {
          bgClass: "bg-amber-500",
          icon: <Clock className="w-10 h-10 text-amber-500" />,
          title: "In Attesa di Conferma",
          message: "Richiesta ricevuta. Un admin valuterà la disponibilità dello slot a breve.",
          note: { bg: "bg-amber-500/10 border-amber-200", icon: <Bell className="text-amber-500" />, text: "Riceverai un'email non appena lo status cambierà in 'Confermato'. Controlla l'area clienti." }
        }
        return {
          bgClass: "bg-secondary",
          icon: <PartyPopper className="w-10 h-10 text-muted-foreground" />,
          title: "Evento Completato",
          message: `Questo evento si è già concluso. Grazie per aver scelto ${shopName}!`,
          note: null
        }
      case "cancelled": case "rejected":
        return {
          bgClass: "bg-destructive",
          icon: <XCircle className="w-10 h-10 text-destructive" />,
          title: "Prenotazione Annullata",
          message: "La prenotazione è stata annullata o rifiutata.",
          note: { bg: "bg-destructive/10 border-destructive/20", icon: <AlertCircle className="text-destructive" />, text: "Se si tratta di un errore o desideri riprenotare, torna al calendario principale." }
        }
      default:
        return {
          bgClass: "bg-primary",
          icon: <PartyPopper className="w-10 h-10 text-primary" />,
          title: "Prenotazione Registrata",
          message: "Lo stato della prenotazione è attualmente sconosciuto.",
          note: null
        }
    }
  }

  const config = getStatusConfig()

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`${config.bgClass} p-12 text-center space-y-4 relative overflow-hidden`}>
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl" />
               </div>
               
               <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto border-2 border-white/30 z-10 relative">
                  {config.icon}
               </div>
               <h1 className={`text-4xl font-heading font-black tracking-tighter relative z-10 ${res.status === 'completed' ? 'text-foreground' : 'text-white'}`}>{config.title}</h1>
               <p className={`font-bold uppercase tracking-widest text-xs relative z-10 ${res.status === 'completed' ? 'text-muted-foreground' : 'text-white/80'}`}>ID Prenotazione: #{res.reservation_number}</p>
            </div>

            <div className="p-8 md:p-12 space-y-12">
               {/* Summary */}
               <div className="text-center space-y-4">
                  <p className="text-xl font-medium leading-relaxed">
                     {config.message}
                  </p>
               </div>

               {/* Details Grid */}
               <div className="bg-secondary/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border border-border/50 shadow-sm">
                  <div className="text-center space-y-2">
                     <Calendar className={`w-5 h-5 mx-auto ${res.status === 'completed' ? 'text-muted-foreground' : 'text-primary'}`} />
                     <p className="text-xs font-bold uppercase text-muted-foreground">Data</p>
                     <p className="font-bold">{new Date(res.event_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-center space-y-2">
                     <Clock className={`w-5 h-5 mx-auto ${res.status === 'completed' ? 'text-muted-foreground' : 'text-primary'}`} />
                     <p className="text-xs font-bold uppercase text-muted-foreground">Orario</p>
                     <p className="font-bold">{res.slot_start.slice(0, 5)} - {res.slot_end.slice(0, 5)}</p>
                  </div>
                  <div className="text-center space-y-2">
                     <MapPin className={`w-5 h-5 mx-auto ${res.status === 'completed' ? 'text-muted-foreground' : 'text-primary'}`} />
                     <p className="text-xs font-bold uppercase text-muted-foreground">Luogo</p>
                     <p className="font-bold capitalize">{res.location || "In Negozio"}</p>
                  </div>
               </div>

               {/* Note */}
               {config.note && (
                  <div className={`p-6 border rounded-2xl flex items-start space-x-4 ${config.note.bg}`}>
                     <div className="w-6 h-6 shrink-0 mt-1">{config.note.icon}</div>
                     <div className="space-y-1">
                        <p className="font-bold">Info</p>
                        <p className="text-sm opacity-80 leading-relaxed">
                           {config.note.text}
                        </p>
                     </div>
                  </div>
               )}

               {/* Actions */}
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/account/prenotazioni" className="flex-grow">
                     <Button variant="outline" size="lg" className="w-full h-14 rounded-xl font-bold border-2">
                        Le Mie Prenotazioni
                     </Button>
                  </Link>
                  <Link href="/" className="flex-grow">
                     <Button size="lg" className="w-full h-14 rounded-xl font-bold shadow-xl">
                        <Home className="w-5 h-5 mr-3" />
                        Torna alla Home
                     </Button>
                  </Link>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

