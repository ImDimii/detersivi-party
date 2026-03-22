"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  Truck, 
  Store,
  Bell,
  Palette,
  Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useSettings } from "@/hooks/useSettings"
import { useToast } from "@/hooks/useToast"

export default function AdminSettingsPage() {
  const { getSettings, updateSetting } = useSettings()
  const settings = getSettings.data || {}
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  // State for complex settings
  const [openingHours, setOpeningHours] = useState<any>({})
  const [deliveryZones, setDeliveryZones] = useState<string[]>([])
  const [newCap, setNewCap] = useState("")

  useEffect(() => {
    if (settings.opening_hours) {
      setOpeningHours(settings.opening_hours)
    } else {
      // Default opening hours if not set
      const defaults = {
        'Lunedì': { open: "09:00", close: "19:30", active: true },
        'Martedì': { open: "09:00", close: "19:30", active: true },
        'Mercoledì': { open: "09:00", close: "19:30", active: true },
        'Giovedì': { open: "09:00", close: "19:30", active: true },
        'Venerdì': { open: "09:00", close: "19:30", active: true },
        'Sabato': { open: "09:00", close: "19:30", active: true },
        'Domenica': { open: "09:00", close: "19:30", active: false }
      }
      setOpeningHours(defaults)
    }

    if (settings.delivery_zones) {
      setDeliveryZones(settings.delivery_zones)
    }
  }, [settings])

  const handleSave = async (key: string, value: any) => {
    try {
      await updateSetting.mutateAsync({ key, value })
      addToast("Impostazione salvata", "success")
    } catch (error) {
      addToast("Errore durante il salvataggio", "error")
    }
  }

  const handleOpeningHoursChange = (day: string, field: string, value: any) => {
    const updated = {
      ...openingHours,
      [day]: { ...openingHours[day], [field]: value }
    }
    setOpeningHours(updated)
    handleSave('opening_hours', updated)
  }

  const handleAddCap = () => {
    if (!newCap || deliveryZones.includes(newCap)) return
    const updated = [...deliveryZones, newCap]
    setDeliveryZones(updated)
    setNewCap("")
    handleSave('delivery_zones', updated)
  }

  const handleRemoveCap = (cap: string) => {
    const updated = deliveryZones.filter(c => c !== cap)
    setDeliveryZones(updated)
    handleSave('delivery_zones', updated)
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-extrabold tracking-tight">Impostazioni</h1>
           <p className="text-muted-foreground">Configura i parametri del negozio, le modalità di consegna e gli orari.</p>
        </div>
        <Button 
          size="lg" 
          className="h-14 px-10 font-bold shadow-xl rounded-xl"
          onClick={() => addToast("Tutte le modifiche sono state salvate automaticamente", "success")}
        >
           <Save className="w-5 h-5 mr-3" />
           Salva Tutto
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
         <div className="bg-white p-1 rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            <TabsList className="bg-transparent h-14 w-full justify-start overflow-x-auto flex flex-nowrap scrollbar-hide py-1">
               <TabsTrigger value="general" className="rounded-xl font-bold text-xs uppercase px-8 flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center h-full">
                  <Settings className="w-4 h-4 mr-2" /> Generale
               </TabsTrigger>
               <TabsTrigger value="delivery" className="rounded-xl font-bold text-xs uppercase px-8 flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center h-full">
                  <Truck className="w-4 h-4 mr-2" /> Consegna & Ritiro
               </TabsTrigger>
               <TabsTrigger value="appearance" className="rounded-xl font-bold text-xs uppercase px-8 flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center h-full">
                  <Palette className="w-4 h-4 mr-2" /> Aspetto
               </TabsTrigger>
               <TabsTrigger value="notifications" className="rounded-xl font-bold text-xs uppercase px-8 flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center h-full">
                  <Bell className="w-4 h-4 mr-2" /> Notifiche
               </TabsTrigger>
            </TabsList>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <TabsContent value="general" className="mt-0 space-y-6">
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                     <div className="p-8 border-b bg-secondary/10">
                        <h3 className="font-heading font-bold flex items-center">
                           <Globe className="w-5 h-5 mr-3 text-primary" /> Informazioni Negozio
                        </h3>
                     </div>
                     <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label>Nome Negozio</Label>
                              <Input 
                                defaultValue={settings.shop_name || "DetersiviParty"} 
                                onBlur={(e) => handleSave('shop_name', e.target.value)}
                                className="h-12 rounded-xl" 
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>Partita IVA</Label>
                              <Input 
                                defaultValue={settings.vat_number || "IT0123456789"} 
                                onBlur={(e) => handleSave('vat_number', e.target.value)}
                                className="h-12 rounded-xl" 
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label>Descrizione Breve</Label>
                           <Textarea 
                             rows={3}
                             placeholder="Descrivi il tuo negozio..."
                             className="rounded-xl"
                             defaultValue={settings.shop_description || "Il tuo punto di riferimento..."}
                             onBlur={(e) => handleSave('shop_description', e.target.value)}
                           />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label>Email Contatto</Label>
                              <Input 
                                defaultValue={settings.contact_email || "info@detersiviparty.it"} 
                                onBlur={(e) => handleSave('contact_email', e.target.value)}
                                className="h-12 rounded-xl" 
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>Telefono</Label>
                              <Input 
                                defaultValue={settings.contact_phone || "+39 0185 123456"} 
                                onBlur={(e) => handleSave('contact_phone', e.target.value)}
                                className="h-12 rounded-xl" 
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label>Indirizzo Fisico</Label>
                           <Input 
                             defaultValue={settings.shop_address || "Via Roma 123, 16038 Santa Margherita Ligure (GE)"} 
                             onBlur={(e) => handleSave('shop_address', e.target.value)}
                             className="h-12 rounded-xl" 
                           />
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                     <div className="p-8 border-b bg-secondary/10">
                        <h3 className="font-heading font-bold flex items-center">
                           <Clock className="w-5 h-5 mr-3 text-primary" /> Orari di Apertura
                        </h3>
                     </div>
                     <div className="p-8 space-y-4">
                        {Object.entries(openingHours).map(([day, data]: [string, any]) => (
                           <div key={day} className="flex items-center justify-between py-2 border-b last:border-0 border-border/30">
                              <span className={`font-bold text-sm w-32 ${!data.active ? 'text-muted-foreground' : ''}`}>{day}</span>
                              <div className="flex items-center space-x-4">
                                 <Input 
                                   value={data.open} 
                                   onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                                   className="h-10 w-24 rounded-lg text-center font-bold" 
                                   disabled={!data.active}
                                 />
                                 <span className="text-muted-foreground">-</span>
                                 <Input 
                                   value={data.close} 
                                   onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                                   className="h-10 w-24 rounded-lg text-center font-bold" 
                                   disabled={!data.active}
                                 />
                                 <Switch 
                                   checked={data.active} 
                                   onCheckedChange={(v) => handleOpeningHoursChange(day, 'active', v)}
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </TabsContent>

               <TabsContent value="delivery" className="mt-0 space-y-6">
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                     <div className="p-8 border-b bg-secondary/10">
                        <h3 className="font-heading font-bold flex items-center">
                           <Truck className="w-5 h-5 mr-3 text-primary" /> Zone di Consegna (CAP)
                        </h3>
                     </div>
                     <div className="p-8 space-y-6">
                        <div className="flex gap-4">
                           <Input 
                             value={newCap}
                             onChange={(e) => setNewCap(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleAddCap()}
                             placeholder="Es: 16038" 
                             className="h-12 rounded-xl flex-grow" 
                           />
                           <Button onClick={handleAddCap} className="h-12 rounded-xl px-6 font-bold">Aggiungi CAP</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {deliveryZones.map((cap) => (
                             <div key={cap} className="flex items-center bg-secondary/30 px-4 py-2 rounded-xl border border-border/50 animate-in fade-in zoom-in duration-200">
                                <span className="font-bold mr-3">{cap}</span>
                                <button 
                                  onClick={() => handleRemoveCap(cap)}
                                  className="text-destructive hover:text-destructive/80 font-black text-xs"
                                >
                                  ×
                                </button>
                             </div>
                           ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                           <div className="space-y-2">
                              <Label>Costo Consegna Base (€)</Label>
                              <Input 
                                defaultValue={settings.delivery_cost || "5.00"} 
                                onBlur={(e) => handleSave('delivery_cost', e.target.value)}
                                className="h-12 rounded-xl" 
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>Consegna Gratuita Oltre (€)</Label>
                              <Input 
                                defaultValue={settings.delivery_free_threshold || "50.00"} 
                                onBlur={(e) => handleSave('delivery_free_threshold', e.target.value)}
                                className="h-12 rounded-xl" 
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent value="appearance" className="mt-0 space-y-6">
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                     <div className="p-8 border-b bg-secondary/10">
                        <h3 className="font-heading font-bold flex items-center">
                           <Palette className="w-5 h-5 mr-3 text-primary" /> Colori & Tema
                        </h3>
                     </div>
                     <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label>Colore Primario (Hex)</Label>
                              <div className="flex gap-4">
                                <Input 
                                  defaultValue={settings.primary_color || "#4f46e5"} 
                                  onBlur={(e) => handleSave('primary_color', e.target.value)}
                                  className="h-12 rounded-xl font-mono" 
                                />
                                <div className="w-12 h-12 rounded-xl border" style={{ backgroundColor: settings.primary_color || "#4f46e5" }} />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <Label>Modalità Scura</Label>
                              <div className="flex items-center justify-between h-12 bg-secondary/10 px-4 rounded-xl">
                                <span className="text-sm font-medium">Attiva Dark Mode</span>
                                <Switch 
                                  checked={settings.dark_mode === 'true'} 
                                  onCheckedChange={(v) => handleSave('dark_mode', v.toString())} 
                                />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent value="notifications" className="mt-0 space-y-6">
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                     <div className="p-8 border-b bg-secondary/10">
                        <h3 className="font-heading font-bold flex items-center">
                           <Bell className="w-5 h-5 mr-3 text-primary" /> Canali di Notifica
                        </h3>
                     </div>
                     <div className="p-8 space-y-4">
                        {[
                          { id: 'notif_order_new', label: 'Nuovi Ordini (Email)', desc: 'Ricevi una notifica quando arriva un nuovo ordine' },
                          { id: 'notif_reservation_new', label: 'Nuove Prenotazioni (Email)', desc: 'Ricevi una notifica quando arriva una nuova prenotazione' },
                          { id: 'notif_stock_low', label: 'Stock Basso (Email)', desc: 'Ricevi una notifica quando un prodotto scende sotto la soglia' }
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-border/30">
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                            <Switch 
                              checked={settings[item.id] === 'true'} 
                              onCheckedChange={(v) => handleSave(item.id, v.toString())} 
                            />
                          </div>
                        ))}
                     </div>
                  </div>
               </TabsContent>
            </div>

            <aside className="space-y-8">
               <div className="bg-indigo-600 rounded-3xl p-8 text-white space-y-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                     <Layout className="w-32 h-32" />
                  </div>
                  <div className="space-y-2 relative z-10">
                     <h4 className="text-xl font-heading font-extrabold uppercase tracking-tight">Guida Rapida</h4>
                     <p className="text-sm text-indigo-100 leading-relaxed">Le impostazioni modificate qui avranno effetto immediato su tutto il sito, inclusi il calcolo dei costi di consegna e gli orari mostrati nel footer.</p>
                  </div>
                  <Button variant="secondary" className="w-full h-12 shadow-lg font-black uppercase text-[10px] tracking-widest relative z-10">Leggi Documentazione</Button>
               </div>
               
               <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stato Sistema</p>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">API Supabase</span>
                        <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">Storage Immagini</span>
                        <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">Servizio Email</span>
                        <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                     </div>
                  </div>
               </div>
            </aside>
         </div>
      </Tabs>
    </div>
  )
}
