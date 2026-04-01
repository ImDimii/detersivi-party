"use client"

import { useState } from "react"
import { 
  Package, 
  Save, 
  X, 
  Plus, 
  ImageIcon, 
  Tags, 
  Info,
  ChevronLeft,
  Trash2,
  Upload
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
import { useProducts } from "@/hooks/useProducts"
import { useToast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const { data: categories } = useCategories()
  const { createProduct } = useProducts()
  const { addToast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    category_id: string | null;
    sku: string;
    description_short: string;
    description_long: string;
    price: string;
    price_original: string;
    stock_quantity: string;
    stock_alert_threshold: string;
    status: 'published' | 'draft' | 'archived';
    is_featured: boolean;
    is_new: boolean;
    images: string[];
  }>({
    name: "",
    slug: "",
    category_id: null,
    sku: "",
    description_short: "",
    description_long: "",
    price: "",
    price_original: "",
    stock_quantity: "0",
    stock_alert_threshold: "5",
    status: "draft",
    is_featured: false,
    is_new: true,
    images: []
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

  const handleSubmit = async (publishImmediate = false) => {
    if (!formData.name) {
      addToast("Il nome è obbligatorio", "warning")
      return
    }
    if (!formData.price) {
      addToast("Il prezzo è obbligatorio", "warning")
      return
    }

    setIsSubmitting(true)
    try {
      await createProduct.mutateAsync({
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        category_id: formData.category_id || null,
        sku: formData.sku || null,
        description_short: formData.description_short,
        description_long: formData.description_long,
        price: Number(formData.price),
        price_original: formData.price_original ? Number(formData.price_original) : null,
        stock_quantity: Number(formData.stock_quantity),
        stock_alert_threshold: Number(formData.stock_alert_threshold),
        status: publishImmediate ? 'published' : formData.status,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        images: formData.images,
        variants: [] // Default empty
      })
      addToast(`Prodotto ${publishImmediate ? 'pubblicato' : 'creato'} con successo!`, "success")
      router.push("/admin/prodotti")
    } catch (error: any) {
      addToast("Errore durante il salvataggio: " + error.message, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <Link href="/admin/prodotti">
              <Button variant="secondary" size="icon" className="rounded-full shadow-sm">
                 <ChevronLeft className="w-5 h-5" />
              </Button>
           </Link>
           <div className="space-y-1">
              <h1 className="text-4xl font-heading font-extrabold tracking-tight">Nuovo Prodotto</h1>
              <p className="text-muted-foreground text-sm">Inserisci tutti i dettagli del prodotto nel catalogo.</p>
           </div>
        </div>
        <div className="flex gap-4">
           <Button 
             variant="outline" 
             size="lg" 
             onClick={() => handleSubmit(false)}
             disabled={isSubmitting}
             className="h-14 px-8 font-bold rounded-xl border-2"
           >
             Salva Bozza
           </Button>
           <Button 
             size="lg" 
             onClick={() => handleSubmit(true)}
             disabled={isSubmitting}
             className="h-14 px-8 font-bold shadow-xl rounded-xl"
           >
              {isSubmitting ? "Salvataggio..." : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  Pubblica Prodotto
                </>
              )}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
               <div className="p-8 border-b bg-secondary/10 flex items-center">
                  <Info className="w-5 h-5 mr-3 text-primary" />
                  <h3 className="font-heading font-bold uppercase tracking-wider text-xs">Informazioni Base</h3>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-2">
                     <Label>Nome Prodotto</Label>
                     <Input 
                       value={formData.name}
                       onChange={(e) => handleNameChange(e.target.value)}
                       placeholder="Es: Detersivo Piatti Limone" 
                       className="h-12 rounded-xl" 
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select 
                          value={formData.category_id || "none"} 
                          onValueChange={(v) => setFormData({...formData, category_id: v === "none" ? null : v})}
                        >
                           <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="Seleziona categoria" />
                           </SelectTrigger>
                           <SelectContent className="bg-white z-50">
                              <SelectItem value="none">Seleziona...</SelectItem>
                              {categories?.map(c => (
                                <SelectItem key={c.id} value={c.id as string}>{c.name}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label>SKU / Codice Interno</Label>
                        <Input 
                          value={formData.sku} 
                          onChange={(e) => setFormData({...formData, sku: e.target.value})}
                          placeholder="Es: DET-001" 
                          className="h-12 rounded-xl" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label>Descrizione Breve</Label>
                     <Textarea 
                       value={formData.description_short}
                       onChange={(e) => setFormData({...formData, description_short: e.target.value})}
                       rows={2} 
                       placeholder="Una breve introduzione che appare nelle anteprime..." 
                       className="rounded-xl" 
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Descrizione Estesa</Label>
                     <Textarea 
                       value={formData.description_long}
                       onChange={(e) => setFormData({...formData, description_long: e.target.value})}
                       rows={6} 
                       placeholder="Tutti i dettagli, istruzioni d'uso, ingredienti..." 
                       className="rounded-xl" 
                     />
                  </div>
               </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
               <div className="p-8 border-b bg-secondary/10 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-3 text-primary" />
                  <h3 className="font-heading font-bold uppercase tracking-wider text-xs">Media & Immagini</h3>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label>Carica Immagini (Seleziona un file OPPURE inserisci URL)</Label>
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        <Input 
                            type="file" 
                            accept="image/*"
                            className="h-12 pt-2.5 rounded-xl file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFormData({...formData, images: [reader.result as string]});
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <span className="text-muted-foreground text-sm font-bold opacity-50 shrink-0">OPPURE</span>
                        <Input 
                          placeholder="https://... (URL Diretto)" 
                          className="h-12 rounded-xl" 
                          onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                        />
                    </div>
                  </div>
                  {formData.images[0] && (
                     <div className="mt-4 p-4 border border-border/50 rounded-xl bg-secondary/10 inline-block shadow-sm">
                        <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Anteprima Immagine</p>
                        <img src={formData.images[0]} alt="Preview" className="h-40 w-auto object-contain rounded-lg" />
                     </div>
                  )}
               </div>
            </div>

            {/* Price & Inventory */}
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
               <div className="p-8 border-b bg-secondary/10 flex items-center">
                  <Tags className="w-5 h-5 mr-3 text-primary" />
                  <h3 className="font-heading font-bold uppercase tracking-wider text-xs">Prezzo & Stock</h3>
               </div>
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label>Prezzo Finale (€)</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="0,00" 
                          className="h-12 rounded-xl" 
                        />
                     </div>
                     <div className="space-y-2">
                        <Label>Prezzo Originale (Sconto)</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={formData.price_original}
                          onChange={(e) => setFormData({...formData, price_original: e.target.value})}
                          placeholder="0,00" 
                          className="h-12 rounded-xl text-muted-foreground" 
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                     <div className="space-y-2">
                        <Label>Quantità in Stock</Label>
                        <Input 
                          type="number" 
                          value={formData.stock_quantity}
                          onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                          className="h-12 rounded-xl" 
                        />
                     </div>
                     <div className="space-y-2">
                        <Label>Soglia Avviso Stock</Label>
                        <Input 
                          type="number" 
                          value={formData.stock_alert_threshold}
                          onChange={(e) => setFormData({...formData, stock_alert_threshold: e.target.value})}
                          className="h-12 rounded-xl" 
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Status */}
         <aside className="space-y-8">
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 space-y-6">
               <h4 className="font-heading font-bold uppercase tracking-wider text-xs border-b pb-4">Organizzazione</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-sm">In Evidenza</Label>
                        <p className="text-[10px] text-muted-foreground">Mostra nella home page</p>
                     </div>
                     <Switch 
                       checked={formData.is_featured} 
                       onCheckedChange={(v) => setFormData({...formData, is_featured: v})} 
                     />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-sm">Novità</Label>
                        <p className="text-[10px] text-muted-foreground">Badge "Nuovo"</p>
                     </div>
                     <Switch 
                       checked={formData.is_new} 
                       onCheckedChange={(v) => setFormData({...formData, is_new: v})} 
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 space-y-6">
               <h4 className="font-heading font-bold uppercase tracking-wider text-xs border-b pb-4">Stato Pubblicazione</h4>
               <Select 
                 value={formData.status} 
                 onValueChange={(v: any) => setFormData({...formData, status: v})}
               >
                  <SelectTrigger className="h-12 rounded-xl">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                     <SelectItem value="draft">Bozza</SelectItem>
                     <SelectItem value="published">Pubblicato</SelectItem>
                     <SelectItem value="archived">Archiviato</SelectItem>
                  </SelectContent>
               </Select>
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                  L'anteprima del prodotto sarà visibile istantaneamente dopo la pubblicazione.
               </p>
            </div>
         </aside>
      </div>
    </div>
  )
}
