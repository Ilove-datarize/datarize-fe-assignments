import { Chart } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  LineElement,
  PointElement,
  ChartData,
} from 'chart.js'
import styled from '@emotion/styled'
import { formatISO, isValid, parseISO } from 'date-fns'
import { usePurchaseFrequency } from '../api/hooks'
import { BaseText } from './_common/BaseText'
import { Stack } from './_common/Stack'
import { useMergedSearchParams } from '../hooks/useMergedSearchParams'
import { useMemo } from 'react'

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

const ErrorContainer = styled(Stack)`
  border: 1px solid red;
  padding: 16px;
  height: 300px;
  width: 800px;
`

const ChartContainer = styled(Stack)`
  width: 800px;
  height: 400px;
`

const getSafeDate = (value: string | null, fallback: string) => {
  return value && isValid(parseISO(value)) ? value : fallback
}

/**
 * 가격대별 구매 빈도를 바 차트로 시각화하는 컴포넌트 + 라인 차트 추가 구현
 */
export const PurchaseFrequencyChart = () => {
  const [searchParams, setSearchParams] = useMergedSearchParams()

  const lastJulyStart = formatISO(new Date('2024-07-01'), { representation: 'date' })
  const lastJulyEnd = formatISO(new Date('2024-07-31'), { representation: 'date' })

  const from = getSafeDate(searchParams.get('from'), lastJulyStart)
  const to = getSafeDate(searchParams.get('to'), lastJulyEnd)

  const { data = [], isLoading, isError, error } = usePurchaseFrequency({ from, to })

  const updateDate = (key: 'from' | 'to', value: string) => {
    if (key === 'from' && new Date(value) > new Date(to)) {
      alert('시작일은 종료일보다 늦을 수 없습니다.')
      return
    }

    if (key === 'to' && new Date(value) < new Date(from)) {
      alert('종료일은 시작일보다 이를 수 없습니다.')
      return
    }
    setSearchParams({ ...Object.fromEntries(searchParams), [key]: value })
  }

  const labels = useMemo(() => data.map((item) => item.range), [data])
  const barValues = useMemo(() => data.map((item) => item.count), [data])

  const lineValues = useMemo(() => {
    let sum = 0
    return data.map((item) => (sum += item.count))
  }, [data])

  const dataCombined: ChartData<'bar' | 'line'> = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: '구매 수',
        data: barValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        type: 'line' as const,
        label: '누적 구매 수',
        data: lineValues,
        borderColor: 'rgba(255, 99, 132, 0.8)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  }

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val =
              ctx.dataset.type === 'bar'
                ? `${ctx.parsed.y.toLocaleString('ko-KR')}건`
                : `${ctx.parsed.y.toLocaleString('ko-KR')}건 (누적)`
            return val
          },
          title: (ctx) => {
            const label = ctx[0].label
            const range = label.split(' - ')
            const start = range[0].replace(/,/g, '')
            const end = range[1].replace(/,/g, '')
            const startNum = parseInt(start, 10)
            const endNum = parseInt(end, 10)
            const startFormatted = startNum.toLocaleString('ko-KR')
            const endFormatted = endNum.toLocaleString('ko-KR')
            return `${startFormatted}원 - ${endFormatted}원`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: '구매 수 (건)' },
      },
      x: {
        title: { display: true, text: '가격대 (원)' },
      },
    },
  }

  return (
    <Stack direction="column" gap={16}>
      <BaseText fontSize={18} fontWeight={700}>
        가격대별 구매 빈도
      </BaseText>

      {/* 날짜 선택 UI */}
      <Stack direction="row" gap={24} align="center">
        <label>
          시작일:
          <input type="date" value={from} onChange={(e) => updateDate('from', e.target.value)} />
        </label>
        <label>
          종료일:
          <input type="date" value={to} onChange={(e) => updateDate('to', e.target.value)} />
        </label>
      </Stack>

      {isLoading && <p>로딩 중...</p>}
      {isError && (
        <ErrorContainer direction="column" align="center" justify="center">
          <p style={{ color: 'red' }}>에러 발생: {(error as Error).message}</p>
        </ErrorContainer>
      )}
      {!isLoading && !isError && (
        <ChartContainer>
          <Chart data={dataCombined} options={options} type="bar" />
        </ChartContainer>
      )}
    </Stack>
  )
}
