import { RouterProvider, createBrowserRouter } from "react-router";
import { Register, Landing, Error, Login, About, Layout } from './Pages';

// Actions
import { action as RegisterAction } from "./Pages/Register";
import { action as loginAction } from "./Pages/Login";

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
    errorElement: <Error />
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: RegisterAction
  }
])


const App = () => {
    return <RouterProvider router={router} />
}

export default App;
