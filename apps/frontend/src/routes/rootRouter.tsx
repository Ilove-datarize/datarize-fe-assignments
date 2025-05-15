import { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { root } from './root'

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(root)

export const RootRouter: FC = () => {
  return <RouterProvider router={router} />
}
