import './App.css';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
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
import UserDashboard from './pages/User/userDashboard';
import UserDiscover from './pages/User/UserDiscover';
import BookDesc from './pages/User/BookDescription';
import BookDescription from './pages/User/BookDescription';
import BorrowedBooks from './pages/User/BorrowedBooks';
import Category from './pages/User/Category';
import BorrowCodeVerification from './components/BorrowCodeVerification';
import Profile from './pages/User/Profile';
import EditProfile from './pages/User/EditProfile';
import UserDetails from './pages/Admin/UserDetails';
import { FullScreenLoading } from './components/LoadingBar';
import UserHistory from './pages/User/UserHistory';
import AuthSuccess from './pages/Login/Auth-Success';


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
    path:"/google-success",
    element:<AuthSuccess/>
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
      },
      {
        path: 'borrowRequest',
        element: <BorrowCodeVerification />
      }
    ]
  },
  {
    path: '/admin/user/:userId',
    element: <UserDetails />
  },
  {
    path: '/user',
    element: <UserDashboard />,
    children: [
      {
        path: 'discover',
        element: <UserDiscover />
      },
      {
        path: 'history',
        element: <UserHistory />
      }
    ]
  },
  {
    path: '/user/profile',
    element: <Profile /> // View profile
  },
  {
    path: '/user/edit',
    element: <EditProfile /> // Edit profile
  },
  {
    path: '/user/bookdesc/:bookId',
    element: <BookDesc />
  },
  {
    path: '/user/borrowedbooks',
    element: <BorrowedBooks />
  },
  {
    path: '/user/category',
    element: <Category />
  }
])




function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      <ToastContainer />
      {showSplash ? (
        <SplashScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          <FullScreenLoading isLoading={isLoading} type="spinner" text="Loading content..." />
          <RouterProvider router={router} />
        </>
      )}
    </>
  )
}

export default App;
