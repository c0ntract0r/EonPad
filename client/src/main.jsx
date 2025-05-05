import { createRoot } from 'react-dom/client'
import './index.css'
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RegisterPage, LoginPage, DashboardPage } from './Pages'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import queryClient from './services/queryClient';
import { QueryClientProvider } from "@tanstack/react-query"

// define all front routes for the page
const router = createBrowserRouter([{
  path: '/register',
  element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: 'puc'
  }
])


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
)
