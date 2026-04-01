"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductPreview } from "@/components/shared/ProductPreview"
import { useProducts } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"
import { Input } from "@/components/ui/input"
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function DynamicCatalogPage() {
  const params = useParams()
  const routeCategorySlug = params?.categoria as string | undefined

  const [search, setSearch] = useState("")
  const [categorySlug, setCategorySlug] = useState<string | undefined>(routeCategorySlug)
  const [maxPrice, setMaxPrice] = useState<number>(100)

  // Resync if route changes
  useEffect(() => {
     if (routeCategorySlug) setCategorySlug(routeCategorySlug)
  }, [routeCategorySlug])
  
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'created_at'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: categories } = useCategories()
  const { data: products, isLoading } = useProducts({ 
    search, 
    categorySlug,
    maxPrice,
    sortBy,
    sortOrder
  })

  // Helper for human-friendly sort labels
  const getSortLabel = () => {
    if (sortBy === 'created_at') return "Più recenti"
    if (sortBy === 'price' && sortOrder === 'asc') return "Prezzo: Dal più basso"
    if (sortBy === 'price' && sortOrder === 'desc') return "Prezzo: Dal più alto"
    if (sortBy === 'name') return "Nome: A-Z"
    return "Ordina per"
  }

  const currentCategory = categories?.find(c => c.slug === categorySlug)

  return (
    <main className="flex-grow bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-12 border-b bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
               <h1 className="text-4xl font-heading font-extrabold tracking-tight">{currentCategory ? currentCategory.name : "Il Nostro Catalogo"}</h1>
               <p className="text-muted-foreground">{currentCategory?.description || `Sfoglia tra oltre ${products?.length || 0} prodotti disponibili per la tua casa e i tuoi party.`}</p>
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
                  variant={!categorySlug ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start font-medium"
                  onClick={() => {
                     setCategorySlug(undefined)
                     window.history.pushState({}, '', '/catalogo') // Update URL cosmetically
                  }}
                >
                  Tutte le Categorie
                </Button>
                {categories?.map((cat) => (
                  <Button 
                    key={cat.id}
                    variant={categorySlug === cat.slug ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start font-medium"
                    onClick={() => {
                       setCategorySlug(cat.slug)
                       window.history.pushState({}, '', `/catalogo/${cat.slug}`)
                    }}
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
                  <Link href="/prenota" className="block w-full">
                     <Button variant="secondary" className="w-full font-bold">Prenota Ora</Button>
                  </Link>
               </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
               <p className="text-sm text-muted-foreground font-medium">Mostrando {products?.length || 0} risultati</p>
               <DropdownMenu>
                  <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-bold")}>
                     {getSortLabel()} <ChevronDown className="ml-2 w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 bg-white border shadow-xl z-50">
                     <DropdownMenuItem onClick={() => { setSortBy('created_at'); setSortOrder('desc'); }} className="p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        Più recenti
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => { setSortBy('price'); setSortOrder('asc'); }} className="p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        Prezzo: Dal più basso
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => { setSortBy('price'); setSortOrder('desc'); }} className="p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        Prezzo: Dal più alto
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('asc'); }} className="p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        Nome: A-Z
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
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
