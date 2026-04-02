"use client"

import { useState } from "react"
import { useCategories } from "@/hooks/useCategories"
import { Tags, Plus, Search, MoreVertical, Edit, Trash2, ChevronRight, FolderTree, ImageIcon, UploadCloud } from "lucide-react"
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

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("")
  const { data: categories, isLoading, deleteCategory, updateCategory } = useCategories()
  const { addToast } = useToast()
  const router = useRouter()
  
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!categoryToDelete) return
    setIsDeleting(true)
    try {
      await deleteCategory.mutateAsync(categoryToDelete)
      addToast("Categoria eliminata con successo", "success")
    } catch (err: any) {
      addToast("Errore eliminazione: " + err.message, "error")
    } finally {
      setIsDeleting(false)
      setCategoryToDelete(null)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCategory.mutateAsync({ id, is_active: !currentStatus })
      addToast(`Categoria ${!currentStatus ? 'attivata' : 'disattivata'}`, "success")
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
          throw new Error("Il file deve contenere un array di categorie.")
        }

        const supabase = createClient()
        const { error } = await supabase.from('categories').insert(data)
        
        if (error) throw error
        
        addToast(`Importate ${data.length} categorie con successo!`, "success")
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
           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight">Categorie</h1>
           <p className="text-muted-foreground">Gestisci le categorie e sottocategorie per organizzare i tuoi prodotti.</p>
        </div>
        <Link href="/admin/categorie/nuova">
          <Button size="lg" className="h-14 px-8 font-bold shadow-xl rounded-xl">
             <Plus className="w-5 h-5 mr-3" />
             Nuova Categoria
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
               <Tags className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Totale Categorie</p>
               <p className="text-2xl font-heading font-extrabold">{categories?.length || 0}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-secondary text-muted-foreground rounded-2xl">
               <FolderTree className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sottocategorie</p>
               <p className="text-2xl font-heading font-extrabold">{categories?.filter(c => c.parent_id).length || 0}</p>
            </div>
         </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca per nome o slug..." 
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

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/10 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
                <th className="px-8 py-5">Categoria</th>
                <th className="px-6 py-5">Slug</th>
                <th className="px-6 py-5">Genitore</th>
                <th className="px-6 py-5 text-center">Ordine</th>
                <th className="px-6 py-5">Stato</th>
                <th className="px-8 py-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-4 bg-secondary rounded w-32" /></td>
                    <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-24" /></td>
                    <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-20" /></td>
                    <td className="px-6 py-6 text-center"><div className="h-4 bg-secondary rounded w-8 mx-auto" /></td>
                    <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-16" /></td>
                    <td className="px-8 py-6 text-right"><div className="h-8 bg-secondary rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredCategories?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                    <Tags className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Nessuna categoria trovata</p>
                  </td>
                </tr>
              ) : (
                filteredCategories?.map((category) => (
                  <tr key={category.id} className="hover:bg-secondary/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-secondary rounded-xl overflow-hidden border flex items-center justify-center shrink-0">
                          {category.image_url ? (
                            <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                          ) : <FolderTree className="w-4 h-4 text-muted-foreground opacity-30" />}
                        </div>
                        <span className="font-bold">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-mono text-xs text-muted-foreground">
                      /{category.slug}
                    </td>
                    <td className="px-6 py-6">
                      {category.parent_id ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider">
                           {categories?.find(c => c.id === category.parent_id)?.name || 'N/D'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Principale</span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-center font-bold">
                       {category.sort_order}
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => handleToggleStatus(category.id, category.is_active)}
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-all ${
                          category.is_active ? 'bg-success/10 text-success hover:bg-success/20' : 
                          'bg-destructive/10 text-destructive hover:bg-destructive/20'
                        }`}
                      >
                        {category.is_active ? 'Attiva' : 'Inattiva'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <DropdownMenu>
                           <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
                                <MoreVertical className="w-4 h-4" />
                           </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border shadow-xl z-50">
                             <DropdownMenuItem onClick={() => router.push(`/admin/categorie/modifica/${category.id}`)} className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                <Edit className="w-3.5 h-3.5 mr-3" /> Modifica
                             </DropdownMenuItem>
                             <div className="h-px bg-border/50 my-1 mx-2" />
                             <DropdownMenuItem 
                                onClick={() => setCategoryToDelete(category.id)}
                                className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 transition-colors"
                             >
                                <Trash2 className="w-3.5 h-3.5 mr-3" /> Elimina
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
      </div>

      <CustomModal 
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Elimina Categoria"
        description="Sei sicuro di voler eliminare questa categoria? Verificare che non ci siano prodotti associati."
        confirmText="Elimina"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}
