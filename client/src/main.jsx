import { createRoot } from 'react-dom/client'
import './index.css'
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RegisterPage, LoginPage, DashboardPage } from './Pages'

// define all front routes for the page
const router = createBrowserRouter([{
  path: '/register',
  element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])


createRoot(document.getElementById('root')).render(
    <StrictMode>
    <RouterProvider router={router} />
    </StrictMode>
)
