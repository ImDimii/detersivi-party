"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, ShieldCheck, Users, ArrowRight, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSettings } from "@/hooks/useSettings"

export default function ChiSiamoPage() {
  const { getSettings } = useSettings()
  const settings = getSettings.data || {}
  const shopDescription = settings.shop_description || "Da semplice negozio di quartiere a punto di riferimento per l'igiene della casa e gli eventi più belli. Ecco chi siamo e perché amiamo quello che facciamo."
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest mx-auto"
           >
             <Sparkles className="w-3 h-3" />
             <span>La nostra storia</span>
           </motion.div>
           
           <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight italic uppercase">
             Chi Siamo
           </h1>
           
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
             Dal negozio di quartiere a punto di riferimento per l'igiene e gli eventi.
           </p>
        </div>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
           <h2 className="text-2xl md:text-4xl font-heading font-black tracking-tight text-primary mb-8 text-center uppercase italic">
             PIÙ PULITO. <span className="text-success not-italic tracking-normal">PIÙ ALLEGRO.</span>
           </h2>
           
           <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
             {shopDescription}
           </p>
        </section>

        {/* Vision & Mission */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5]">
                 <img 
                   src="/images/about-store.png" 
                   alt="Il nostro negozio" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     e.currentTarget.src = "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop"
                   }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12">
                     <p className="text-white text-3xl font-heading font-black tracking-tighter italic">Dal 1998 serviamo la nostra comunità con passione.</p>
                 </div>
              </div>
              
              <div className="space-y-10">
                 <div className="space-y-4">
                    <h2 className="text-4xl font-heading font-black tracking-tight text-primary">Nati per Brillare</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                       DetersiviParty nasce dal desiderio di offrire prodotti di qualità superiore per la cura della casa, 
                       unendo l'efficienza dei detergenti professionali alla gioia dei preparativi per le grandi occasioni.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                       Crediamo che una casa pulita sia il cuore di una famiglia felice, e che ogni festa meriti di essere 
                       indimenticabile. Per questo abbiamo unito questi due mondi in un unico spazio dedicato a te.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-border/50 shadow-sm space-y-3">
                       <Heart className="w-8 h-8 text-destructive" />
                       <h3 className="font-heading font-black text-lg">Passione</h3>
                       <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Amiamo quello che facciamo e si vede in ogni dettaglio.</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-border/50 shadow-sm space-y-3">
                       <ShieldCheck className="w-8 h-8 text-success" />
                       <h3 className="font-heading font-black text-lg">Qualità</h3>
                       <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Selezioniamo solo il meglio per la tua igiene e sicurezza.</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Stats */}
        <section className="bg-secondary/20 py-24 mb-32">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                 <div className="space-y-2">
                    <p className="text-6xl font-heading font-black text-primary">25+</p>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Anni di Esperienza</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-6xl font-heading font-black text-primary">10k+</p>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Clienti Felici</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-6xl font-heading font-black text-primary">500+</p>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Allestimenti fatti</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-6xl font-heading font-black text-primary">1k+</p>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Prodotti a catalogo</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Team / Community Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 text-center space-y-12">
           <div className="space-y-4">
              <Users className="w-12 h-12 text-primary mx-auto opacity-20" />
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Un Team di Esperti</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                 Non siamo solo commessi, siamo consulenti per la tua casa e creatori di sogni per i tuoi eventi. 
                 Sempre pronti a darti il consiglio giusto.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Angela", role: "Specialista Igiene", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
                { name: "Roberto", role: "Fondatore / Logistica", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
                { name: "Sofia", role: "Party Designer", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" }
              ].map((member) => (
                <div key={member.name} className="group space-y-6">
                   <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border border-border/40 relative">
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-2xl font-black">{member.name}</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-primary">{member.role}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-success rounded-[4rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-4">
                 <h2 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tight uppercase italic">Pronto per un cambiamento?</h2>
                 <p className="text-success-foreground/80 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Sfoglia il nostro catalogo o prenota oggi stesso il tuo prossimo allestimento party.
                 </p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
                 <Link href="/catalogo">
                    <Button size="lg" className="h-16 px-12 rounded-[1.5rem] font-black uppercase text-sm tracking-widest shadow-xl bg-white text-success hover:bg-white/90">
                       Vai al Catalogo <ShoppingBag className="ml-3 w-5 h-5" />
                    </Button>
                 </Link>
                 <Link href="/prenota">
                    <Button variant="outline" size="lg" className="h-16 px-12 rounded-[1.5rem] font-black uppercase text-sm tracking-widest bg-success/20 border-white/40 text-white hover:bg-white/10">
                       Prenota Ora <ArrowRight className="ml-3 w-5 h-5" />
                    </Button>
                 </Link>
              </div>
           </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
