import { Suspense, lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const DashboardPage = lazy(() => import('../pages/Dashboard'))
const CustomerDetailPage = lazy(() => import('../pages/CustomerDetail'))

export const root: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense>
        <DashboardPage />
      </Suspense>
    ),
    shouldRevalidate: () => true,
  },
  {
    path: '/customers/:id/purchases',
    element: (
      <Suspense>
        <CustomerDetailPage />
      </Suspense>
    ),
  },
  {
    path: '/404',
    element: <div>404 Not Found</div>,
  },
  {
    path: '/error',
    element: <div>500 Internal Server Error</div>,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]
