import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faBook,
  faClipboardList,
  faExchangeAlt,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';

function AdminDashboard() {
  // In a real application, you would fetch user role from context/state
  // For now, let's assume a user is an admin for demonstration
  const isAdmin = true; // This should come from user authentication data

  const [ActiveTab, setActiveTab] = useState({
    Active1: true,
    Active2: false,
    Active3: false,
    Active4: false,
    Active5: false,
  })

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">Access Denied: Admins Only</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] text-white p-6 shadow-lg flex-shrink-0 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8 text-center font-['Poppins'] flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faUserShield} />
          Admin Panel
        </h2>
        <nav>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 py-3 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active1 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Poppins'] font-semibold text-lg`}
                onClick={() => {
                  setActiveTab({
                    Active1: true,
                    Active2: false,
                    Active3: false,
                    Active4: false,
                    Active5: false,
                  })
                }}
              >
                <FontAwesomeIcon icon={faTachometerAlt} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className={`flex items-center gap-3 py-3 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active2 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Poppins'] font-semibold text-lg`}
                onClick={() => {
                  setActiveTab({
                    Active1: false,
                    Active2: true,
                    Active3: false,
                    Active4: false,
                    Active5: false,
                  })
                }}
              >
                <FontAwesomeIcon icon={faUsers} />
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                to="/admin/books"
                className={`flex items-center gap-3 py-3 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active3 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Poppins'] font-semibold text-lg`}
                onClick={() => {
                  setActiveTab({
                    Active1: false,
                    Active2: false,
                    Active3: true,
                    Active4: false,
                    Active5: false,
                  })
                }}
              >
                <FontAwesomeIcon icon={faBook} />
                Manage Books
              </Link>
            </li>
            <li>
              <Link
                to="/admin/borrowedbooks"
                className={`flex items-center gap-3 py-3 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active4 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Poppins'] font-semibold text-lg`}
                onClick={() => {
                  setActiveTab({
                    Active1: false,
                    Active2: false,
                    Active3: false,
                    Active4: true,
                    Active5: false
                  })
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} />
                Borrowed Books
              </Link>
            </li>
            <li>
              <Link
                to="/admin/borrowRequest"
                className={`flex items-center gap-3 py-3 px-4 rounded-md hover:bg-white hover:text-[#007EA7] ${ActiveTab.Active5 ? "bg-white text-[#007EA7]" : ""} transition-colors duration-200 font-['Poppins'] font-semibold text-lg`}
                onClick={() => {
                  setActiveTab({
                    Active1: false,
                    Active2: false,
                    Active3: false,
                    Active4: false,
                    Active5: true
                  })
                }}
              >
                <FontAwesomeIcon icon={faExchangeAlt} />
                Borrow Requests
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> {/* This will render nested routes */}
      </main>
    </div>
  );
}

export default AdminDashboard;