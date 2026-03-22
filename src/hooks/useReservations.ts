"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Reservation } from '@/types/database'

export function useReservations(filters: { status?: string, userId?: string } = {}) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const getReservations = useQuery({
    queryKey: ['reservations', filters],
    queryFn: async () => {
      let query = supabase
        .from('reservations')
        .select('*')
      
      if (filters && filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters && filters.userId) {
        query = query.eq('user_id', filters.userId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Reservation[]
    },
  })

  const getMyReservations = (userId: string) => useQuery({
    queryKey: ['reservations', 'my', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .order('event_date', { ascending: true })
      
      if (error) throw error
      return data
    },
    enabled: !!userId
  })

  const createReservation = useMutation({
    mutationFn: async (newReservation: Partial<Reservation>) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert([newReservation])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    }
  })

  const updateReservationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Reservation['status'] }) => {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    }
  })

  return {
    getReservations,
    getMyReservations,
    createReservation,
    updateReservationStatus
  }
}
