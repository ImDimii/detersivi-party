"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Globe, MapPin, Bell, Shield, ArrowRight, Trash2, Plus, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { useToast } from "@/hooks/useToast"
import { CustomModal } from "@/components/ui/CustomModal"

interface Address {
  id: string
  label: string
  street: string
  city: string
  zip: string
  province: string
  isDefault: boolean
}

export default function AccountProfilePage() {
  const { user, signOut, updateUser } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()
  
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    phone: user?.user_metadata?.phone || ""
  })

  const [addresses, setAddresses] = useState<Address[]>(user?.user_metadata?.addresses || [])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    label: "",
    street: "",
    city: "",
    zip: "",
    province: "",
    isDefault: false
  })

  // Sync state with user data when it loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        phone: user.user_metadata?.phone || ""
      })
      setAddresses(user.user_metadata?.addresses || [])
    }
  }, [user])

  const handleUpdateProfile = async () => {
    setIsSaving(true)
    try {
      const { error } = await updateUser({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        full_name: `${profileData.firstName} ${profileData.lastName}`,
        phone: profileData.phone
      })
      if (error) throw error
      addToast("Profilo aggiornato con successo!", "success")
    } catch (err: any) {
      addToast("Errore durante l'aggiornamento: " + err.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      addToast("Le password non coincidono!", "error")
      return
    }
    if (passwords.new.length < 6) {
      addToast("La password deve essere di almeno 6 caratteri!", "warning")
      return
    }

    setIsSaving(true)
    try {
      const { error } = await updateUser({ password: passwords.new })
      if (error) throw error
      addToast("Password aggiornata con successo!", "success")
      setPasswords({ current: "", new: "", confirm: "" })
      setShowPasswordForm(false)
    } catch (err: any) {
      addToast("Errore cambio password: " + err.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsSaving(true)
    try {
      await updateUser({ marked_for_deletion: true, deletion_requested_at: new Date().toISOString() })
      addToast("Richiesta ricevuta. Verrai disconnesso.", "info", 4000)
      
      setTimeout(async () => {
        await signOut()
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      addToast("Errore: " + err.message, "error")
      setIsSaving(false)
    } finally {
        setShowDeleteModal(false)
    }
  }

  const handleAddAddress = async () => {
    const addressWithId = { ...newAddress, id: crypto.randomUUID() }
    const updatedAddresses = [...addresses]
    
    if (newAddress.isDefault) {
      updatedAddresses.forEach(a => a.isDefault = false)
    }
    updatedAddresses.push(addressWithId)

    try {
      const { error } = await updateUser({ addresses: updatedAddresses })
      if (error) throw error
      addToast("Nuovo indirizzo salvato!", "success")
      setAddresses(updatedAddresses)
      setShowAddressForm(false)
      setNewAddress({ label: "", street: "", city: "", zip: "", province: "", isDefault: false })
    } catch (err: any) {
      addToast("Errore aggiunta indirizzo: " + err.message, "error")
    }
  }

  const handleDeleteAddress = async (id: string) => {
    const updatedAddresses = addresses.filter(a => a.id !== id)
    try {
      const { error } = await updateUser({ addresses: updatedAddresses })
      if (error) throw error
      addToast("Indirizzo eliminato.", "success")
      setAddresses(updatedAddresses)
    } catch (err: any) {
      addToast("Errore eliminazione: " + err.message, "error")
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    const updatedAddresses = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }))
    try {
      const { error } = await updateUser({ addresses: updatedAddresses })
      if (error) throw error
      addToast("Indirizzo predefinito aggiornato.", "success")
      setAddresses(updatedAddresses)
    } catch (err: any) {
      addToast("Errore: " + err.message, "error")
    }
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/"
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="flex justify-between items-end">
         <div>
            <h2 className="text-3xl font-heading font-extrabold tracking-tight">Il Mio Profilo</h2>
            <p className="text-muted-foreground">Gestisci i tuoi dati personali, indirizzi e preferenze.</p>
         </div>
         <Button variant="outline" onClick={handleLogout} className="border-destructive/20 text-destructive hover:bg-destructive/10 rounded-xl px-6 font-bold space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Esci</span>
         </Button>
      </div>

      <div className="grid grid-cols-1 gap-12">
         {/* Personal Info */}
         <section className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden animation-slide-up">
            <div className="p-8 border-b bg-secondary/10">
               <h3 className="font-heading font-bold text-lg flex items-center">
                  <User className="w-5 h-5 mr-3 text-primary" />
                  Informazioni Personali
               </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <Label>Nome</Label>
                     <Input 
                       value={profileData.firstName || ""} 
                       onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                       className="h-12 rounded-xl" 
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Cognome</Label>
                     <Input 
                       value={profileData.lastName || ""} 
                       onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                       className="h-12 rounded-xl" 
                     />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <Label>Email</Label>
                     <Input defaultValue={user?.email || ""} readOnly className="h-12 rounded-xl bg-secondary/30 text-muted-foreground cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                     <Label>Telefono</Label>
                     <Input 
                       value={profileData.phone || ""} 
                       onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                       className="h-12 rounded-xl" 
                     />
                  </div>
               </div>
            </div>
            <div className="p-8 bg-secondary/5 border-t border-border/30 flex justify-end">
               <Button onClick={handleUpdateProfile} disabled={isSaving} className="h-12 px-10 font-bold rounded-xl shadow-lg">
                 {isSaving ? "Salvataggio..." : "Salva Modifiche"}
               </Button>
            </div>
         </section>

         {/* Addresses */}
         <section className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden animation-slide-up">
            <div className="p-8 border-b bg-secondary/10 flex justify-between items-center">
               <h3 className="font-heading font-bold text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-primary" />
                  I Miei Indirizzi
               </h3>
               <button 
                 onClick={() => setShowAddressForm(!showAddressForm)}
                 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
               >
                  {showAddressForm ? "Annulla" : "+ Aggiungi"}
               </button>
            </div>
            
            <div className="p-8 space-y-6">
               <AnimatePresence>
                 {showAddressForm && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden mb-8 border-b border-border/40 pb-8"
                   >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/5 p-8 rounded-3xl border-2 border-dashed border-primary/20">
                        <div className="md:col-span-2 space-y-2">
                           <Label>Etichetta (es. Casa, Ufficio)</Label>
                           <Input value={newAddress.label || ""} onChange={e => setNewAddress({...newAddress, label: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <Label>Indirizzo e N. Civico</Label>
                           <Input value={newAddress.street || ""} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <Label>Città</Label>
                           <Input value={newAddress.city || ""} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label>CAP</Label>
                              <Input value={newAddress.zip || ""} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="h-12 rounded-xl" />
                           </div>
                           <div className="space-y-2">
                              <Label>Provincia</Label>
                              <Input value={newAddress.province || ""} onChange={e => setNewAddress({...newAddress, province: e.target.value})} className="h-12 rounded-xl" />
                           </div>
                        </div>
                        <div className="md:col-span-2 flex items-center space-x-3 py-2">
                           <Checkbox id="isDefault" checked={newAddress.isDefault} onCheckedChange={(v) => setNewAddress({...newAddress, isDefault: !!v})} />
                           <Label htmlFor="isDefault" className="text-sm font-bold">Imposta come indirizzo predefinito</Label>
                        </div>
                        <div className="md:col-span-2">
                           <Button onClick={handleAddAddress} className="w-full h-14 font-black rounded-xl">Salva Indirizzo</Button>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {addresses.length === 0 ? (
                   <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-border/40 rounded-[2rem] text-muted-foreground italic">
                      Non hai ancora salvato alcun indirizzo.
                   </div>
                 ) : (
                   addresses.map((addr) => (
                     <div key={addr.id} className={`p-6 border-2 rounded-2xl flex justify-between items-start transition-all ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/40'}`}>
                        <div className="space-y-2">
                           <div className="flex items-center">
                              {addr.isDefault && (
                                <span className="text-[10px] font-black uppercase bg-primary text-white px-2.5 py-1 rounded-lg mr-3 shadow-sm">Predefinito</span>
                              )}
                              <h4 className="font-bold text-lg">{addr.label}</h4>
                           </div>
                           <p className="text-sm text-muted-foreground leading-relaxed">
                              {addr.street}<br />
                              {addr.zip} {addr.city} ({addr.province})
                           </p>
                           {!addr.isDefault && (
                             <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-2">Rendi predefinito</button>
                           )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                           <Trash2 className="w-4.5 h-4.5" />
                        </Button>
                     </div>
                   ))
                 )}
               </div>
            </div>
         </section>

         {/* Account Security & Preferences */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col animation-slide-up" style={{ animationDelay: '0.1s' }}>
               <div className="p-8 border-b bg-secondary/10">
                  <h3 className="font-heading font-bold text-lg flex items-center">
                     <Shield className="w-5 h-5 mr-3 text-primary" />
                     Sicurezza
                  </h3>
               </div>
               <div className="p-8 flex-grow space-y-6">
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">Aggiorna la tua password regolarmente per mantenere il tuo account sicuro.</p>
                  
                  <AnimatePresence>
                    {showPasswordForm ? (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 pt-2"
                      >
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nuova Password</Label>
                           <Input 
                             type="password" 
                             value={passwords.new} 
                             onChange={e => setPasswords({...passwords, new: e.target.value})} 
                             className="h-12 rounded-xl"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conferma Nuova Password</Label>
                           <Input 
                             type="password" 
                             value={passwords.confirm} 
                             onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                             className="h-12 rounded-xl"
                           />
                        </div>
                        <div className="flex gap-3 pt-2">
                           <Button onClick={handleChangePassword} disabled={isSaving} className="flex-grow h-12 font-black rounded-xl">
                              Aggiorna
                           </Button>
                           <Button variant="ghost" onClick={() => setShowPasswordForm(false)} className="h-12 font-black rounded-xl px-6">
                              Annulla
                           </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full h-14 font-black rounded-2xl border-2 space-x-2 hover:bg-secondary/5"
                      >
                         <Lock className="w-4 h-4" />
                         <span className="text-[10px] uppercase tracking-widest">Cambia Password</span>
                      </Button>
                    )}
                  </AnimatePresence>
               </div>
            </section>

            <section className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col animation-slide-up" style={{ animationDelay: '0.2s' }}>
               <div className="p-8 border-b bg-secondary/10">
                  <h3 className="font-heading font-bold text-lg flex items-center">
                     <Bell className="w-5 h-5 mr-3 text-primary" />
                     Notifiche
                  </h3>
               </div>
               <div className="p-8 flex-grow space-y-5">
                  {[
                    { id: "email-orders", label: "Email per aggiornamenti ordini", checked: true },
                    { id: "email-res", label: "Email per le prenotazioni", checked: true },
                    { id: "promo", label: "Ricevi offerte e promozioni", checked: false },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center space-x-4 bg-secondary/5 p-4 rounded-2xl border border-border/20">
                       <Checkbox id={pref.id} defaultChecked={pref.checked} className="w-5 h-5" />
                       <Label htmlFor={pref.id} className="text-xs font-bold uppercase tracking-wide cursor-pointer flex-grow">{pref.label}</Label>
                    </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Delete Account */}
         <section className="p-10 bg-destructive/5 rounded-[2.5rem] border-2 border-dashed border-destructive/20 flex flex-col md:flex-row justify-between items-center gap-8 animation-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-2 text-center md:text-left">
               <div className="inline-flex items-center space-x-2 text-destructive font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                  <Shield className="w-3 h-3" />
                  <span>Zona Pericolosa</span>
               </div>
               <p className="text-lg font-heading font-black">Vuoi eliminare definitivamente l'account?</p>
               <p className="text-sm text-muted-foreground font-medium">Questa azione è permanente e non può essere annullata. Perderai tutti i tuoi ordini e i dati salvati.</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteModal(true)}
              disabled={isSaving}
              className="text-destructive font-black uppercase tracking-widest hover:bg-destructive/10 h-16 rounded-2xl px-12 border-2 border-destructive/20 active:scale-95 transition-all"
            >
               Elimina Account
            </Button>
         </section>
      </div>

      <CustomModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Sei assolutamente sicuro?"
        description="Questa azione è irreversibile. Tutti i tuoi dati verranno eliminati e non potrai più accedere a questo profilo."
        confirmText="Sì, Elimina Account"
        variant="destructive"
        isLoading={isSaving}
      />
    </div>
  )
}
