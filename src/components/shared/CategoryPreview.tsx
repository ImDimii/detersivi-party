import Link from "next/link"
import { Category } from "@/types/database"

interface CategoryPreviewProps {
  categories: Category[]
  isLoading: boolean
}

export function CategoryPreview({ categories, isLoading }: CategoryPreviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="h-96 rounded-2xl bg-secondary animate-pulse" />
        ))}
      </div>
    )
  }

  // If no categories, show nothing or a message
  if (!categories || categories.length === 0) return null

  // Take the first 2 main categories for the home page preview
  const mainCategories = categories.filter(c => !c.parent_id).slice(0, 2)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {mainCategories.map((category) => (
        <Link 
          key={category.id} 
          href={`/catalogo/${category.slug}`}
          className="group relative h-96 rounded-2xl overflow-hidden bg-white border border-border/50 shadow-sm transition-all hover:shadow-xl"
        >
          {category.image_url ? (
            <img 
              src={category.image_url} 
              alt={category.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary flex items-center justify-center">
               <span className="text-muted-foreground italic">Immagine categoria</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
          <div className="absolute bottom-10 left-10 z-20 space-y-2">
            <h3 className="text-3xl font-bold text-white">{category.name}</h3>
            <p className="text-white/80 text-lg">{category.description || "Scopri i nostri prodotti."}</p>
            <div className="pt-4">
               <span className="bg-white text-primary px-6 py-2 rounded-full text-sm font-semibold inline-block">
                 Esplora
               </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
