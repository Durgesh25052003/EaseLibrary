import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import UserRouter from '../../../../../server/Routes/UserRoutes'

function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubmitting(true)
    try {
      // Add your password reset API call here
      const res=UserRouter.get("/forget-password", {
        email
      })
      console.log(res);
      toast.success('Password reset link sent to your email!')
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 backdrop-blur-sm bg-opacity-90 mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#343A40] font-['Poppins'] mb-2">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-600 font-['Roboto']">
            Enter your email address to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2 font-['Roboto']">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] font-['Roboto']"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white rounded-md hover:opacity-90 transition-all duration-300 font-['Poppins'] font-semibold disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm text-[#00A8E8] hover:text-[#007EA7] font-['Roboto'] font-semibold"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword