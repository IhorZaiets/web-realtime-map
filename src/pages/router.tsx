import { routes } from '@/shared'
import { createBrowserRouter } from 'react-router-dom'
import { LogInPage } from './login-page'
import { MapPage } from './map-page'

export const router = createBrowserRouter([
  {
    path: routes.MAP,
    element: <MapPage />,
  },
  {
    path: routes.LOGIN,
    element: <LogInPage />,
  },
])
