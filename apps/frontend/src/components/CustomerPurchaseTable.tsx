import { FC, FormEvent, useRef } from 'react'
import { useCustomers } from '../api/hooks'
import styled from '@emotion/styled'
import { Stack } from './_common/Stack'
import { BaseText } from './_common/BaseText'
import { useMergedSearchParams } from '../hooks/useMergedSearchParams'
import { useNavigate } from 'react-router-dom'

const Container = styled.form`
  max-width: 800px;
  margin: 0 auto;
  height: 400px;
  overflow-y: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`

const ColGroup = styled.colgroup``

const Col = styled.col<{ w: string }>`
  width: ${(props) => props.w};
`

const Th = styled.th`
  padding: 8px;
  border-bottom: 1px solid #ccc;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RowLink = styled.a`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 8px;
  color: inherit;
  text-decoration: none;

  &:hover,
  &:focus {
    background-color: #f0f8ff;
    outline: 2px solid #005fcc;
  }
`
const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`

const SearchButton = styled.button`
  padding: 8px 16px;
  background-color: #005fcc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: #004bb5;
  }
`

const StickyHeader = styled(Stack)`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  padding: 16px 0;
`

const StickyTableHeader = styled.thead`
  position: sticky;
  top: 99px;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #ccc;
`

/**
 * 고객 구매 테이블 컴포넌트
 * 고객의 구매 내역을 보여주는 테이블로, 검색 및 정렬 기능이 포함되어 있습니다.
 */
export const CustomerPurchaseTable: FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useMergedSearchParams()
  const nameFilter = searchParams.get('name') || ''
  const sortDirection = searchParams.get('sort') === 'asc' ? 'asc' : 'desc'
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: customers = [], isLoading, isError, error } = useCustomers({ sortBy: sortDirection, name: nameFilter })

  const handleNameChange = (e: FormEvent) => {
    e.preventDefault()
    setSearchParams({
      name: inputRef.current?.value || '',
      sort: sortDirection,
    })
  }

  const toggleSort = () => {
    setSearchParams({ name: nameFilter, sort: sortDirection === 'asc' ? 'desc' : 'asc' })
  }

  const isEmpty = isError && (error as Error).message.includes('404')

  return (
    <Container onSubmit={handleNameChange}>
      <StickyHeader direction="column" gap={16}>
        <BaseText fontSize={18} fontWeight={700} as="h1">
          가장 많이 구매한 고객 목록
        </BaseText>
        <Stack direction="row" gap={8} align="center">
          <Input type="text" placeholder="고객 이름 검색" ref={inputRef} defaultValue={nameFilter} />
          <SearchButton type="submit">검색</SearchButton>
        </Stack>
      </StickyHeader>

      {isLoading && <p>로딩 중...</p>}
      {!isEmpty && isError && <p style={{ color: 'red' }}>에러 발생: {(error as Error).message}</p>}

      {((!isLoading && !isError) || isEmpty) && (
        <Table>
          <ColGroup>
            <Col w="25%" />
            <Col w="25%" />
            <Col w="25%" />
            <Col w="25%" />
          </ColGroup>
          <StickyTableHeader>
            <tr>
              <Th scope="col">ID</Th>
              <Th scope="col">이름</Th>
              <Th scope="col">총 구매 상품</Th>
              <Th scope="col" onClick={toggleSort} style={{ cursor: 'pointer' }}>
                총 구매 금액 {sortDirection === 'asc' ? '🔼' : '🔽'}
              </Th>
            </tr>
          </StickyTableHeader>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.id}>
                  <Td colSpan={4} style={{ padding: 0 }}>
                    <RowLink
                      href="#"
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault()
                        navigate(`/customers/${c.id}/purchases`)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/customers/${c.id}/purchases`)
                        }
                      }}
                      aria-label={`고객 ${c.name} 상세 페이지로 이동`}
                    >
                      <span>{c.id}</span>
                      <span>{c.name}</span>
                      <span>{c.count}</span>
                      <span>{c.totalAmount.toLocaleString()}원</span>
                    </RowLink>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan={4}>검색 결과가 없습니다.</Td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  )
}
