"use client"

import { useToast, ToastType } from "@/hooks/useToast"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-success" />,
  error: <XCircle className="w-5 h-5 text-destructive" />,
  info: <Info className="w-5 h-5 text-primary" />,
  warning: <AlertCircle className="w-5 h-5 text-warning" />
}

const bgColors: Record<ToastType, string> = {
  success: "bg-success/10 border-success/20",
  error: "bg-destructive/10 border-destructive/20",
  info: "bg-primary/10 border-primary/20",
  warning: "bg-warning/10 border-warning/20"
}

export function CustomToaster() {
  const { toasts, removeToast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-[400px] w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-4 p-4 rounded-[1.5rem] border shadow-2xl backdrop-blur-xl ${bgColors[toast.type]}`}
          >
            <div className="mt-0.5 shrink-0">
              {icons[toast.type]}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-foreground leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="mt-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
