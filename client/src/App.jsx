import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import ForgetPassword from './pages/Login/ForgetPassword/ForgetPassword';
import ResetPassword from './pages/Login/ResetPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DashboardOverview from './pages/Admin/DashboardOverview'; // Import the new component
import ManageUsers from './pages/Admin/ManageUsers';
import ManageBorrowedBooks from './pages/Admin/ManageBorrowedBooks';
import ManageBooks from './pages/Admin/ManageBooks';
import { ToastContainer } from 'react-toastify';

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
        path: "books",
        element: <ManageBooks />
      },
      {
        path: 'borrowedbooks', // /admin/borrowedbooks
        element: <ManageBorrowedBooks /> // Use the new component here
      }
    ]
  }
])

function App() {
  return (
    <>
       <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App;
