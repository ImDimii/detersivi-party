"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Printer,
  Mail,
  Home
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string

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
            <div className="bg-primary p-12 text-white text-center space-y-4 relative">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-700" />
               </div>
               
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-2 border-white/30 shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-white" />
               </div>
               <h1 className="text-4xl font-heading font-black tracking-tighter">Ordine Ricevuto!</h1>
               <p className="text-primary-foreground/80 font-bold uppercase tracking-widest text-xs">Numero Ordine: #{orderId || 'ORD-2026-42'}</p>
            </div>

            <div className="p-8 md:p-12 space-y-12">
               {/* Summary Message */}
               <div className="text-center space-y-4">
                  <p className="text-xl font-medium leading-relaxed">
                     Grazie per aver scelto <span className="font-black text-primary">DetersiviParty</span>. Abbiamo inviato un'email di conferma a <span className="font-bold">mario@esempio.it</span>.
                  </p>
                  <p className="text-muted-foreground text-sm">Il nostro team inizierà a preparare i tuoi prodotti a breve.</p>
               </div>

               {/* Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-border/30 py-10">
                  <div className="space-y-4">
                     <div className="flex items-center space-x-3 text-primary">
                        <MapPin className="w-5 h-5" />
                        <h3 className="font-heading font-extrabold uppercase text-xs tracking-tight">Dettagli Consegna</h3>
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold">Ritiro in Negozio</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           Via Roma 123, 16038<br />
                           Santa Margherita Ligure (GE)
                        </p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center space-x-3 text-primary">
                        <Clock className="w-5 h-5" />
                        <h3 className="font-heading font-extrabold uppercase text-xs tracking-tight">Orario Previsto</h3>
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold">Lunedì 23 Marzo</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">Fascia oraria: 10:30 - 12:30</p>
                     </div>
                  </div>
               </div>

               {/* Next Steps */}
               <div className="bg-secondary/20 rounded-3xl p-8 space-y-6">
                  <h4 className="font-heading font-black uppercase text-xs tracking-widest text-muted-foreground text-center">Cosa succede ora?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { icon: Mail, label: "Controlla l'Email", text: "Riceverai aggiornamenti sullo stato." },
                       { icon: CheckCircle2, label: "Preparazione", text: "Verifichiamo lo stock e prepariamo tutto." },
                       { icon: ShoppingBag, label: "Ritiro/Consegna", text: "Ti avviseremo quando sarà pronto." },
                     ].map((step, idx) => (
                       <div key={idx} className="text-center space-y-2">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-primary border border-border/50">
                             <step.icon className="w-5 h-5" />
                          </div>
                          <p className="font-bold text-xs">{step.label}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{step.text}</p>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Actions */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/account/ordini" className="flex-grow">
                     <Button variant="outline" size="lg" className="w-full h-14 rounded-xl font-bold border-2">
                        <ArrowRight className="w-5 h-5 mr-3 rotate-180" />
                        Vai ai Miei Ordini
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
            
            <div className="bg-secondary/10 p-6 border-t border-border/30 text-center">
               <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center mx-auto">
                  <Printer className="w-4 h-4 mr-2" /> Stampa Ricevuta (PDF)
               </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
