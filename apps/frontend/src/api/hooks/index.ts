import { useQuery } from '@tanstack/react-query'
import { fetchPurchaseFrequency, fetchCustomers, fetchCustomerPurchases } from '../api'
import { Customer, PurchaseFrequencyItem, PurchaseItem, SortBy } from '../../types'

// 1. 구매 빈도 데이터
export const usePurchaseFrequency = (params?: { from?: string; to?: string }) => {
  return useQuery<PurchaseFrequencyItem[]>({
    queryKey: ['purchaseFrequency', params],
    queryFn: () => fetchPurchaseFrequency(params),
  })
}

// 2. 고객 목록
export const useCustomers = (params?: { sortBy?: SortBy; name?: string }) => {
  return useQuery<Customer[]>({
    queryKey: ['customers', params],
    queryFn: () => fetchCustomers(params),
  })
}

// 3. 특정 고객의 구매 내역
export const useCustomerPurchases = (id: string | number) => {
  return useQuery<PurchaseItem[]>({
    queryKey: ['customerPurchases', id],
    queryFn: () => fetchCustomerPurchases(id),
    enabled: !!id, // id가 있을 때만 fetch
  })
}
