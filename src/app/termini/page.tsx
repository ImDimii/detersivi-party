"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Gavel, Scale, AlertCircle, FileCheck } from "lucide-react"

export default function TerminiPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
           <header className="text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-500">
                 <Gavel className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Termini & Condizioni</h1>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">Ultimo aggiornamento: Marzo 2026</p>
           </header>

           <div className="prose prose-slate max-w-none bg-white p-10 md:p-16 rounded-[3rem] border border-border/50 shadow-sm space-y-10 font-medium">
              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <Scale className="w-5 h-5 text-indigo-500" /> 1. Oggetto del Servizio
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    DetersiviParty offre un servizio di vendita online di detergenti, prodotti per l'igiene della casa e servizi di prenotazione allestimenti per eventi. Gli ordini possono essere ritirati in negozio o consegnati a domicilio nelle zone coperte dal servizio.
                 </p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-indigo-500" /> 2. Ordini e Prezzi
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Tutti i prezzi sono espressi in Euro e comprensivi di IVA. L'ordine si considera accettato una volta ricevuta la mail di conferma. Per gli allestimenti personalizzati, la prenotazione è soggetta a conferma manuale da parte dello staff.
                 </p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-indigo-500" /> 3. Diritto di Recesso
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                    Ai sensi del D.Lgs. 206/2005, il cliente ha diritto di recedere dall'acquisto entro 14 giorni dal ricevimento della merce, a condizione che i prodotti siano integri e sigillati. Il diritto di recesso non si applica a prodotti personalizzati o deperibili.
                 </p>
              </section>

              <section className="space-y-4 p-8 bg-indigo-50 rounded-3xl border-2 border-indigo-100">
                 <h3 className="text-lg font-black text-indigo-700">Responsabilità</h3>
                 <p className="text-sm text-indigo-600/80 leading-relaxed">
                    DetersiviParty non è responsabile per danni derivanti da un uso improprio dei prodotti venduti. Si raccomanda di leggere sempre attentamente le etichette e le istruzioni d'uso fornite dai produttori.
                 </p>
              </section>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
