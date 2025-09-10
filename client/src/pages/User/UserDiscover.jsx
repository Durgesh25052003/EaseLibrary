import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBook, FaCalendarAlt, FaUser, FaHeart } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { getAllBooks, getUserById } from '../../Servies/servies';
import Pagination from '../../components/Pagination';

const UserDiscover = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const navigate = useNavigate();
  const userBorrowRef = useRef([]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const isBorrowed = async () => {
    try {
      const userSession = JSON.parse(sessionStorage.getItem("user"));
      const userId = userSession._id;
      const getUser = await getUserById(userId);
      userBorrowRef.current = getUser.data.user.borrowedBooks || [];
    } catch (error) {
      console.error('Error checking borrowed books:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBooks();

      if (response?.data?.data) {
        setBooks(response.data.data);
        setFilteredBooks(response.data.data);
      } else {
        setBooks([]);
        setFilteredBooks([]);
      }
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setFilteredBooks(books);
      } else {
        const filtered = books.filter(book =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.genre.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredBooks(filtered);
        setCurrentPage(1);
      }
    }, 300),
    [books]
  );

  useEffect(() => {
    fetchBooks();
    isBorrowed();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20"
        >
          <FaBook className="w-16 h-16 text-white mx-auto mb-4" />
          <p className="text-white text-lg mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBooks}
            className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="mb-4"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBook className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Discover Books</h1>
          <p className="text-blue-100">Explore our collection of amazing books</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-6"
        >
          <p className="text-blue-100">
            Showing <span className="text-white font-bold">{currentBooks.length}</span> of{' '}
            <span className="text-white font-bold">{filteredBooks.length}</span> books
          </p>
        </motion.div>

        {/* Books Grid */}
        {currentBooks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            {currentBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/user/bookdesc/${book._id}`)}
              >
                <div className="relative mb-4">
                  <img
                    src={book.coverImage || '/placeholder-book.jpg'}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${!userBorrowRef.current.includes(book._id)
                      ? 'bg-green-500/80 text-white'
                      : 'bg-red-500/80 text-white'
                      }`}>
                      {!userBorrowRef.current.includes(book._id) ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-[#FFD23F] transition-colors">
                  {book.title}
                </h3>
                <p className="text-blue-200 text-sm mb-2 flex items-center gap-1">
                  <FaUser className="w-3 h-3" />
                  {book.author}
                </p>
                <p className="text-blue-200 text-sm mb-3">{book.genre}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#FFD23F]">
                    ${book.rentalPrice}/day
                  </span>
                  <span className="text-xs text-blue-200 bg-white/20 px-2 py-1 rounded-full">
                    {book.totalCopies} copies
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-16"
          >
            <FaBook className="w-24 h-24 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No books found</h3>
            <p className="text-blue-200">
              {searchQuery ? 'Try adjusting your search terms' : 'No books available at the moment'}
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={booksPerPage}
              totalItems={filteredBooks.length}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDiscover;