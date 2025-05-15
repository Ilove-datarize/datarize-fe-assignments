import styled from '@emotion/styled'
import { Stack } from '../components/_common/Stack'
import { CustomerPurchaseTable } from '../components/CustomerPurchaseTable'
import { PurchaseFrequencyChart } from '../components/PurchaseFrequencyChart'

const Wrapper = styled(Stack)`
  padding: 16px;
  flex: 1;
`

export default function DashboardPage() {
  return (
    <Wrapper direction="column" gap={40} justify="center" align="center">
      <PurchaseFrequencyChart />
      <CustomerPurchaseTable />
    </Wrapper>
  )
}
