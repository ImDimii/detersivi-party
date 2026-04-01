"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { Product } from "@/types/database"

interface AddToCartButtonProps {
  product: Product & { categories: { name: string, slug: string } }
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addItem, items } = useCart()

  const stock = product.stock_quantity ?? 0
  const cartItem = items.find(i => i.id === product.id)
  const cartQty = cartItem?.quantity ?? 0
  const isOutOfStock = stock <= 0
  const isMaxReached = cartQty >= stock

  const isDisabled = disabled || isOutOfStock || isMaxReached

  return (
    <Button 
      size="lg" 
      className="flex-grow h-14 text-base font-bold shadow-xl active:scale-95 transition-transform" 
      disabled={isDisabled}
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="w-5 h-5 mr-3" />
      {isOutOfStock ? 'Esaurito' : isMaxReached ? 'Massimo raggiunto' : 'Aggiungi al Carrello'}
    </Button>
  )
}
