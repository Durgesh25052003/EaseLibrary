import React, { useEffect, useState } from 'react';
import { getAllBooks, getAllBorrowedBooks, getAllUsers } from '../../Servies/servies';
import NotificationList from '../../components/NotificationList';
import { db } from "../../../Firebase/firebase"
import { collection, deleteDoc, getDocs } from "firebase/firestore"
import {
  FiUsers,
  FiBook,
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

function DashboardOverview() {
  const [allUser, setAllUser] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingReturns, setPendingReturns] = useState(0)

  const fetchNotification = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "notifications"))
      const notificationArray = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      });
      setNotifications(notificationArray);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  const getUsers = async () => {
    try {
      const res = await getAllUsers();
      const filterUser = res.data.data.filter((user) => user.isAdmin !== true);
      setAllUser(filterUser);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const getBooks = async () => {
    try {
      const res = await getAllBooks();
      setAllBooks(res.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  const getBorrowedBooks = async () => {
    try {
      const res = await getAllBorrowedBooks();
      setBorrowedBooks(res.data.data);

      // Calculate pending returns (due date passed)
      const pending = res.data.data.filter(book => {
        const dueDate = new Date(book.dueDate);
        const today = new Date();
        return dueDate < today && book.status === 'borrowed';
      }).length;
      setPendingReturns(pending);

    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        getUsers(),
        getBooks(),
        getBorrowedBooks(),
        fetchNotification()
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const removeNotification = async (id) => {
    console.log(id)
    const querySnapshot = await getDocs(collection(db, "notifications"))
    console.log(querySnapshot)
    querySnapshot.forEach(async (doc) => {
      if (doc.id === id) {
        await deleteDoc(doc.ref)
      }
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const stats = [
    {
      title: "Total Books",
      value: allBooks.length,
      icon: FiBook,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Users",
      value: allUser.length,
      icon: FiUsers,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Books Borrowed",
      value: borrowedBooks.length,
      icon: FiTrendingUp,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Pending Returns",
      value: pendingReturns,
      icon: FiClock,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#FFD23F] text-white rounded-2xl mx-2">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100 text-lg">Welcome back! Here's what's happening in your library.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <FiTrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <FiActivity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <NotificationList notifications={notifications} onRemove={removeNotification} />
              </div>
            </div>
          </div>

          {/* Quick Actions & System Status */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center">
                    <FiCheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notifications</span>
                  <span className="text-sm text-gray-900">{notifications.length} active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overdue Books</span>
                  <div className="flex items-center">
                    <FiAlertCircle className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">{pendingReturns} items</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#00A8E8] to-[#007EA7] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Books</span>
                  <span className="font-bold">{allBooks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-bold">{allUser.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Borrowed</span>
                  <span className="font-bold">{borrowedBooks.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;