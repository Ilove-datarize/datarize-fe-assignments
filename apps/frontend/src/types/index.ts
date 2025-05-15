export interface PurchaseFrequencyItem {
  range: string
  count: number
}

export interface Customer {
  id: number
  name: string
  count: number
  totalAmount: number
}

export interface PurchaseItem {
  date: string
  quantity: number
  product: string
  price: number
  imgSrc: string
}

export type SortBy = 'asc' | 'desc'
