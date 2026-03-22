"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductPreview } from "@/components/shared/ProductPreview"
import { useProducts } from "@/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { Tag, Sparkles, Zap, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function OffertePage() {
  const { data: products, isLoading } = useProducts({ 
    hasDiscount: true,
    status: 'published'
  })

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center space-x-2 px-4 py-1.5 bg-destructive/10 rounded-full text-[10px] font-black text-destructive uppercase tracking-widest border border-destructive/10 mx-auto"
           >
             <Zap className="w-4 h-4 fill-current" />
             <span>Sconti Imperdibili</span>
           </motion.div>
           
           <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight italic">
             OFFERTE <span className="text-primary not-italic">DI OGGI</span>
           </h1>
           
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
             Tutto il meglio per la tua casa e i tuoi party a prezzi incredibili. 
             Affrettati, le scorte sono limitate!
           </p>
        </div>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-[2rem] border border-border/50 shadow-sm p-8 md:p-12">
              <div className="flex items-center space-x-3 mb-12">
                 <Tag className="w-6 h-6 text-primary" />
                 <h2 className="text-2xl font-heading font-black uppercase tracking-tight">Articoli in Promozione</h2>
              </div>

              <ProductPreview products={products || []} isLoading={isLoading} />
           </div>
        </section>

        {/* Newsletter / Call to Action */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
           <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden group shadow-[0_32px_64px_-12px_rgba(var(--primary),0.3)]">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                 <Sparkles className="w-64 h-64" />
              </div>
              <div className="relative z-10 space-y-4">
                 <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Vuoi saperlo prima degli altri?</h2>
                 <p className="text-primary-foreground/80 text-lg font-medium max-w-lg mx-auto">
                    Iscriviti alla nostra newsletter per ricevere in anteprima le offerte lampo e i nuovi arrivi della stagione.
                 </p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                 <input 
                   type="email" 
                   placeholder="La tua email..." 
                   className="h-14 px-8 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white focus:text-primary transition-all flex-grow font-bold outline-none" 
                 />
                 <Button variant="secondary" size="lg" className="h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
                    Iscriviti <ArrowRight className="ml-2 w-4 h-4" />
                 </Button>
              </div>
           </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
