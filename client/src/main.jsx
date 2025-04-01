import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RegisterPage, LoginPage, DashboardPage } from './Pages'

// define all front routes for the page
const router = createBrowserRouter([{
  path: '/register',
  element: <RegisterPage />,
  }
])


createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
