import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, beforeEach, vi, expect } from 'vitest'

vi.mock('react-chartjs-2', () => ({
  Chart: () => <div data-testid="chart-mock" />,
}))

vi.mock('../api/hooks', () => ({
  usePurchaseFrequency: vi.fn(),
}))
vi.mock('../hooks/useMergedSearchParams', () => ({
  useMergedSearchParams: vi.fn(),
}))

import { PurchaseFrequencyChart } from './PurchaseFrequencyChart'
import { usePurchaseFrequency } from '../api/hooks'
import { useMergedSearchParams } from '../hooks/useMergedSearchParams'
import { UseQueryResult } from '@tanstack/react-query'
import { PurchaseFrequencyItem } from '../types'

const mockedUsePurchaseFrequency = vi.mocked(usePurchaseFrequency)
const mockedUseMerged = vi.mocked(useMergedSearchParams)

describe('PurchaseFrequencyChart', () => {
  let setSearchParams: ReturnType<typeof vi.fn>
  const initialParams = new URLSearchParams({ from: '2024-07-01', to: '2024-07-31' })

  beforeEach(() => {
    vi.clearAllMocks()
    setSearchParams = vi.fn()
    mockedUseMerged.mockReturnValue([initialParams, setSearchParams] as const)
  })

  it('로딩 상태를 표시해야 합니다.', () => {
    mockedUsePurchaseFrequency.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<PurchaseFrequencyItem[], Error>)
    render(<PurchaseFrequencyChart />)
    expect(screen.getByText(/로딩 중/i)).toBeInTheDocument()
  })

  it('에러 상태를 표시해야 합니다.', () => {
    mockedUsePurchaseFrequency.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error('error'),
    } as unknown as UseQueryResult<PurchaseFrequencyItem[], Error>)
    render(<PurchaseFrequencyChart />)
    expect(screen.getByText(/에러 발생/i)).toBeInTheDocument()
  })

  it('데이터가 있을 때 차트를 렌더링해야 합니다.', () => {
    mockedUsePurchaseFrequency.mockReturnValue({
      data: [{ range: '0 - 10000', count: 2 }],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<PurchaseFrequencyItem[], Error>)
    render(<PurchaseFrequencyChart />)
    expect(screen.getByTestId('chart-mock')).toBeInTheDocument()
  })

  it('시작일을 업데이트하고 setSearchParams를 호출해야 합니다.', () => {
    mockedUsePurchaseFrequency.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<PurchaseFrequencyItem[], Error>)
    render(<PurchaseFrequencyChart />)
    const fromInput = screen.getByLabelText(/시작일/i)
    fireEvent.change(fromInput, { target: { value: '2024-07-10' } })
    expect(setSearchParams).toHaveBeenCalledWith(expect.objectContaining({ from: '2024-07-10', to: '2024-07-31' }))
  })

  it('잘못된 날짜 범위에 대해 경고를 표시해야 합니다.', () => {
    mockedUsePurchaseFrequency.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as UseQueryResult<PurchaseFrequencyItem[], Error>)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<PurchaseFrequencyChart />)
    const fromInput = screen.getByLabelText(/시작일/i)
    fireEvent.change(fromInput, { target: { value: '2024-08-01' } })
    expect(alertSpy).toHaveBeenCalledWith('시작일은 종료일보다 늦을 수 없습니다.')
    alertSpy.mockRestore()
  })
})
