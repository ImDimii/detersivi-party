"use client"

import { 
  BookOpen, 
  Settings, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  Truck, 
  Bell,
  Palette,
  Package,
  Calendar,
  Users,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDocumentationPage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-extrabold tracking-tight">Documentazione Admin</h1>
           <p className="text-muted-foreground">Guida all'uso del pannello di controllo DetersiviParty, spiegazioni dei moduli e procedure operative.</p>
        </div>
        <Link href="/admin/impostazioni">
          <Button variant="outline" className="font-bold h-12 rounded-xl">
            Torna alle Impostazioni
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-8">
            {/* Section 1: Panoramica */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 space-y-6">
               <h2 className="text-2xl font-heading font-extrabold flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-primary" /> Panoramica del Sistema
               </h2>
               <p className="text-muted-foreground leading-relaxed">
                  Il pannello di amministrazione permette di gestire l'intera flotta di ordini e-commerce, tracciare gli allestimenti, approvare le prenotazioni, e configurare dinamicamente ciò che i clienti vedono sul sito.
               </p>
               <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-start gap-4">
                  <Info className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                     Molti dati (es. ordini, clienti e impostazioni del sito) interagiscono in tempo reale. Le modifiche fatte alle impostazioni vengono propagate istantaneamente al carrello e al checkout clienti.
                  </p>
               </div>
            </div>

            {/* Section 2: Gestione Ordini */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 space-y-6">
               <h2 className="text-2xl font-heading font-extrabold flex items-center">
                  <Package className="w-6 h-6 mr-3 text-blue-500" /> Flusso E-commerce (Ordini)
               </h2>
               <p className="text-muted-foreground leading-relaxed">
                  Ogni volta che un cliente compila il checkout, un Ordine scende nel database in stato <strong className="text-blue-500">received</strong>.
               </p>
               <ul className="space-y-4">
                  <li className="flex gap-4">
                     <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                     <div>
                        <strong className="block text-foreground mb-1">In Preparazione <span className="text-xs text-muted-foreground font-normal">(preparing)</span></strong>
                        <span className="text-sm text-muted-foreground">Appena accetti di elaborare l'ordine, passa a "In Preparazione". Il cliente noterà il colore arancione.</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <span className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                     <div>
                        <strong className="block text-foreground mb-1">Pronto per il ritiro <span className="text-xs text-muted-foreground font-normal">(ready)</span></strong>
                        <span className="text-sm text-muted-foreground">Se era un ordine con ritiro in negozio, imposta lo stato su "Pronto". Il badge diventerà verde allertando il cliente per il ritiro.</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                     <div>
                        <strong className="block text-foreground mb-1">In Consegna <span className="text-xs text-muted-foreground font-normal">(delivering)</span></strong>
                        <span className="text-sm text-muted-foreground">Al contrario, se si tratta di domicilio (solo a CAP abilitati), imposta "In Consegna" quando il corriere/fattorino parte.</span>
                     </div>
                  </li>
               </ul>
            </div>

            {/* Section 3: Prenotazioni Eventi */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 space-y-6">
               <h2 className="text-2xl font-heading font-extrabold flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-purple-500" /> Prenotazioni Eventi e Feste
               </h2>
               <p className="text-muted-foreground leading-relaxed">
                  Le prenotazioni per allestimenti o eventi arrivano in stato di <strong className="text-amber-500">pending</strong> (Attesa). La piattaforma permette di visionare conflitti direttamente dalla tab Calendario in App.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-2xl">
                     <h4 className="font-bold text-success flex items-center"><Clock className="w-4 h-4 mr-2" /> Conferma Attiva</h4>
                     <p className="text-xs mt-2 text-muted-foreground">Approva esplicitamente gli slot usando lo switch Confermato per allertare il cliente sull'area account. Non appena accettato l'appuntamento assume priorità per quel giorno.</p>
                  </div>
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                     <h4 className="font-bold text-destructive flex items-center"><Settings className="w-4 h-4 mr-2" /> Rifiuto</h4>
                     <p className="text-xs mt-2 text-muted-foreground">Le richieste non consone possono essere rifiutate causando la recessione del cliente via mail e il reset dello stato a Cancellato.</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Nav */}
         <aside className="space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white space-y-6 shadow-xl relative overflow-hidden group border border-indigo-500">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <BookOpen className="w-32 h-32" />
               </div>
               <div className="space-y-2 relative z-10">
                  <h4 className="text-xl font-heading font-extrabold uppercase tracking-tight">Manuale v.1.0</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                    Aggiornato l'ultima volta: {new Date().toLocaleDateString()}
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-6 space-y-4">
               <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Configurazioni Veloci</h3>
               <Link href="/admin/impostazioni" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20"><Truck className="w-4 h-4 text-primary" /></div>
                  <span className="text-sm font-medium">Modifica Costo di Consegna</span>
               </Link>
               <Link href="/admin/impostazioni" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20"><MapPin className="w-4 h-4 text-primary" /></div>
                  <span className="text-sm font-medium">Aggiungi CAP Spedizione</span>
               </Link>
               <Link href="/admin/impostazioni" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20"><Settings className="w-4 h-4 text-primary" /></div>
                  <span className="text-sm font-medium">Protocollo SMTP per Email</span>
               </Link>
            </div>
         </aside>
      </div>
    </div>
  )
}
