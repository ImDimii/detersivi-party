"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Shield, Lock, Eye, FileText } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

export default function PrivacyPage() {
  const { getSettings } = useSettings()
  const settings = getSettings.data || {}
  const shopName = settings.shop_name || "DetersiviParty"
  const shopEmail = settings.contact_email || "info@detersiviparty.it"
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
           <header className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                 <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Privacy Policy</h1>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">Ultimo aggiornamento: Marzo 2026</p>
           </header>

           <div className="prose prose-slate max-w-none bg-white p-10 md:p-16 rounded-[3rem] border border-border/50 shadow-sm space-y-8">
              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <Eye className="w-5 h-5 text-primary" /> 1. Introduzione
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Benvenuti su {shopName}. La tua privacy è estremamente importante per noi. Questa politica spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali quando utilizzi il nostro sito web e i nostri servizi.
                 </p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" /> 2. Dati Raccolti
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Raccogliamo i dati necessari per fornirti i nostri servizi, tra cui:
                 </p>
                 <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Dati Identificativi: nome, cognome, indirizzo email.</li>
                    <li>Dati di Contatto: numero di telefono, indirizzo di spedizione/ritiro.</li>
                    <li>Dati di Transazione: cronologia degli ordini e delle prenotazioni.</li>
                    <li>Dati Tecnici: indirizzo IP, tipo di browser, navigazione sul sito.</li>
                 </ul>
              </section>

              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" /> 3. Sicurezza dei Dati
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Adottiamo misure di sicurezza tecniche e organizzative rigorose per proteggere i tuoi dati da accessi non autorizzati, furti o alterazioni. Utilizziamo crittografia SSL avanzata per tutte le transazioni.
                 </p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" /> 4. I tuoi diritti
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    In conformità con il GDPR (Regolamento UE 2016/679), hai il diritto di accedere, rettificare, cancellare o limitare il trattamento dei tuoi dati. Puoi esercitare questi diritti contattandoci direttamente a <span className="font-bold">{shopEmail}</span>.
                 </p>
              </section>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
