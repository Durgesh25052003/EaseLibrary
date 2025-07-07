import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

function AdminDashboard() {
  // In a real application, you would fetch user role from context/state
  // For now, let's assume a user is an admin for demonstration
  const isAdmin = true; // This should come from user authentication data


  const [ActiveTab, setActiveTab] = useState({
    Active1: false,
    Active2: false,
    Active3: false,
    Active4: false
  })



  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">Access Denied: Admins Only</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#00A8E8] to-[#007EA7] text-white p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center font-['Poppins']">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link
                to="/admin/dashboard"
                className={`block py-2 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active1 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Roboto']`}
                onClick={() => {
                  setActiveTab(() => {
                    return {
                      Active1: true,
                      Active2: false,
                      Active3: false,
                      Active4: false
                    }
                  })
                }}              >
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/admin/users"
                className={`block py-2 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active2 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Roboto']`}
                onClick={() => {
                  setActiveTab(() => {
                    return {
                      Active1: false,
                      Active2: true,
                      Active3: false,
                      Active4: false
                    }
                  })
                }}
              >
                Manage Users
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/admin/books"
                className={`block py-2 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active3 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Roboto']`}
                onClick={() => {
                  setActiveTab(() => {
                    return {
                      Active1: false,
                      Active2: false,
                      Active3: true,
                      Active4: false
                    }
                  })
                }}
              >
                Manage Books
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/admin/borrowedbooks"
                className={`block py-2 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active4 ? "bg-white text-[#007EA7]" : ""}   transition-colors duration-200 font-['Roboto']`}
                onClick={() => {
                  setActiveTab(() => {
                    return {
                      Active1: false,
                      Active2: false,
                      Active3: false,
                      Active4: true
                    }
                  })
                }}
              >
                Manage Borrowed Books
              </Link>
            </li>
            {/* Add more admin links here */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* This will render nested routes */}
      </main>
    </div>
  );
}

export default AdminDashboard;