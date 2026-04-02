"use client"

import { createClient } from "@/lib/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Database } from "@/types/database"

type Order = Database['public']['Tables']['orders']['Row']

export function useOrders(filters: { status?: string, userId?: string } = {}) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const getOrders = useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
      
      if (filters && filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters && filters.userId) {
        query = query.eq('user_id', filters.userId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Order[]
    },
    refetchInterval: 10000, // <-- LIVE POLLING OGNI 10 SECONDI
  })

  const getMyOrders = (userId: string) => useQuery({
    queryKey: ['orders', 'my', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!userId,
    refetchInterval: 10000, // <-- LIVE POLLING OGNI 10 SECONDI
  })

  const createOrder = useMutation({
    mutationFn: async (orderData: Omit<Database['public']['Tables']['orders']['Insert'], 'order_number'> & { items: Database['public']['Tables']['order_items']['Insert'][] }) => {
      const { items, ...order } = orderData

      // Use getUser() — always server-verified, never stale
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      console.log('[createOrder] authUser:', authUser?.id ?? 'null', 'authError:', authError?.message)
      
      if (!authUser) {
        throw new Error('Devi essere loggato per inviare un ordine. Per favore accedi e riprova.')
      }

      // 1. Create order — generate unique order number
      const randomPart = Math.floor(1000 + Math.random() * 9000)
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '')
      const orderNumber = `#${datePart}-${randomPart}`

      const { data: orderResponse, error: orderError } = await supabase
        .from('orders')
        .insert([{
          ...order,
          user_id: authUser.id,
          order_number: orderNumber
        }])
        .select()
        .single()
      
      if (orderError) throw orderError

      // 2. Create order items
      const itemsToInsert = items.map(item => ({
        ...item,
        order_id: orderResponse.id
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert)
      
      if (itemsError) throw itemsError

      // 3. Decrement stock for each ordered product (non-fatal: order is already saved)
      await Promise.allSettled(
        items.map(async item => {
          if (!item.product_id) return
          const { data: prod } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single()
          if (!prod) return
          const newStock = Math.max(0, (prod.stock_quantity ?? 0) - item.quantity)
          await supabase
            .from('products')
            .update({ stock_quantity: newStock })
            .eq('id', item.product_id)
        })
      )

      return orderResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
      
      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('Impossibile aggiornare: permesso negato o ordine non trovato.')
      }
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  return {
    getOrders,
    getMyOrders,
    createOrder,
    updateOrderStatus
  }
}
