"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare,
  Search,
  CheckCircle2,
  Trash2,
  Mail,
  Loader2,
  Calendar,
  MoreVertical,
  Inbox
} from "lucide-react"

export default function AdminMessaggiPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchMessages(true)

    // Setup polling ogni 10 secondi
    const interval = setInterval(() => {
      fetchMessages(false)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const fetchMessages = async (showLoader = false) => {
    if (showLoader) setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Se la tabella non esiste, data sarà null
    setMessages(data || [])
    if (showLoader) setLoading(false)
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo messaggio?")) return
    await supabase.from('messages').delete().eq('id', id)
    fetchMessages() // Ricarica
  }

  if (loading && messages.length === 0) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Caricamento messaggi in corso...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
             <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest">
               <MessageSquare className="w-3 h-3" />
               <span>Inbox Contatti</span>
             </div>
             <h1 className="text-3xl font-heading font-black tracking-tight">Messaggi Ricevuti</h1>
             <p className="text-muted-foreground">Leggi e gestisci le richieste arrivate dal form Contatti del sito.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm border text-foreground flex items-center">
             <Inbox className="w-4 h-4 mr-2" />
             Totale: {messages.length} Messaggi
          </div>
       </div>

       {/* List / Empty State */}
       {messages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-border p-16 text-center space-y-4 shadow-sm">
             <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <CheckCircle2 className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black font-heading tracking-tight">Tutto pulito!</h2>
             <p className="text-muted-foreground">Non ci sono messaggi da leggere al momento.</p>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {messages.map((msg) => (
               <div key={msg.id} className="bg-white rounded-3xl p-6 border shadow-sm space-y-6 hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="font-bold text-lg leading-tight">{msg.name}</h3>
                           <a href={`mailto:${msg.email}`} className="text-sm font-medium text-primary hover:underline flex items-center mt-1">
                              <Mail className="w-3 h-3 mr-1" /> {msg.email}
                           </a>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center">
                           <Calendar className="w-3 h-3 mr-1" />
                           {new Date(msg.created_at).toLocaleDateString('it-IT')}
                        </span>
                     </div>
                     <div className="border-t pt-4">
                        <p className="font-bold text-sm uppercase tracking-wider text-foreground mb-2">Oggetto: {msg.subject}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           {msg.message}
                        </p>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 relative z-10">
                     <a href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}>
                        <Button variant="secondary" className="font-bold rounded-xl text-xs h-9">
                           Rispondi
                        </Button>
                     </a>
                     <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteMessage(msg.id)}>
                        <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
             ))}
          </div>
       )}
    </div>
  )
}
