import React, { useEffect, useState } from 'react';
import { getAllBooks, getAllBorrowedBooks, getAllUsers } from '../../Servies/servies';
import NotificationList from '../../components/NotificationList';
import {db} from "../../../Firebase/firebase"
import {collection,getDocs} from "firebase/firestore"


function DashboardOverview() {

  const [allUser, setAllUser] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [notifications, setNotifications] = useState([
  ]);
  
  const fetchNotification=async()=>{
    const querySnapshot = await getDocs(collection(db,"notifications"))
    const notificationArray=querySnapshot.docs.map((doc) => {
     return {...doc.data(),id:doc.id} 
    });
    console.log(notificationArray)
    setNotifications(notificationArray);
  }


  useEffect(() => {
    // Replace this with your Firebase listener logic
    // Example: firebase.notifications.onSnapshot(...)
    // setNotifications(newNotificationsFromFirebase)
    fetchNotification();
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getUsers = async () => {
    try {
      const res = await getAllUsers(); // Assuming the response structure contains users in data.data
     
      const filterUser = res.data.data.filter((user) => {
        if (user.isAdmin !== true) {
          return user;
        }
      })
     
      setAllUser(filterUser);
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  const getBooks = async () => {
    const res = await getAllBooks(); // Assuming the response structure contains books in data.data
    setAllBooks(res.data.data);
  }

  const getBorrowedBooks = async () => {
    try {
      const res = await getAllBorrowedBooks(); // Assuming the response structure contains borrowed books in data.data
      setBorrowedBooks(res.data.data);
      // Process the borrowed books as needed
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  }

  useEffect(() => {
    getUsers();
    getBooks();
    getBorrowedBooks();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-[#343A40] mb-6">Admin Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Card 1: Total Users */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{allUser.length}</p>
        </div>

        {/* Example Card 2: Total Books */}
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-green-800">Total Books</h2>
          <p className="text-3xl font-bold text-green-600">{allBooks.length}</p>
        </div>

        {/* Example Card 3: Books Borrowed */}
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-yellow-800">Books Borrowed</h2>
          <p className="text-3xl font-bold text-yellow-600">{borrowedBooks.length}</p>
        </div>

        {/* Add more cards or sections as needed */}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#343A40] mb-4">Recent Activity</h2>
        <NotificationList notifications={notifications} onRemove={removeNotification} />
      </div>
    </div>
  );
}

export default DashboardOverview;