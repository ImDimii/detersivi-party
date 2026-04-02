"use client"

import { useState } from "react"
import { useProducts } from "@/hooks/useProducts"
import { Package, Plus, Search, MoreVertical, Edit, Trash2, ExternalLink, ChevronLeft, ChevronRight, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

import { useToast } from "@/hooks/useToast"
import { CustomModal } from "@/components/ui/CustomModal"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useRef } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const { data: products, isLoading, deleteProduct, updateProduct } = useProducts({ search })
  const { addToast } = useToast()
  const router = useRouter()
  
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await deleteProduct.mutateAsync(productToDelete)
      addToast("Prodotto eliminato con successo", "success")
    } catch (err: any) {
      addToast("Errore eliminazione: " + err.message, "error")
    } finally {
      setIsDeleting(false)
      setProductToDelete(null)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      await updateProduct.mutateAsync({ id, status: newStatus as any })
      addToast(`Prodotto impostato come ${newStatus === 'published' ? 'pubblicato' : 'bozza'}`, "success")
    } catch (err: any) {
      addToast("Errore aggiornamento stato: " + err.message, "error")
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const data = JSON.parse(text)
        
        if (!Array.isArray(data)) {
          throw new Error("Il file deve contenere un array di prodotti.")
        }

        const supabase = createClient()
        const { error } = await supabase.from('products').insert(data)
        
        if (error) throw error
        
        addToast(`Importati ${data.length} prodotti con successo!`, "success")
        window.location.reload()
      } catch (err: any) {
        addToast("Errore importazione: " + err.message, "error")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight">Gestione Prodotti</h1>
           <p className="text-muted-foreground">Visualizza, aggiungi e modifica l'inventario del tuo negozio.</p>
        </div>
        <Link href="/admin/prodotti/nuovo">
          <Button size="lg" className="h-14 px-8 font-bold shadow-xl rounded-xl">
             <Package className="w-5 h-5 mr-3" />
             Nuovo Prodotto
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca per nome o SKU..." 
            className="pl-10 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleImport} 
        />
        <Button variant="outline" className="h-12 rounded-xl font-bold whitespace-nowrap" onClick={() => fileInputRef.current?.click()}>
          <UploadCloud className="w-5 h-5 mr-2" />
          Importa JSON
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/10 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
                <th className="px-8 py-5">Prodotto</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5">Prezzo</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-6 py-5">Stato</th>
                <th className="px-8 py-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-4 bg-secondary rounded w-32" /></td>
                    <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-20" /></td>
                    <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-16" /></td>
                    <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-12" /></td>
                    <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-16" /></td>
                    <td className="px-8 py-6 text-right"><div className="h-8 bg-secondary rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : products?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Nessun prodotto trovato</p>
                    <p className="text-sm">Prova a cambiare i filtri di ricerca.</p>
                  </td>
                </tr>
              ) : (
                products?.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-secondary rounded-xl overflow-hidden border shrink-0">
                          {Array.isArray(product.images) && product.images[0] ? (
                             // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0] as string} alt={product.name} className="w-full h-full object-cover" />
                          ) : <div className="w-full h-full flex items-center justify-center text-[10px] italic">No image</div>}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">SKU: {product.sku || 'N/D'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-medium">{product.categories?.name || 'Senza categoria'}</span>
                    </td>
                    <td className="px-6 py-6 font-bold text-sm">
                      €{Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          product.stock_quantity <= 0 ? "bg-destructive" : 
                          product.stock_quantity <= product.stock_alert_threshold ? "bg-amber-500" : "bg-success"
                        }`} />
                        <span className="text-sm font-medium">{product.stock_quantity} pz</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => handleToggleStatus(product.id, product.status)}
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-all ${
                          product.status === 'published' ? 'bg-success/10 text-success hover:bg-success/20' : 
                          'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {product.status === 'published' ? 'Pubblicato' : 'Bozza'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
                             <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border shadow-xl z-50">
                             <DropdownMenuItem onClick={() => router.push(`/admin/prodotti/modifica/${product.id}`)} className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                <Edit className="w-4 h-4 mr-3" /> Modifica
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => window.open(`/prodotto/${product.slug}`, '_blank')} className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink className="w-4 h-4 mr-3" /> Vedi sul sito
                             </DropdownMenuItem>
                             <div className="h-px bg-border/50 my-1 mx-2" />
                             <DropdownMenuItem 
                                onClick={() => setProductToDelete(product.id)}
                                className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 transition-colors"
                             >
                                <Trash2 className="w-4 h-4 mr-3" /> Elimina
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t flex items-center justify-between bg-secondary/5">
           <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Mostrando {products?.length || 0} prodotti</p>
           <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" disabled className="rounded-lg w-8 h-8"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="secondary" size="icon" className="rounded-lg w-8 h-8 text-xs font-bold">1</Button>
              <Button variant="outline" size="icon" disabled className="rounded-lg w-8 h-8"><ChevronRight className="w-4 h-4" /></Button>
           </div>
        </div>
      </div>

      <CustomModal 
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="Elimina Prodotto"
        description="Sei sicuro di voler eliminare questo prodotto? L'azione non può essere annullata."
        confirmText="Elimina"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}
