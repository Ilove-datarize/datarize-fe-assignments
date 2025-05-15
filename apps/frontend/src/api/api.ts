import axios from 'axios'
import { Customer, PurchaseFrequencyItem, PurchaseItem } from '../types'

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 5000,
})

export const fetchPurchaseFrequency = (params?: { from?: string; to?: string }): Promise<PurchaseFrequencyItem[]> => {
  return api.get('/purchase-frequency', { params }).then((res) => res.data)
}

export const fetchCustomers = (params?: { sortBy?: 'asc' | 'desc'; name?: string }): Promise<Customer[]> => {
  return api.get('/customers', { params }).then((res) => res.data)
}

export const fetchCustomerPurchases = (id: string | number): Promise<PurchaseItem[]> => {
  return api.get(`/customers/${id}/purchases`).then((res) => res.data)
}
