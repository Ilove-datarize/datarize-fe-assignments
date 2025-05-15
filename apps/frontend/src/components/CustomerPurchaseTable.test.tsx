import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, vi, expect } from 'vitest'
import { useCustomers } from '../api/hooks'
import { CustomerPurchaseTable } from './CustomerPurchaseTable'
import { useMergedSearchParams } from '../hooks/useMergedSearchParams'
import { UseQueryResult } from '@tanstack/react-query'
import { Customer } from '../types'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const renderCustomerPurchaseTable = () => {
  render(
    <MemoryRouter initialEntries={['/?name=&sort=asc']}>
      <Routes>
        <Route path="*" element={<CustomerPurchaseTable />} />
      </Routes>
    </MemoryRouter>,
  )
}

vi.mock('../hooks/useMergedSearchParams', () => ({
  useMergedSearchParams: vi.fn(),
}))
vi.mock('../api/hooks', () => ({
  useCustomers: vi.fn(),
}))

const mockedUseMerged = vi.mocked(useMergedSearchParams, true)
const mockedUseCustomers = vi.mocked(useCustomers, true)

describe('CustomerPurchaseTable', () => {
  let setSearchParams: ReturnType<typeof vi.fn>
  const initialSearchParams = new URLSearchParams({ name: 'init', sort: 'asc' })

  beforeEach(() => {
    vi.clearAllMocks()
    setSearchParams = vi.fn()
    mockedUseMerged.mockReturnValue([initialSearchParams, setSearchParams] as const)
  })

  it('로딩 상태를 렌더링해야 합니다.', () => {
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<Customer[], Error>)
    renderCustomerPurchaseTable()
    expect(screen.getByText(/로딩 중/i)).toBeInTheDocument()
  })

  it('에러 상태를 렌더링해야 합니다.', () => {
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error('fail'),
    } as unknown as UseQueryResult<Customer[], Error>)
    renderCustomerPurchaseTable()
    expect(screen.getByText(/에러 발생/i)).toBeInTheDocument()
  })

  it('고객 데이터를 렌더링해야 합니다.', () => {
    mockedUseCustomers.mockReturnValue({
      data: [{ id: 1, name: '홍길동', count: 9, totalAmount: 1000 }],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<Customer[], Error>)
    renderCustomerPurchaseTable()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText(/1,000원/)).toBeInTheDocument()
  })

  it('검색을 제출하고 쿼리 파라미터를 업데이트해야 합니다.', async () => {
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<Customer[], Error>)
    renderCustomerPurchaseTable()
    const input = screen.getByPlaceholderText('고객 이름 검색')
    fireEvent.change(input, { target: { value: '김' } })
    fireEvent.click(screen.getByRole('button', { name: /검색/i }))
    await waitFor(() => {
      expect(setSearchParams).toHaveBeenCalledWith({ name: '김', sort: 'asc' })
    })
  })

  it('총 구매 금액 헤더를 클릭하면 정렬 방향을 토글해야 합니다.', async () => {
    mockedUseMerged.mockReturnValue([new URLSearchParams({ name: '', sort: 'asc' }), setSearchParams] as const)
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<Customer[], Error>)
    renderCustomerPurchaseTable()
    const header = screen.getByText(/총 구매 금액/)
    fireEvent.click(header)
    await waitFor(() => {
      expect(setSearchParams).toHaveBeenCalledWith({ name: '', sort: 'desc' })
    })
  })
})
