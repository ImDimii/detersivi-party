"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "./button"
import { useEffect, useState } from "react"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  cancelText?: string
  variant?: "destructive" | "primary"
  isLoading?: boolean
}

export function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Annulla",
  variant = "primary",
  isLoading = false
}: CustomModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl border border-border/40 overflow-hidden"
          >
            <div className="p-8 space-y-6 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 ${variant === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                {variant === 'destructive' ? (
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-primary" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-black tracking-tight uppercase italic">{title}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  variant={variant === 'destructive' ? 'destructive' : 'default'} 
                  onClick={onConfirm} 
                  disabled={isLoading}
                  className="h-14 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg"
                >
                  {isLoading ? "Esecuzione..." : confirmText}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={onClose} 
                  disabled={isLoading}
                  className="h-14 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-secondary/10"
                >
                  {cancelText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
