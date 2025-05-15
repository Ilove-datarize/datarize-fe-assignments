import styled from '@emotion/styled'
import { Stack } from '../components/_common/Stack'
import { CustomerDetail } from '../components/CustomerDetail'

const Wrapper = styled(Stack)`
  padding: 16px;
  flex: 1;
`

export default function CustomerDetailPage() {
  return (
    <Wrapper gap={40} justify="center" align="center">
      <CustomerDetail />
    </Wrapper>
  )
}
