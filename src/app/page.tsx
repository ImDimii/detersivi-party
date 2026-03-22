"use client"

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { CategoryPreview } from "@/components/shared/CategoryPreview";
import { ProductPreview } from "@/components/shared/ProductPreview";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: categories, isLoading: isLoadingCats } = useCategories()
  const { data: featuredProducts, isLoading: isLoadingProducts } = useProducts({ isFeatured: true })

  return (
    <main className="flex-grow">
      <Navbar />
      <Hero />
      
      {/* Categories Preview */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">Esplora le Categorie</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Dai prodotti per la cura quotidiana della tua casa ai dettagli che rendono unica ogni tua festa.
            </p>
          </div>
          
          <CategoryPreview 
            categories={categories || []} 
            isLoading={isLoadingCats} 
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">Prodotti in Evidenza</h2>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                I nostri articoli più venduti e le novità appena arrivate in negozio.
              </p>
            </div>
            <Link 
              href="/catalogo" 
              className="text-primary font-bold flex items-center group hover:underline underline-offset-4"
            >
              Vedi tutto il catalogo
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <ProductPreview 
            products={featuredProducts || []} 
            isLoading={isLoadingProducts} 
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-y bg-secondary/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div className="space-y-4">
                  <div className="text-primary font-heading font-bold text-4xl">01</div>
                  <h3 className="text-xl font-bold">Qualità Certificata</h3>
                  <p className="text-muted-foreground">Selezioniamo solo i migliori marchi per garantire risultati professionali a casa tua.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-success font-heading font-bold text-4xl">02</div>
                  <h3 className="text-xl font-bold">Passione Party</h3>
                  <p className="text-muted-foreground">Creiamo allestimenti su misura per rendere indimenticabile ogni tua celebrazione.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-primary font-heading font-bold text-4xl">03</div>
                  <h3 className="text-xl font-bold">Servizio Locale</h3>
                  <p className="text-muted-foreground">Siamo presenti sul territorio per offrirti assistenza diretta e consegne rapide.</p>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
