"use client"

import { useCart } from "@/hooks/useCart"
import { useCartSync } from "@/hooks/useCartSync"
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion" 
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotal } = useCart()
  
  // Activate background sync when drawer is open or mounted
  useCartSync()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-secondary/10">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-heading font-bold">Il Tuo Carrello</h2>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg">Il carrello è vuoto</p>
                    <p className="text-sm text-muted-foreground">Non hai ancora aggiunto prodotti.</p>
                  </div>
                  <Button onClick={() => setIsOpen(false)} className="mt-4">
                    Inizia a fare acquisti
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex space-x-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border/50">
                      {Array.isArray(item.product.images) && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0] as string} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] italic">No image</div>
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                       <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                              {item.product.categories.name}
                            </p>
                            <h3 className="font-bold text-sm leading-tight line-clamp-1">{item.product.name}</h3>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       
                       <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg bg-secondary/50">
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:text-primary transition-colors"
                             >
                                <Minus className="w-3.5 h-3.5" />
                             </button>
                             <span className="w-8 text-center text-sm font-bold font-mono">{item.quantity}</span>
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= (item.product.stock_quantity ?? Infinity)}
                                className="p-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                             >
                                <Plus className="w-3.5 h-3.5" />
                             </button>
                          </div>
                          <p className="font-bold">€{(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-secondary/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotale</span>
                    <span>€{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-heading font-extrabold border-t pt-2">
                    <span>Totale</span>
                    <span className="text-primary">€{getTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/ordine" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-14 text-base font-bold shadow-xl group">
                    Procedi all'Ordine
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-muted-foreground italic">
                  Tutti gli ordini vengono pagati al momento del ritiro o della consegna.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
