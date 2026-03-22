"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Cookie, Info, Settings, ShieldCheck } from "lucide-react"

export default function CookiesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
           <header className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto text-success">
                 <Cookie className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Cookie Policy</h1>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">Ultimo aggiornamento: Marzo 2026</p>
           </header>

           <div className="prose prose-slate max-w-none bg-white p-10 md:p-16 rounded-[3rem] border border-border/50 shadow-sm space-y-8">
              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <Info className="w-5 h-5 text-success" /> Cosa sono i Cookie?
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    I cookie sono piccoli file di testo che vengono salvati sul tuo dispositivo quando visiti un sito web. Ci aiutano a far funzionare il sito in modo efficiente e a migliorare la tua esperienza di navigazione.
                 </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                 <div className="bg-secondary/20 p-8 rounded-3xl space-y-4">
                    <h3 className="font-heading font-black text-lg">Cookie Tecnici</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">Essenziali</p>
                    <p className="text-sm text-muted-foreground">Necessari per il corretto funzionamento del sito, come la gestione del carrello e l'autenticazione.</p>
                 </div>
                 <div className="bg-secondary/20 p-8 rounded-3xl space-y-4">
                    <h3 className="font-heading font-black text-lg">Cookie Analitici</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">Facoltativi</p>
                    <p className="text-sm text-muted-foreground">Ci permettono di capire come gli utenti interagiscono con il sito per ottimizzare le prestazioni.</p>
                 </div>
              </div>

              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <Settings className="w-5 h-5 text-success" /> Gestione dei Cookie
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Puoi gestire le tue preferenze sui cookie direttamente dalle impostazioni del tuo browser o tramite il banner che compare al primo accesso. Tieni presente che disabilitando i cookie tecnici alcune funzionalità del sito potrebbero non essere disponibili.
                 </p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-success" /> Consenso
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Utilizzando il nostro sito, acconsenti all'uso dei cookie in conformità con questa policy, a meno che tu non li abbia disabilitati nel tuo browser.
                 </p>
              </section>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
