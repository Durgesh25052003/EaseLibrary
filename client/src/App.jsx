import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import ForgetPassword from './pages/Login/ForgetPassword/ForgetPassword';
import ResetPassword from './pages/Login/ResetPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DashboardOverview from './pages/Admin/DashboardOverview'; // Import the new component

const router= createBrowserRouter([
  {
    path:'/',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/forgot-password',
    element:<ForgetPassword/>
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
        element: <h1 className="text-4xl font-bold text-[#343A40]">Manage Users</h1>
      },
      {
        path: 'books', // /admin/books
        element: <h1 className="text-4xl font-bold text-[#343A40]">Manage Books</h1>
      }
    ]
  }
])

function App() {
  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App;
