"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Users, PartyPopper, ChevronRight, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useReservations } from "@/hooks/useReservations"
import Link from "next/link"

export default function ReservationPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [step, setStep] = useState<"calendar" | "details" | "success">("calendar")
  
  const [formData, setFormData] = useState({
    eventType: "",
    guests: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const { createReservation } = useReservations()
  const router = useRouter()

  const handleNext = async () => {
    if (step === "calendar" && date) setStep("details")
    else if (step === "details") {
      try {
        const resData = {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          event_type: formData.eventType as any,
          event_date: format(date!, "yyyy-MM-dd"),
          slot_start: formData.time === 'mattina' ? '09:00' : '16:00',
          slot_end: formData.time === 'mattina' ? '13:00' : '20:00',
          notes: formData.notes,
          type: 'consultation' as any,
          attachments: []
        }
        
        const res = await createReservation.mutateAsync(resData)
        router.push(`/prenota/conferma/${res.id}`)
      } catch (error) {
        console.error("Reservation failed:", error)
        alert("Errore durante l'invio della prenotazione. Riprova.")
      }
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-6">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest mx-auto"
             >
               <PartyPopper className="w-3 h-3" />
               <span>Organizza il tuo evento</span>
             </motion.div>
             <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight italic uppercase">
               Prenota Ora
             </h1>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
               Pianifica il tuo allestimento o prenota una consulenza gratuita con i nostri esperti per il tuo party indimenticabile.
             </p>
          </div>

          <AnimatePresence mode="wait">
             {step === "calendar" && (
                <motion.div 
                  key="calendar" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                >
                   <div className="lg:col-span-2 space-y-8">
                       <div className="bg-white rounded-3xl border border-border/50 shadow-xl p-8">
                          <div className="flex items-center space-x-3 mb-8">
                             <CalendarIcon className="w-6 h-6 text-primary" />
                             <h2 className="text-xl font-heading font-bold">Seleziona la Data</h2>
                          </div>
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            locale={it}
                            className="rounded-2xl border border-border/30 p-4 mx-auto"
                            disabled={(date) => date < new Date()}
                          />
                       </div>
                   </div>
                   
                   <div className="space-y-8">
                      <div className="bg-secondary/10 rounded-3xl p-8 border border-border/30 space-y-6 sticky top-32">
                         <div className="space-y-4">
                            <h3 className="font-heading font-bold text-lg">Perché prenotare?</h3>
                            <ul className="space-y-4">
                               {[
                                 "Consulenza personalizzata",
                                 "Anteprima allestimenti",
                                 "Preventivo gratuito immediato",
                                 "Supporto post-vendita"
                               ].map((text, i) => (
                                 <li key={i} className="flex items-start space-x-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                                    <span>{text}</span>
                                 </li>
                               ))}
                            </ul>
                         </div>
                         
                         <div className="pt-6 border-t border-border/30 space-y-4">
                            <div className="flex justify-between items-center">
                               <p className="text-sm font-bold">Data Selezionata:</p>
                               <p className="text-sm font-bold text-primary">
                                 {date ? format(date, "d MMMM yyyy", { locale: it }) : "Nessuna data"}
                               </p>
                            </div>
                            <Button 
                              className="w-full h-14 font-bold rounded-xl group overflow-hidden relative shadow-lg"
                              disabled={!date}
                              onClick={handleNext}
                            >
                               Continua alla Prenotazione
                               <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}

             {step === "details" && (
                <motion.div 
                  key="details" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-3xl mx-auto space-y-8"
                >
                   <div className="bg-white rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                      <div className="p-8 border-b bg-secondary/10 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <PartyPopper className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-heading font-bold">Dettagli Evento</h2>
                         </div>
                         <p className="text-sm font-bold text-primary">
                            {date && format(date, "dd/MM/yyyy")}
                         </p>
                      </div>
                      
                      <div className="p-8 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <Label className="flex items-center"><PartyPopper className="w-3.5 h-3.5 mr-2 text-primary" /> Tipo di Evento</Label>
                               <Select onValueChange={(v: string | null) => setFormData(p => ({ ...p, eventType: v || "" }))}>
                                  <SelectTrigger className="h-12 rounded-xl">
                                     <SelectValue placeholder="Seleziona evento" />
                                  </SelectTrigger>
                                  <SelectContent>
                                     <SelectItem value="compleanno">Compleanno</SelectItem>
                                     <SelectItem value="laurea">Laurea</SelectItem>
                                     <SelectItem value="matrimonio">Matrimonio / Anniversario</SelectItem>
                                     <SelectItem value="battesimo">Battesimo / Comunione</SelectItem>
                                     <SelectItem value="altro">Altro Evento</SelectItem>
                                  </SelectContent>
                               </Select>
                            </div>
                            <div className="space-y-2">
                               <Label className="flex items-center"><Clock className="w-3.5 h-3.5 mr-2 text-primary" /> Orario Preferito</Label>
                               <Select onValueChange={(v: string | null) => setFormData(p => ({ ...p, time: v || "" }))}>
                                  <SelectTrigger className="h-12 rounded-xl">
                                     <SelectValue placeholder="Seleziona orario" />
                                  </SelectTrigger>
                                  <SelectContent>
                                     <SelectItem value="mattina">Mattina (09:00 - 13:00)</SelectItem>
                                     <SelectItem value="pomeriggio">Pomeriggio (16:00 - 20:00)</SelectItem>
                                  </SelectContent>
                               </Select>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                            <div className="space-y-2">
                               <Label>Nome Completo</Label>
                               <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Inserisci il tuo nome" className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                               <Label>Telefono</Label>
                               <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Il tuo numero" className="h-12 rounded-xl" />
                            </div>
                         </div>
                         
                         <div className="space-y-2">
                            <Label>Note Aggiuntive</Label>
                            <Textarea 
                               name="notes" 
                               value={formData.notes} 
                               onChange={handleInputChange} 
                               placeholder="Parlaci dei tuoi desideri per l'evento o dell'allestimento che immagini..." 
                               className="min-h-[120px] rounded-2xl p-4"
                            />
                         </div>
                      </div>
                      
                      <div className="p-8 bg-secondary/5 border-t border-border/30 flex justify-between items-center">
                         <Button variant="ghost" onClick={() => setStep("calendar")} className="font-bold">
                            Modifica Data
                         </Button>
                         <Button size="lg" onClick={handleNext} className="h-14 px-12 font-bold shadow-xl rounded-xl">
                            Invia Richiesta
                         </Button>
                      </div>
                   </div>
                </motion.div>
             )}

             {step === "success" && (
                <motion.div 
                  key="success" 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-xl mx-auto text-center space-y-8 bg-white p-12 rounded-3xl border border-border/50 shadow-2xl"
                >
                   <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-12 h-12 text-success" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-3xl font-heading font-extrabold">Richiesta Ricevuta!</h2>
                      <p className="text-muted-foreground leading-relaxed">
                         Grazie per aver scelto DetersiviParty, <span className="text-foreground font-bold">{formData.name}</span>. 
                         Ti contatteremo al più presto al numero <span className="text-foreground font-bold">{formData.phone}</span> per confermare la tua prenotazione per il giorno <span className="text-foreground font-bold">{date && format(date, "dd/MM/yyyy")}</span>.
                      </p>
                   </div>
                   <div className="pt-6">
                      <Link href="/">
                         <Button variant="outline" size="lg" className="rounded-xl h-14 px-10 font-bold">Torna alla Home</Button>
                      </Link>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  )
}
