"use client"

import { useState } from "react"
import { 
  Tags, 
  Save, 
  X, 
  Plus, 
  ImageIcon, 
  Info,
  ChevronLeft,
  Upload,
  FolderTree
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useCategories } from "@/hooks/useCategories"
import { useToast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"

export default function NewCategoryPage() {
  const { data: categories, createCategory } = useCategories()
  const { addToast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    parent_id: string | null;
    description: string;
    image_url: string;
    is_active: boolean;
    sort_order: number;
  }>({
    name: "",
    slug: "",
    parent_id: "none",
    description: "",
    image_url: "",
    is_active: true,
    sort_order: 0
  })

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      addToast("Il nome è obbligatorio", "warning")
      return
    }

    setIsSubmitting(true)
    try {
      await createCategory.mutateAsync({
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        parent_id: formData.parent_id === "none" ? null : formData.parent_id,
        description: formData.description,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
        sort_order: Number(formData.sort_order)
      })
      addToast("Categoria creata con successo!", "success")
      router.push("/admin/categorie")
    } catch (error: any) {
      addToast("Errore durante la creazione: " + error.message, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <Link href="/admin/categorie">
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm">
                 <ChevronLeft className="w-5 h-5" />
              </Button>
           </Link>
           <div className="space-y-1">
              <h1 className="text-4xl font-heading font-extrabold tracking-tight">Nuova Categoria</h1>
              <p className="text-muted-foreground text-sm">Crea una nuova categoria o sottocategoria per il catalogo.</p>
           </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          size="lg" 
          className="h-14 px-10 font-bold shadow-xl rounded-xl"
        >
           {isSubmitting ? "Salvataggio..." : (
             <>
               <Save className="w-5 h-5 mr-3" />
               Salva Categoria
             </>
           )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
               <div className="p-8 border-b bg-secondary/10 flex items-center">
                  <Info className="w-5 h-5 mr-3 text-primary" />
                  <h3 className="font-heading font-bold uppercase tracking-wider text-xs">Dettagli Categoria</h3>
               </div>
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label>Nome Categoria</Label>
                        <Input 
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Es: Detersivi Bucato" 
                          className="h-12 rounded-xl" 
                        />
                     </div>
                     <div className="space-y-2">
                        <Label>Slug URL</Label>
                        <Input 
                          value={formData.slug}
                          onChange={(e) => setFormData({...formData, slug: e.target.value})}
                          placeholder="Es: detersivi-bucato" 
                          className="h-12 rounded-xl font-mono text-xs" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label>Categoria Genitore (opzionale)</Label>
                     <Select 
                       value={formData.parent_id} 
                       onValueChange={(v) => setFormData({...formData, parent_id: v})}
                     >
                        <SelectTrigger className="h-12 rounded-xl">
                           <SelectValue placeholder="Nessuna (Categoria Principale)" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                           <SelectItem value="none">Nessuna (Principale)</SelectItem>
                           {categories?.filter(c => !c.parent_id).map(c => (
                             <SelectItem key={c.id} value={c.id as string}>{c.name}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label>Descrizione</Label>
                     <Textarea 
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                       rows={4} 
                       placeholder="Una breve descrizione della categoria..." 
                       className="rounded-xl" 
                     />
                  </div>
               </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
               <div className="p-8 border-b bg-secondary/10 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-3 text-primary" />
                  <h3 className="font-heading font-bold uppercase tracking-wider text-xs">Immagine di Copertina</h3>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label>URL Immagine</Label>
                    <Input 
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://..." 
                      className="h-12 rounded-xl" 
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">Inserisci un URL diretto all'immagine o caricala prossimamente tramite il gestore media.</p>
               </div>
            </div>
         </div>

         <aside className="space-y-8">
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 space-y-6">
               <h4 className="font-heading font-bold uppercase tracking-wider text-xs border-b pb-4">Visibilità & Ordine</h4>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-sm">Attiva</Label>
                        <p className="text-[10px] text-muted-foreground">Visibile nel catalogo</p>
                     </div>
                     <Switch 
                       checked={formData.is_active} 
                       onCheckedChange={(v) => setFormData({...formData, is_active: v})} 
                     />
                  </div>
                  <div className="space-y-2 pt-4 border-t border-border/30">
                     <Label className="text-sm">Ordine Visualizzazione</Label>
                     <Input 
                       type="number" 
                       value={formData.sort_order}
                       onChange={(e) => setFormData({...formData, sort_order: Number(e.target.value)})}
                       className="h-10 rounded-lg text-center font-bold" 
                     />
                     <p className="text-[10px] text-muted-foreground">Più basso è il numero, prima appare.</p>
                  </div>
               </div>
            </div>
            
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 space-y-4">
               <div className="flex items-center space-x-3 text-primary">
                  <FolderTree className="w-5 h-5" />
                  <h4 className="font-heading font-extrabold uppercase text-xs tracking-tight">Struttura</h4>
               </div>
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Puoi creare una gerarchia fino a 2 livelli (Categoria &rarr; Sottocategoria). Le sottocategorie verranno mostrate come filtri nel catalogo.
               </p>
            </div>
         </aside>
      </div>
    </div>
  )
}
