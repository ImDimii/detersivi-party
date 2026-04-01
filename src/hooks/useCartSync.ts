"use client"

import { useEffect, useCallback } from "react"
import { useCart } from "./useCart"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "./useToast"

export function useCartSync() {
  const { items, removeItem, updateQuantity } = useCart()
  const { addToast } = useToast()
  const supabase = createClient()

  const syncCart = useCallback(async () => {
    if (items.length === 0) return

    const productIds = items.map(item => item.product.id)

    try {
      const { data: latestProducts, error } = await supabase
        .from('products')
        .select('id, status, stock_quantity')
        .in('id', productIds)

      if (error) throw error

      items.forEach(item => {
        const latest = latestProducts?.find(p => p.id === item.product.id)

        // 1. If product doesn't exist or is not published, remove it
        if (!latest || latest.status !== 'published') {
          removeItem(item.id)
          addToast(`"${item.product.name}" non è più disponibile ed è stato rimosso dal carrello.`, "error")
          return
        }

        // 2. If out of stock, remove it
        if (latest.stock_quantity <= 0) {
          removeItem(item.id)
          addToast(`"${item.product.name}" è esaurito ed è stato rimosso dal carrello.`, "error")
          return
        }

        // 3. If quantity exceeds stock, adjust it
        if (item.quantity > latest.stock_quantity) {
          updateQuantity(item.id, latest.stock_quantity)
          addToast(`La quantità di "${item.product.name}" è stata aggiornata alla disponibilità massima (${latest.stock_quantity} pz).`, "info")
        }
      })
    } catch (err) {
      console.error("Error syncing cart:", err)
    }
  }, [items, removeItem, updateQuantity, addToast, supabase])

  // Sync on mount (first load)
  useEffect(() => {
    syncCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { syncCart }
}
