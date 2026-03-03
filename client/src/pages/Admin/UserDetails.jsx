import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, getAllBorrowedBooks, getAllBooks } from '../../Servies/servies';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiBook,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiHeart,
  FiStar
} from 'react-icons/fi';

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(userId)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, borrowedRes, booksRes] = await Promise.all([
          getUserById(userId),
          getAllBorrowedBooks(),
          getAllBooks()
        ]);
        console.log(userRes);
        console.log(borrowedRes)
        console.log(booksRes)


        setUser(userRes.data.user);

        const userBorrowedBooks = borrowedRes.data.data.filter(
          book => book.user._id === userId
        );
        setBorrowedBooks(userBorrowedBooks);

        const allBooksData = booksRes.data.data;
        setAllBooks(allBooksData);

        if (userRes.data.user.favorites) {
          const userFavorites = allBooksData.filter(book =>
            userRes.data.user.favorites.includes(book._id)
          );
          setFavoriteBooks(userFavorites);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const getBookDetails = (bookId) => {
    return allBooks.find(book => book._id === bookId);
  };

  const getOverdueBooks = () => {
    return borrowedBooks.filter(book => {
      const dueDate = new Date(book.dueDate);
      const today = new Date();
      return dueDate < today && book.status === 'borrowed';
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] flex items-center justify-center">
        <div className="text-white text-2xl">User not found</div>
      </div>
    );
  }

  const overdueBooks = getOverdueBooks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/admin/users"
            className="inline-flex items-center text-white hover:text-gray-200 mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Users
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">User Details</h1>
          <p className="text-blue-100">Comprehensive view of user information and activity</p>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
        >
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiUser className="w-12 h-12 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
              <div className="space-y-1 text-blue-100">
                <p className="flex items-center">
                  <FiMail className="mr-2" /> {user.email}
                </p>
                <p className="flex items-center">
                  <FiCalendar className="mr-2" /> Member since {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Borrowed</p>
                <p className="text-3xl font-bold text-white">{borrowedBooks.length}</p>
              </div>
              <FiBook className="w-8 h-8 text-white/50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Currently Borrowed</p>
                <p className="text-3xl font-bold text-white">
                  {borrowedBooks.filter(book => book.status === 'borrowed').length}
                </p>
              </div>
              <FiClock className="w-8 h-8 text-white/50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Overdue Books</p>
                <p className="text-3xl font-bold text-white">{overdueBooks.length}</p>
              </div>
              <FiXCircle className="w-8 h-8 text-red-300" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Favorites</p>
                <p className="text-3xl font-bold text-white">{favoriteBooks.length}</p>
              </div>
              <FiHeart className="w-8 h-8 text-white/50" />
            </div>
          </motion.div>
        </div>

        {/* Borrowed Books Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FiBook className="mr-3" />
            Borrowed Books
          </h3>
          {borrowedBooks.length > 0 ? (
            <div className="grid gap-4">
              {borrowedBooks.map(book => {
                console.log(book);

                const bookDetails = getBookDetails(book.book);
                const isOverdue = overdueBooks.includes(book);
                return (
                  <div key={book._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start space-x-4">
                      {book.book?.coverImage ? (
                        <img
                          src={book.book.coverImage}
                          alt={book.book.title}
                          className="w-16 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-white/10 rounded-lg flex items-center justify-center">
                          <FiBook className="w-8 h-8 text-white/50" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">
                          {book.book?.title || 'Unknown Title'}
                        </h4>
                        <p className="text-blue-100 text-sm mb-2">
                          {book.book?.author || 'Unknown Author'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-blue-100">
                            Borrowed: {formatDate(book.borrowDate)}
                          </span>
                          <span className={`${isOverdue ? 'text-red-300' : 'text-green-300'
                            }`}>
                            Due: {formatDate(book.dueDate)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'borrowed'
                            ? isOverdue
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-green-500/20 text-green-300'
                            : 'bg-blue-500/20 text-blue-300'
                            }`}>
                            {book.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-blue-100">No borrowed books</p>
          )}
        </motion.div>

        {/* Favorite Books Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FiHeart className="mr-3" />
            Favorite Books
          </h3>
          {favoriteBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteBooks.map(book => (
                <div key={book._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start space-x-4">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-16 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-white/10 rounded-lg flex items-center justify-center">
                        <FiBook className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white mb-1">{book.title}</h4>
                      <p className="text-blue-100 text-sm">{book.author}</p>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(book.averageRating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-blue-100">No favorite books</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default UserDetails;