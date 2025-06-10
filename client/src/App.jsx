import { RouterProvider, createBrowserRouter } from "react-router";
import { Register, Landing, Error, Login, About, Layout, Dashboard } from './Pages';

// loaders
import { loader as dashboardLoader } from './Pages/Dashboard';

// Actions
import { action as RegisterAction } from "./Pages/Register";
import { action as loginAction } from "./Pages/Login";
import { store } from './store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        // Set landing page as the root page
        index: true,
        errorElement: <Error />,
        element: <Landing />,
      },
      {
        path: 'about',
        element: <About />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: RegisterAction
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    errorElement: <Error />,
    loader: dashboardLoader(store),
  }
])


const App = () => {
    return <RouterProvider router={router} />
}

export default App;
