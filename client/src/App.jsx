import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import ForgetPassword from './pages/Login/ForgetPassword/ForgetPassword';
import ResetPassword from './pages/Login/ResetPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DashboardOverview from './pages/Admin/DashboardOverview'; // Import the new component
import ManageUsers from './pages/Admin/ManageUsers';
import ManageBooks from './pages/Admin/ManageBooks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/forgot-password',
    element: <ForgetPassword />
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
    children: [
      {
        path: 'dashboard', // /admin/dashboard
        element: <DashboardOverview /> // Use the new component here
      },
      {
        path: 'users', // /admin/users
        element: <ManageUsers /> // Use the new component here
      },
      {
        path: 'books', // /admin/books
        element: <ManageBooks />
      }
    ]
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
