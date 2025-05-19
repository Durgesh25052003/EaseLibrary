import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import ForgetPassword from './pages/Login/ForgetPassword/ForgetPassword';
import ResetPassword from './pages/Login/ResetPassword';

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
  }
  // {
  //   path:'/admin',
  //   element:<Admin/>
  // }
  
])

function App() {
  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App
