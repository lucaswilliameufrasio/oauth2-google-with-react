import {
  Link,
  Outlet,
  ReactLocation,
  Router as ReactLocationRouter,
} from '@tanstack/react-location'
import { AuthorizationCodeFlow } from '../features/Authentication/AuthorizationCodeFlow/AuthorizationCodeFlow.page'
import { SelectAuthFlowPage } from '../features/Authentication/SelectAuthFlow/SelectAuthFlow.page'
import { ImplicitFlow } from '../features/Authentication/ImplicitFlow/ImplicitFlow.page'
import { Navbar } from '../components/Navbar/Navbar.page'


const location = new ReactLocation()

const routes = [
  { path: '/', element: <SelectAuthFlowPage /> },
  {
    path: 'auth',
    children: [
      { path: '/implicit', element: <ImplicitFlow /> },
      {
        path: '/authorization',
        element: <AuthorizationCodeFlow />,
      },
    ],
  },
]

export function Router() {
  return (
    <ReactLocationRouter location={location} routes={routes}>
      <Navbar />
      <Outlet /> {/* Start rendering router matches */}
    </ReactLocationRouter>
  )
}
