/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useMergedSearchParams } from './useMergedSearchParams'

const TestComponent = ({ updates }: { updates: Record<string, string | number | boolean | null | undefined> }) => {
  const [searchParams, updateSearchParams] = useMergedSearchParams()
  useEffect(() => {
    updateSearchParams(updates)
  }, [])
  return <div data-testid="params">{searchParams.toString()}</div>
}

describe('useMergedSearchParams', () => {
  it('기존 파라미터를 유지하고 새로운 파라미터를 추가해야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/?a=1&b=2']}>
        <Routes>
          <Route path="*" element={<TestComponent updates={{ foo: 'bar' }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('params').textContent).toBe('a=1&b=2&foo=bar')
    })
  })

  it('기존 파라미터 값을 업데이트해야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/?a=1&b=2']}>
        <Routes>
          <Route path="*" element={<TestComponent updates={{ b: '5' }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('params').textContent).toBe('a=1&b=5')
    })
  })

  it('값이 null 또는 빈 문자열일 경우 파라미터를 삭제해야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/?a=1&b=2&c=3']}>
        <Routes>
          <Route path="*" element={<TestComponent updates={{ a: '', c: null }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('params').textContent).toBe('b=2')
    })
  })
})
