"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types/database'

export function useCategories() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const getCategories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      return data as Category[]
    },
  })

  const createCategory = useMutation({
    mutationFn: async (newCategory: Partial<Category>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Category>) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  return {
    ...getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
