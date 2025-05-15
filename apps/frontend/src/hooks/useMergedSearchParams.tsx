import { useSearchParams } from 'react-router-dom'

type Params = Record<string, string | number | boolean | null | undefined>

/**
 * 기존 쿼리파라미터는 그대로 두고,
 * 전달한 키·값만 반영해서 setSearchParams 해주는 훅
 */
export function useMergedSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateSearchParams = (updates: Params) => {
    const next = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value == null || value === '') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })

    setSearchParams(next)
  }

  return [searchParams, updateSearchParams] as const
}
