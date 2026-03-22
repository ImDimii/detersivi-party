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
  const { addItem } = useCart()

  return (
    <Button 
      size="lg" 
      className="flex-grow h-14 text-base font-bold shadow-xl active:scale-95 transition-transform" 
      disabled={disabled}
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="w-5 h-5 mr-3" />
      Aggiungi al Carrello
    </Button>
  )
}
