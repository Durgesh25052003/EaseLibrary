import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../Servies/servies'
import toast, { Toaster } from 'react-hot-toast'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await login(formData);
      console.log(res);
      if (res.success===true) {
        toast.success('Login successful!');
        // Add navigation logic here if needed
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Login failed. Please try again.');
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 backdrop-blur-sm bg-opacity-90 mx-4">
        <h2 className="text-4xl font-bold mb-6 text-center text-[#343A40] font-['Poppins']">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2 font-['Roboto']">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] font-['Roboto']"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2 font-['Roboto']">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] font-['Roboto']"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-sm text-[#00A8E8] hover:text-[#007EA7] font-['Roboto']">
                Forgot Password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white rounded-md hover:opacity-90 transition-all duration-300 font-['Poppins'] font-semibold"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#343A40] font-['Roboto']">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#00A8E8] hover:text-[#007EA7] font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login