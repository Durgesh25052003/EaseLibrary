import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { resetPassword } from '../../Servies/servies'
import toast, { Toaster } from 'react-hot-toast'

function ResetPassword() {
  const { token } = useParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const res = await resetPassword(formData.password, token)
      if (res.success) {
        toast.success('Password reset successful')
      }
    } catch (error) {
      toast.error('Password reset failed')
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] overflow-hidden">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 backdrop-blur-sm bg-opacity-90 mx-4">
        <h2 className="text-4xl font-bold mb-6 text-center text-[#343A40] font-['Poppins']">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2 font-['Roboto']">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] font-['Roboto']"
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2 font-['Roboto']">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] font-['Roboto']"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white rounded-md hover:opacity-90 transition-all duration-300 font-['Poppins'] font-semibold"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword