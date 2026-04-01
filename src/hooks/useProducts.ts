"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/database'

export interface ProductFilters {
  categorySlug?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  isFeatured?: boolean
  isNew?: boolean
  hasDiscount?: boolean
  status?: 'published' | 'draft' | 'archived'
  sortBy?: 'price' | 'name' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export function useProducts(filters: ProductFilters = {}) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const getProducts = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const selectStr = filters.categorySlug 
        ? `
          *,
          categories!inner (
            name,
            slug
          )
        `
        : `
          *,
          categories (
            name,
            slug
          )
        `

      let query = supabase
        .from('products')
        .select(selectStr)

      if (filters.status) {
        query = query.eq('status', filters.status)
      } else if (filters.categorySlug || filters.isFeatured || filters.isNew) {
        query = query.eq('status', 'published')
      }

      if (filters.categorySlug) {
        query = query.eq('categories.slug', filters.categorySlug)
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured)
      }

      if (filters.isNew !== undefined) {
        query = query.eq('is_new', filters.isNew)
      }

      if (filters.hasDiscount) {
        query = query.not('price_original', 'is', null).gt('price_original', 0)
      }

      const sortColumn = filters.sortBy || 'created_at'
      const sortAscending = filters.sortOrder === 'asc'

      const { data, error } = await query.order(sortColumn, { ascending: sortAscending })

      if (error) throw error
      return data as (Product & { categories: { name: string, slug: string } })[]
    },
  })

  const createProduct = useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return {
    ...getProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
