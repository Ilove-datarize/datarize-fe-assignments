import { render, screen } from '@testing-library/react'
import { describe, it, beforeEach, vi, expect } from 'vitest'
import type { UseQueryResult } from '@tanstack/react-query'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))
vi.mock('../api/hooks', () => ({
  useCustomerPurchases: vi.fn(),
}))

import { useParams } from 'react-router-dom'
import { useCustomerPurchases } from '../api/hooks'
import { CustomerDetail } from './CustomerDetail'
import { PurchaseItem } from '../types'

const mockedUseParams = vi.mocked(useParams)
const mockedUseCustomerPurchases = vi.mocked(useCustomerPurchases)

describe('CustomerDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseParams.mockReturnValue({ id: '123' })
  })

  it('로딩 중일 때 로딩 메시지를 표시합니다', () => {
    mockedUseCustomerPurchases.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<PurchaseItem[], Error>)

    render(<CustomerDetail />)
    expect(screen.getByText(/로딩 중/i)).toBeInTheDocument()
  })

  it('에러 발생 시 에러 메시지를 표시합니다', () => {
    mockedUseCustomerPurchases.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error('테스트 에러'),
    } as unknown as UseQueryResult<PurchaseItem[], Error>)

    render(<CustomerDetail />)
    expect(screen.getByText(/에러 발생/i)).toBeInTheDocument()
  })

  it('데이터가 없으면 "구매 내역이 없습니다." 메시지를 표시합니다', () => {
    mockedUseCustomerPurchases.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<PurchaseItem[], Error>)

    render(<CustomerDetail />)
    expect(screen.getByText(/구매 내역이 없습니다./i)).toBeInTheDocument()
  })

  it('구매 내역이 있으면 테이블 행으로 렌더링합니다', () => {
    const purchases = [
      {
        date: '2024-07-03',
        product: '코트',
        quantity: 4,
        price: 400000,
        imgSrc: 'http://localhost:4000/imgs/coat.jpg',
      },
    ]
    mockedUseCustomerPurchases.mockReturnValue({
      data: purchases,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<typeof purchases, Error>)

    render(<CustomerDetail />)
    const img = screen.getByRole('img', { name: /코트/ })
    expect(img).toHaveAttribute('src', purchases[0].imgSrc)
    expect(screen.getByText('2024-07-03')).toBeInTheDocument()
    expect(screen.getByText('코트')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText(/400,000원/)).toBeInTheDocument()
  })
})
