"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Settings, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  Save,
  Truck,
  Palette,
  Layout,
  Server,
  Bell,
  Lock,
  Instagram,
  Facebook,
  Music2, // For TikTok
  MessageCircle // For WhatsApp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useSettings } from "@/hooks/useSettings"
import { useToast } from "@/hooks/useToast"
import Link from 'next/link'
import { Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const { getSettings, updateSetting } = useSettings()
  const settings = getSettings.data || {}
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  
  // Key forcing a re-mount of the form once data is loaded to ensure defaultValues are correct
  const formKey = getSettings.isSuccess ? "ready" : "loading"

  // State for complex settings
  const [openingHours, setOpeningHours] = useState<any>({})
  const [deliveryZones, setDeliveryZones] = useState<string[]>([])
  const [newCap, setNewCap] = useState("")

  const stringifiedOpeningHours = JSON.stringify(settings.opening_hours)
  const stringifiedDeliveryZones = JSON.stringify(settings.delivery_zones)

  useEffect(() => {
    if (settings.opening_hours) {
      setOpeningHours(settings.opening_hours)
    } else if (Object.keys(settings).length > 0) {
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
  }, [stringifiedOpeningHours, stringifiedDeliveryZones])

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

  if (getSettings.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground animate-pulse">Recupero impostazioni dal server...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight">Impostazioni</h1>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-8">
         {/* Vertical Sidebar */}
         <div className="w-full lg:w-64 flex-shrink-0">
            <TabsList className="flex flex-row lg:flex-col h-auto bg-transparent items-stretch gap-2 p-0 overflow-x-auto pb-2 lg:pb-0 lg:overflow-x-visible">
               <TabsTrigger 
                  value="general" 
                  className="justify-start px-4 lg:px-6 py-3 lg:py-4 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:hover:bg-secondary/20 font-bold transition-all shadow-sm whitespace-nowrap text-xs lg:text-sm"
               >
                  <Settings className="w-5 h-5 mr-3" /> Generale
               </TabsTrigger>
               <TabsTrigger 
                  value="delivery" 
                  className="justify-start px-4 lg:px-6 py-3 lg:py-4 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:hover:bg-secondary/20 font-bold transition-all shadow-sm whitespace-nowrap text-xs lg:text-sm"
               >
                  <Truck className="w-5 h-5 mr-3" /> Consegna
               </TabsTrigger>
               <TabsTrigger 
                  value="appearance" 
                  className="justify-start px-4 lg:px-6 py-3 lg:py-4 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:hover:bg-secondary/20 font-bold transition-all shadow-sm whitespace-nowrap text-xs lg:text-sm"
               >
                  <Palette className="w-5 h-5 mr-3" /> Tema
               </TabsTrigger>
               <TabsTrigger 
                  value="notifications" 
                  className="justify-start px-4 lg:px-6 py-3 lg:py-4 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:hover:bg-secondary/20 font-bold transition-all shadow-sm whitespace-nowrap text-xs lg:text-sm"
               >
                  <Bell className="w-5 h-5 mr-3" /> Notifiche
               </TabsTrigger>
               
               {/* Quick Info Widget moved below the sidebar for desktop */}
               <div className="hidden lg:block mt-8 bg-indigo-600 rounded-3xl p-6 text-white space-y-6 shadow-xl relative overflow-hidden group border border-indigo-500">
                  <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                     <Layout className="w-32 h-32" />
                  </div>
                  <div className="space-y-2 relative z-10">
                     <h4 className="text-xl font-heading font-extrabold uppercase tracking-tight">Guida Rapida</h4>
                     <p className="text-xs text-indigo-100 leading-relaxed font-medium">Le modifiche qui hanno effetto immediato su tutto il sito.</p>
                  </div>
                  <Link href="/admin/documentazione" className="block relative z-10">
                     <Button variant="secondary" className="w-full h-12 shadow-lg font-black uppercase text-[10px] tracking-widest cursor-pointer">Leggi Documentazione</Button>
                  </Link>
               </div>
            </TabsList>
         </div>

         {/* Content Area */}
         <div className="flex-grow min-w-0">
            <TabsContent value="general" className="mt-0 space-y-6" key={formKey}>
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
                        <div className="space-y-2 pt-4">
                           <Label>Puntatore Mappa Preciso (Opzionale)</Label>
                           <Input 
                             defaultValue={settings.map_embed_url || ""} 
                             onBlur={(e) => handleSave('map_embed_url', e.target.value)}
                             placeholder="Es: Via Milano 1, Palermo (oppure un URL Embed di Google Maps)"
                             className="h-12 rounded-xl" 
                           />
                           <p className="text-[10px] font-bold text-muted-foreground uppercase">Se vuoto, il sistema posizionerà il pin /contatti usando l'Indirizzo Fisico specificato sopra.</p>
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
                           <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0 border-border/30 gap-2">
                              <span className={`font-bold text-sm w-32 ${!data.active ? 'text-muted-foreground' : ''}`}>{day}</span>
                              <div className="flex items-center space-x-3 sm:space-x-4">
                                 <Input 
                                   value={data.open} 
                                   onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                                   className="h-10 w-20 sm:w-24 rounded-lg text-center font-bold text-sm" 
                                   disabled={!data.active}
                                 />
                                 <span className="text-muted-foreground">-</span>
                                 <Input 
                                   value={data.close} 
                                   onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                                   className="h-10 w-20 sm:w-24 rounded-lg text-center font-bold text-sm" 
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
                                <div className="w-12 h-12 rounded-xl border flex-shrink-0" style={{ backgroundColor: settings.primary_color || "#4f46e5" }} />
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

                  {/* SOCIAL MEDIA SETTINGS */}
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden mt-8">
                     <div className="p-8 border-b bg-secondary/10">
                        <h3 className="font-heading font-bold flex items-center">
                           <Instagram className="w-5 h-5 mr-3 text-pink-500" /> Profili Social
                        </h3>
                     </div>
                     <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label className="flex items-center"><Instagram className="w-4 h-4 mr-2" /> Instagram URL</Label>
                              <Input 
                                defaultValue={settings.social_instagram || ""} 
                                onBlur={(e) => handleSave('social_instagram', e.target.value)}
                                className="h-12 rounded-xl" 
                                placeholder="https://instagram.com/tuoprofilo"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className="flex items-center"><Facebook className="w-4 h-4 mr-2" /> Facebook URL</Label>
                              <Input 
                                defaultValue={settings.social_facebook || ""} 
                                onBlur={(e) => handleSave('social_facebook', e.target.value)}
                                className="h-12 rounded-xl" 
                                placeholder="https://facebook.com/tuoprofilo"
                              />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label className="flex items-center"><Music2 className="w-4 h-4 mr-2" /> TikTok URL</Label>
                              <Input 
                                defaultValue={settings.social_tiktok || ""} 
                                onBlur={(e) => handleSave('social_tiktok', e.target.value)}
                                className="h-12 rounded-xl" 
                                placeholder="https://tiktok.com/@tuoprofilo"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className="flex items-center"><MessageCircle className="w-4 h-4 mr-2 text-green-500" /> Numero WhatsApp (Con prefisso)</Label>
                              <Input 
                                defaultValue={settings.social_whatsapp || "+393001234567"} 
                                onBlur={(e) => handleSave('social_whatsapp', e.target.value)}
                                className="h-12 rounded-xl" 
                                placeholder="es. +393001234567"
                              />
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
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden mt-8">
                     <div className="p-8 border-b bg-secondary/10">
                        <h3 className="font-heading font-bold flex items-center">
                           <Server className="w-5 h-5 mr-3 text-primary" /> Configurazione SMTP
                        </h3>
                     </div>
                     <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label>Host SMTP</Label>
                              <Input 
                                defaultValue={settings.smtp_host || "smtp.example.com"} 
                                onBlur={(e) => handleSave('smtp_host', e.target.value)}
                                className="h-12 rounded-xl" 
                                placeholder="es. smtp.gmail.com"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>Porta SMTP</Label>
                              <Input 
                                type="number"
                                defaultValue={settings.smtp_port || "587"} 
                                onBlur={(e) => handleSave('smtp_port', e.target.value)}
                                className="h-12 rounded-xl" 
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label>Username (Email)</Label>
                              <Input 
                                defaultValue={settings.smtp_user || ""} 
                                onBlur={(e) => handleSave('smtp_user', e.target.value)}
                                className="h-12 rounded-xl" 
                                placeholder="La tua email"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>Password (App Password)</Label>
                              <div className="relative">
                                 <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                 <Input 
                                   type="password"
                                   defaultValue={settings.smtp_pass || ""} 
                                   onBlur={(e) => handleSave('smtp_pass', e.target.value)}
                                   className="h-12 rounded-xl pl-10" 
                                   placeholder="••••••••••••"
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2 border-t pt-6 mt-6">
                           <Label>Indirizzo Mittente (From)</Label>
                           <Input 
                             defaultValue={settings.smtp_from_email || "no-reply@detersiviparty.it"} 
                             onBlur={(e) => handleSave('smtp_from_email', e.target.value)}
                             className="h-12 rounded-xl" 
                           />
                           <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                              Questo è l'indirizzo che i tuoi clienti vedranno come mittente quando ricevono notifiche da parte del negozio.
                           </p>
                        </div>
                     </div>
                  </div>
               </TabsContent>
         </div>
      </Tabs>
    </div>
  )
}
