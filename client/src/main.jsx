import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <ToastContainer position='top-center' />
  </Provider>
)

/* 

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
])


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
)

*/