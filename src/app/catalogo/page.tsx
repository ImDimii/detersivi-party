"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductPreview } from "@/components/shared/ProductPreview"
import { useProducts } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { Input } from "@/components/ui/input"
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CatalogPage() {
  const [search, setSearch] = useState("")
  const [categorySlug, setCategorySlug] = useState<string | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number>(100)
  
  const { data: categories } = useCategories()
  const { data: products, isLoading } = useProducts({ 
    search, 
    categorySlug,
    maxPrice
  })

  return (
    <main className="flex-grow bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-12 border-b bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
               <h1 className="text-4xl font-heading font-extrabold tracking-tight">Il Nostro Catalogo</h1>
               <p className="text-muted-foreground">Sfoglia tra oltre {products?.length || 0} prodotti disponibili per la tua casa e i tuoi party.</p>
            </div>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cerca un prodotto..." 
                className="pl-10 h-12 rounded-xl bg-background border-border/50 focus:ring-primary shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-10 shrink-0">
            {/* Categories Filter */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Categorie
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <Button 
                  variant={categorySlug === undefined ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start font-medium"
                  onClick={() => setCategorySlug(undefined)}
                >
                  Tutte le Categorie
                </Button>
                {categories?.map((cat) => (
                  <Button 
                    key={cat.id}
                    variant={categorySlug === cat.slug ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start font-medium"
                    onClick={() => setCategorySlug(cat.slug)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
               <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2" /> Budget Massimo
              </h3>
              <div className="space-y-4 pt-2">
                 <input 
                    type="range" 
                    min="1" 
                    max="200" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary" 
                 />
                 <div className="flex justify-between text-xs font-bold font-mono text-muted-foreground">
                    <span>€1</span>
                    <span className="text-primary bg-primary/10 px-2 py-1 rounded">€{maxPrice}</span>
                    <span>€200+</span>
                 </div>
              </div>
            </div>
            
            <div className="pt-4 hidden lg:block">
               <div className="p-6 rounded-2xl bg-primary text-primary-foreground space-y-4 shadow-xl">
                  <h4 className="font-heading font-bold">Consulenza Party</h4>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">Personalizziamo il tuo evento con allestimenti unici.</p>
                  <Button variant="secondary" className="w-full font-bold">Prenota Ora</Button>
               </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
               <p className="text-sm text-muted-foreground font-medium">Mostrando {products?.length || 0} risultati</p>
               <Button variant="ghost" size="sm" className="font-bold">
                  Ordina per <ChevronDown className="ml-2 w-4 h-4" />
               </Button>
            </div>
            
            <ProductPreview 
              products={products || []} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
