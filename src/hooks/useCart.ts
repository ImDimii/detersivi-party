import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/database'

export interface CartItem {
  id: string
  product: Product & { categories: { name: string, slug: string } }
  quantity: number
  variant?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product & { categories: { name: string, slug: string } }, quantity?: number, variant?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (isOpen: boolean) => void
  getTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (product, quantity = 1, variant) => {
        const currentItems = get().items
        const existingItem = currentItems.find(item => item.id === product.id + (variant || ''))
        const stock = product.stock_quantity ?? Infinity

        if (existingItem) {
          const newQty = Math.min(existingItem.quantity + quantity, stock)
          set({
            items: currentItems.map(item =>
              item.id === product.id + (variant || '')
                ? { ...item, quantity: newQty }
                : item
            ),
          })
        } else {
          const initialQty = Math.min(quantity, stock)
          if (initialQty <= 0) return
          set({
            items: [...currentItems, { id: product.id + (variant || ''), product, quantity: initialQty, variant }],
          })
        }
        set({ isOpen: true }) // Open cart when item is added
      },
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id),
        })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map(item => {
            if (item.id !== id) return item
            const stock = item.product.stock_quantity ?? Infinity
            return { ...item, quantity: Math.min(quantity, stock) }
          }),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0)
      },
    }),
    {
      name: 'detersivi-party-cart',
    }
  )
)
