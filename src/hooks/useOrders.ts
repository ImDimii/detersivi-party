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
    enabled: !!userId
  })

  const createOrder = useMutation({
    mutationFn: async (orderData: Omit<Database['public']['Tables']['orders']['Insert'], 'order_number'> & { items: Database['public']['Tables']['order_items']['Insert'][] }) => {
      const { items, ...order } = orderData
      
      // 1. Create order
      const { data: orderResponse, error: orderError } = await supabase
        .from('orders')
        .insert([{ 
          ...order, 
          order_number: `ORD-${Date.now()}` 
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

      return orderResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
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
