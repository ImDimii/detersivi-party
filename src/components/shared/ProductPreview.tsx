"use client"

import Link from "next/link"
import { ShoppingCart, Eye } from "lucide-react"
import { Product } from "@/types/database"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"

interface ProductPreviewProps {
  products: (Product & { categories: { name: string, slug: string } })[]
  isLoading: boolean
}

export function ProductPreview({ products, isLoading }: ProductPreviewProps) {
  const { addItem } = useCart()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-secondary rounded-2xl animate-pulse" />
            <div className="h-4 bg-secondary rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-secondary rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-secondary rounded w-1/4 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) return (
    <div className="text-center py-12 text-muted-foreground">
      Nessun prodotto trovato.
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group space-y-4">
          <div className="aspect-square bg-secondary rounded-2xl overflow-hidden border border-border/50 relative">
             {/* Badges */}
             <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.is_new && (
                  <span className="bg-success text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Novità
                  </span>
                )}
                {product.price_original && (
                  <span className="bg-destructive text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Sconto
                  </span>
                )}
             </div>

             {/* Actions */}
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-2">
                <Link href={`/prodotto/${product.slug}`}>
                  <Button variant="secondary" size="icon" className="rounded-full shadow-lg">
                    <Eye className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full shadow-lg"
                  onClick={() => addItem(product)}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
             </div>

             {/* Image */}
             {Array.isArray(product.images) && product.images[0] ? (
               <img 
                 src={product.images[0] as string} 
                 alt={product.name} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-xs">
                 Nessuna foto
               </div>
             )}
          </div>
          
          <div className="space-y-1 px-1">
             <Link href={product.categories?.slug ? `/catalogo/${product.categories.slug}` : '#'}>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest hover:text-primary">
                  {product.categories?.name || 'Senza categoria'}
                </p>
             </Link>
             <Link href={`/prodotto/${product.slug}`}>
                <h3 className="font-bold text-lg leading-tight hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
             </Link>
             <div className="flex items-center gap-2">
                <p className="font-heading font-extrabold text-xl">
                  €{Number(product.price).toFixed(2)}
                </p>
                {product.price_original && (
                  <p className="text-muted-foreground line-through text-sm">
                    €{Number(product.price_original).toFixed(2)}
                  </p>
                )}
             </div>
          </div>
        </div>
      ))}
    </div>
  )
}
