"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Info, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings } from "@/hooks/useSettings"
import { createClient } from "@/lib/supabase/client"

export default function ContattiPage() {
  const { getSettings } = useSettings()
  const settings = getSettings.data || {}
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Data State
  const [formData, setFormData] = useState({
     name: "",
     email: "",
     subject: "",
     message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    // Inserisci in Supabase "messages"
    const supabase = createClient()
    const { error } = await supabase.from('messages').insert([
       {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString()
       }
    ])

    if (error) {
       console.error(error)
       // Se la tabella non esiste, potrebbe dare errore. Mostriamo un avviso semplice.
       setSubmitError("Impossibile inviare il messaggio in questo momento. Riprova più tardi.")
       setIsSubmitting(false)
       return
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const shopAddress = settings.shop_address || "Via del Commercio, 123, 00100 Roma (RM)"
  const mapEmbedUrl = settings.map_embed_url || undefined
  const contactPhone = settings.contact_phone || "+39 06 123 4567"
  const contactEmail = settings.contact_email || "info@detersiviparty.it"
  const defaultHours = {
    'Lunedì': { open: "09:00", close: "19:30", active: true },
    'Domenica': { open: "09:00", close: "19:30", active: false }
  }
  const hours = settings.opening_hours || defaultHours

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest mx-auto"
           >
             <MessageSquare className="w-3 h-3" />
             <span>Sempre al tuo servizio</span>
           </motion.div>
           
           <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight italic uppercase">
             Contattaci
           </h1>
           
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
             Siamo qui per aiutarti a rendere ogni momento speciale. Inviaci un messaggio o chiamaci.
           </p>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Info Cards */}
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-border/50 shadow-sm space-y-4 hover:shadow-xl transition-all group">
                       <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <MapPin className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-heading font-extrabold text-lg">Vieni a trovarci</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-2">{shopAddress}</p>
                       </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-border/50 shadow-sm space-y-4 hover:shadow-xl transition-all group">
                       <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                          <Phone className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-heading font-extrabold text-lg">Chiamaci</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-2">{contactPhone}</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2rem] border border-border/50 shadow-sm flex items-start space-x-6 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0 group-hover:scale-110 transition-transform">
                       <Mail className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="font-heading font-extrabold text-lg">Scrivici un'email</h3>
                       <p className="text-sm text-muted-foreground leading-relaxed mt-1">Rispondiamo solitamente entro 24 ore lavorative.</p>
                       <p className="font-bold text-primary mt-2">{contactEmail}</p>
                    </div>
                 </div>

                 <div className="bg-secondary/20 p-8 rounded-[2rem] space-y-6">
                    <h3 className="font-heading font-extrabold text-xl flex items-center">
                       <Clock className="w-5 h-5 mr-3 text-primary" />
                       Orari di Apertura
                    </h3>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-muted-foreground">Lunedì - Sabato</span>
                          <span className={hours['Lunedì']?.active ? "font-bold" : "font-bold text-destructive"}>{hours['Lunedì']?.active ? `${hours['Lunedì'].open} - ${hours['Lunedì'].close}` : "Chiuso"}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-muted-foreground">Domenica</span>
                          <span className={hours['Domenica']?.active ? "font-bold" : "font-bold text-destructive"}>{hours['Domenica']?.active ? `${hours['Domenica'].open} - ${hours['Domenica'].close}` : "Chiuso"}</span>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-border/50 flex items-center space-x-3 text-xs text-muted-foreground italic">
                       <Info className="w-4 h-4" />
                       <span>Gli orari possono variare durante le festività.</span>
                    </div>
                 </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-2xl p-10 relative overflow-hidden">
                 <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                       <motion.form 
                         key="form"
                         initial={{ opacity: 1 }}
                         exit={{ opacity: 0, y: -20 }}
                         onSubmit={handleSubmit} 
                         className="space-y-6 relative z-10"
                       >
                          <div className="space-y-2">
                             <h2 className="text-3xl font-heading font-black tracking-tight">Inviaci un Messaggio</h2>
                             <p className="text-muted-foreground text-sm font-medium">Compila il form e ti ricontatteremo al più presto.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Mario Rossi" className="h-14 rounded-2xl bg-secondary/10 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-medium" required />
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="mario@esempio.it" className="h-14 rounded-2xl bg-secondary/10 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-medium" required />
                             </div>
                          </div>

                          <div className="space-y-2">
                             <Label htmlFor="subject">Oggetto</Label>
                             <Input id="subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="In cosa possiamo aiutarti?" className="h-14 rounded-2xl bg-secondary/10 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-medium" required />
                          </div>

                          <div className="space-y-2">
                             <Label htmlFor="message">Messaggio</Label>
                             <Textarea id="message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={5} placeholder="Scrivi qui la tua richiesta..." className="rounded-2xl bg-secondary/10 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-medium p-6" required />
                          </div>
                          
                          {submitError && (
                             <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-bold flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                                {submitError}
                             </div>
                          )}

                          <Button type="submit" size="lg" className="w-full h-16 rounded-2xl font-black text-lg gap-3 shadow-[0_16px_32px_-12px_rgba(var(--primary),0.3)] transition-all active:scale-[0.98]" disabled={isSubmitting}>
                             {isSubmitting ? "Invio in corso..." : "Invia Messaggio"}
                             {!isSubmitting && <Send className="w-5 h-5" />}
                          </Button>
                       </motion.form>
                    ) : (
                       <motion.div 
                         key="success"
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="text-center py-12 space-y-6"
                       >
                          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                             <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                             <h2 className="text-3xl font-heading font-black tracking-tight uppercase">Messaggio Inviato!</h2>
                             <p className="text-muted-foreground font-medium">Grazie per averci contattato. <br />Ti risponderemo nel minor tempo possibile.</p>
                          </div>
                          <Button variant="outline" className="h-12 rounded-xl font-bold px-8" onClick={() => setIsSubmitted(false)}>Invia un altro messaggio</Button>
                       </motion.div>
                    )}
                 </AnimatePresence>
                 
                 {/* Design elements */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -z-0" />
              </div>
           </div>
        </section>

        {/* Map Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
           <div className="bg-white rounded-[3rem] border border-border/50 h-[500px] overflow-hidden relative shadow-inner group">
              <iframe 
                 title="Google Maps Location"
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 loading="lazy" 
                 allowFullScreen 
                 referrerPolicy="no-referrer-when-downgrade" 
                 src={mapEmbedUrl && mapEmbedUrl.includes('http') ? mapEmbedUrl : `https://maps.google.com/maps?q=${encodeURIComponent(mapEmbedUrl || shopAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                 className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay with address badge */}
              <div className="absolute top-6 left-6 pointer-events-none">
                 <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-border/50 flex items-center space-x-3 shadow-xl">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span className="font-bold text-sm tracking-tight">{shopAddress}</span>
                 </div>
              </div>
           </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
