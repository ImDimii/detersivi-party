"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"
import { useSettings } from "@/hooks/useSettings"

export function Hero() {
  const { data: products } = useProducts()
  const { getSettings } = useSettings()
  const settings = getSettings.data || {}
  
  const productCount = products?.length || 0
  const heroTitle = settings.hero_title || "Più pulito. Più allegro."
  const heroDescription = settings.hero_description || "Detersivi di alta qualità per la tua casa e tutto il necessario per i tuoi eventi speciali. Sfidiamo lo sporco e celebriamo i tuoi successi."
  const heroBadge = settings.hero_badge || "Nuova stagione Party attiva!"

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/30 -skew-x-12 translate-x-1/4 z-0 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-success/5 rounded-full blur-3xl z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-success" />
              <span>{heroBadge}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1]">
              {heroTitle.split('.')[0]}. <br />
              <span className="text-success italic">{heroTitle.split('.')[1] || ""}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              {heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link href="/catalogo">
                <Button size="lg" className="h-14 px-8 text-base group">
                  Sfoglia il Catalogo
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/prenota">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base">
                  <PartyPopper className="mr-2 w-5 h-5 text-success" />
                  Prenota Allestimento
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl bg-secondary/50 aspect-[4/5] flex items-center justify-center border-4 border-white">
              <img 
                src="/images/hero.png" 
                alt="DetersiviParty Hero" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            {/* Floating Badges */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-6 -right-6 bg-background p-6 rounded-2xl shadow-xl border z-20"
            >
               <p className="text-3xl font-bold text-success">+{productCount}</p>
               <p className="text-xs text-muted-foreground font-medium uppercase">Prodotti attivi</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
