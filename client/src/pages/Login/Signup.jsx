import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUp } from '../../Servies/servies';
import toast, { Toaster } from 'react-hot-toast'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: null
  })
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Create FormData object for handling file upload
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('email', formData.email);
    formDataObj.append('password', formData.password);
    formDataObj.append('confirmPassword', formData.confirmPassword);
    if (formData.profilePic) {
      formDataObj.append('profilePic', formData.profilePic);
    }

    // Log the form data (replace with your API call)
    console.log('Form submitted:', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      hasProfilePic: !!formData.profilePic
    });

    //Here you would typically make your API call
    try {
     const res=await signUp(formDataObj);
      console.log(res);
      if(res.success===true){
        toast.success('Signup successful!');
      }else{
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during signup');
    }
  }
  

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, profilePic: file })
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] animate-gradient bg-gradient-size overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-2xl w-[450px] backdrop-blur-sm bg-opacity-90 mx-4">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-[#00A8E8] overflow-hidden transition-all duration-300 hover:border-[#007EA7]">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00A8E8]/10 to-[#007EA7]/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#00A8E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer bg-[#00A8E8] text-white p-2 rounded-full hover:bg-[#007EA7] transition-colors duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#343A40] font-['Poppins']">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 font-['Roboto']">Add a profile picture to personalize your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-2 font-['Roboto']">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] font-['Roboto']"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
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
              placeholder="Create a password"
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
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white rounded-md hover:opacity-90 transition-all duration-300 font-['Poppins'] font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#343A40] font-['Roboto']">
          Already have an account?{' '}
          <Link to="/" className="text-[#00A8E8] hover:text-[#007EA7] font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup