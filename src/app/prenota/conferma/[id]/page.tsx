"use client"

import { useParams } from "next/navigation"
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
  Bell
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ReservationConfirmationPage() {
  const params = useParams()
  const resId = params.id as string

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
            {/* Success Header */}
            <div className="bg-success p-12 text-white text-center space-y-4 relative">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl" />
               </div>
               
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-2 border-white/30 shadow-xl">
                  <PartyPopper className="w-10 h-10 text-white" />
               </div>
               <h1 className="text-4xl font-heading font-black tracking-tighter">Prenotazione Inviata!</h1>
               <p className="text-success-foreground/80 font-bold uppercase tracking-widest text-xs">ID Prenotazione: #{resId || 'PRN-2026-42'}</p>
            </div>

            <div className="p-8 md:p-12 space-y-12">
               {/* Summary Message */}
               <div className="text-center space-y-4">
                  <p className="text-xl font-medium leading-relaxed">
                     Richiesta di prenotazione inviata con successo. Riceverai una conferma via email non appena l'admin avrà approvato lo slot.
                  </p>
               </div>

               {/* Details Grid */}
               <div className="bg-secondary/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-2">
                     <Calendar className="w-5 h-5 mx-auto text-success" />
                     <p className="text-xs font-bold uppercase text-muted-foreground">Data</p>
                     <p className="font-bold">28 Marzo 2026</p>
                  </div>
                  <div className="text-center space-y-2">
                     <Clock className="w-5 h-5 mx-auto text-success" />
                     <p className="text-xs font-bold uppercase text-muted-foreground">Orario</p>
                     <p className="font-bold">10:30 - 11:30</p>
                  </div>
                  <div className="text-center space-y-2">
                     <MapPin className="w-5 h-5 mx-auto text-success" />
                     <p className="text-xs font-bold uppercase text-muted-foreground">Luogo</p>
                     <p className="font-bold">In Negozio</p>
                  </div>
               </div>

               {/* Important Note */}
               <div className="p-6 bg-amber-500/5 border border-amber-200 rounded-2xl flex items-start space-x-4">
                  <Bell className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                  <div className="space-y-1">
                     <p className="font-bold text-amber-700">Nota Importante</p>
                     <p className="text-sm text-amber-600/80 leading-relaxed">
                        Ti ricordiamo che la prenotazione è soggetta ad approvazione. Controlla la tua email nelle prossime 24 ore per la conferma definitiva.
                     </p>
                  </div>
               </div>

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
