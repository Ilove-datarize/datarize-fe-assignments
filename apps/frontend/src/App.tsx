import { Global } from '@emotion/react'
import { RootRouter } from './routes/rootRouter'
import { globalStyles } from './styles/globalStyles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'

function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 0,
          },
        },
      }),
    [],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Global styles={globalStyles} />
      <div className="app">
        <RootRouter />
      </div>
    </QueryClientProvider>
  )
}

export default App
