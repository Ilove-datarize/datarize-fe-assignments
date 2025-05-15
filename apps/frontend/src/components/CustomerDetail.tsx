import { FC } from 'react'
import { useParams } from 'react-router-dom'
import styled from '@emotion/styled'
import { Stack } from './_common/Stack'
import { BaseText } from './_common/BaseText'
import { useCustomerPurchases } from '../api/hooks'

const Table = styled.table`
  border-collapse: collapse;
  width: 800px;
`

const Th = styled.th`
  padding: 8px;
  border-bottom: 1px solid #ccc;
  text-align: center;
`

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: center;
  vertical-align: middle;
`

const Img = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
`

const NoResultsRow = styled.tr`
  td {
    text-align: center;
    padding: 16px;
  }
`

/**
 * 특정 고객의 구매 내역을 경로 파라미터에서 가져와 테이블로 보여주는 컴포넌트
 */
export const CustomerDetail: FC = () => {
  const { id } = useParams<{ id: string }>()
  const customerId = id ?? ''
  const { data: purchases = [], isLoading, isError, error } = useCustomerPurchases(customerId)

  return (
    <Stack direction="column" gap={16}>
      <BaseText fontSize={20} fontWeight={700} as="h1">
        고객 {customerId}님의 구매 내역
      </BaseText>

      {isLoading && <p>로딩 중...</p>}
      {isError && <p style={{ color: 'red' }}>에러 발생: {(error as Error).message}</p>}

      {!isLoading && !isError && (
        <Table>
          <thead>
            <tr>
              <Th>이미지</Th>
              <Th>구매 일자</Th>
              <Th>상품명</Th>
              <Th>수량</Th>
              <Th>가격</Th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((p) => (
                <tr key={`${p.date}-${p.product}`}>
                  <Td>
                    <Img src={p.imgSrc} alt={p.product} />
                  </Td>
                  <Td>{p.date}</Td>
                  <Td>{p.product}</Td>
                  <Td>{p.quantity}</Td>
                  <Td>{p.price.toLocaleString()}원</Td>
                </tr>
              ))
            ) : (
              <NoResultsRow>
                <Td colSpan={5}>구매 내역이 없습니다.</Td>
              </NoResultsRow>
            )}
          </tbody>
        </Table>
      )}
    </Stack>
  )
}
