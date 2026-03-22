import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ShoppingCart, Check, AlertTriangle, Truck, ShieldCheck, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductPreview } from "@/components/shared/ProductPreview"
import { AddToCartButton } from "@/components/shared/AddToCartButton"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch related products (same category, excluding current product)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.stock_alert_threshold
  const isOutOfStock = product.stock_quantity <= 0

  return (
    <main className="flex-grow bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-primary transition-colors">Catalogo</Link>
            <span>/</span>
            <Link href={`/catalogo/${product.categories.slug}`} className="hover:text-primary transition-colors">
              {product.categories.name}
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Gallery Placeholder */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary rounded-3xl overflow-hidden border border-border/50 relative">
                 {Array.isArray(product.images) && product.images[0] ? (
                   <img 
                     src={product.images[0] as string} 
                     alt={product.name} 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">
                     Nessuna immagine disponibile
                   </div>
                 )}
              </div>
              {/* Thumbnails placeholder */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-secondary/50 rounded-xl border border-border/50" />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                   {product.is_new && (
                     <span className="bg-success/10 text-success px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                       Novità
                     </span>
                   )}
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                     SKU: {product.sku || 'N/D'}
                   </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-heading font-extrabold text-primary">
                    €{Number(product.price).toFixed(2)}
                  </p>
                  {product.price_original && (
                    <p className="text-xl text-muted-foreground line-through">
                      €{Number(product.price_original).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="prose prose-sm text-muted-foreground max-w-none">
                <p className="text-lg leading-relaxed">{product.description_short}</p>
              </div>

              {/* Status & Options */}
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 space-y-6">
                <div className="flex items-center space-x-3">
                  {isOutOfStock ? (
                    <div className="flex items-center text-destructive font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Esaurito
                    </div>
                  ) : isLowStock ? (
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Disponibilità Limitata
                    </div>
                  ) : (
                    <div className="flex items-center text-success font-bold text-sm">
                      <Check className="w-4 h-4 mr-2" /> Disponibile in negozio
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <AddToCartButton 
                    product={product as any} 
                    disabled={isOutOfStock} 
                  />
                </div>
              </div>

              {/* USP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-start space-x-3 p-4 rounded-xl border border-border/30 bg-white shadow-sm">
                    <Truck className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Consegna Locale</p>
                      <p className="text-xs text-muted-foreground">Disponibile nella tua zona</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-3 p-4 rounded-xl border border-border/30 bg-white shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Pagamento Online</p>
                      <p className="text-xs text-muted-foreground">Sicuro e garantito</p>
                    </div>
                 </div>
              </div>

              {/* Long Description */}
              <div className="pt-8 border-t space-y-4">
                <h3 className="font-heading font-bold text-xl">Dettagli Prodotto</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description_long || "Nessuna informazione aggiuntiva disponibile per questo prodotto."}
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-32 pt-16 border-t">
            <h2 className="text-3xl font-heading font-bold mb-12">Prodotti Correlati</h2>
            <ProductPreview 
              products={relatedProducts?.map(p => ({ ...p, categories: product.categories })) || []} 
              isLoading={false} 
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
