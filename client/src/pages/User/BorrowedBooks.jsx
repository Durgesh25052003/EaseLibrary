import React, { useState, useEffect } from 'react';
import { getBorrowedBooksByUser, returnBook, addFavoriteBook, removeFavoriteBook, getFavoriteBooks, getAllBorrowedBooks, getBookById, addReview } from '../../Servies/servies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCalendar, faBook, faUser, faUndo, faStar, faComment } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase';
import { useRef } from 'react';

function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({})
  const bookRef = useRef([]);
  const [dailogue, setDailogue] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState({});
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData && userData._id) {
      setUserId(userData._id);
      fetchData(userData._id);
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user)
    setUser(user);
  }, [])

  const fetchData = async (currentUserId) => {
    try {
      setLoading(true);
      const [borrowedRes, favoritesRes] = await Promise.all([
        getBorrowedBooksByUser(currentUserId),
        getFavoriteBooks()
      ]);

      console.log(borrowedRes)
      console.log(favoritesRes)


      if (borrowedRes?.data?.success) {
        setBorrowedBooks(borrowedRes.data.data);
      }

      if (favoritesRes?.data?.success) {
        setFavorites(favoritesRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {

      const resBook = await getAllBorrowedBooks(userId);
      console.log(resBook);
      bookRef.current = resBook.data.data;
      console.log(bookRef.current);

      const book = bookRef.current.find(book => book.book._id === bookId);
      console.log(book);

      const res = await returnBook(userId, bookId);

      if (res?.data?.success) {
        toast.success('Book returned successfully');
        setBorrowedBooks(prev => prev.filter(book => book._id !== bookId));
      }
      await addDoc(collection(db, 'notifications'), {
        id: user._id,
        message: `${user.name} return ${book.bookTitle}`,
        title: 'Book Return',
        type: 'Return',
        date: new Date().toISOString().split("T")[0]

      })
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error('Failed to return book');
    }
  };

  const toggleFavorite = async (bookId) => {
    try {
      const isFavorite = favorites.some(fav => fav._id === bookId);
      let res;

      if (isFavorite) {
        res = await removeFavoriteBook(bookId);
      } else {
        res = await addFavoriteBook(bookId);
      }

      if (res?.data?.success) {
        const newFavorites = res.data.data;
        setFavorites(newFavorites);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };
  const handleDailogue = async (bookId) => {
    setSelectedBookId(bookId);
    setDailogue(!dailogue);
    const selectedBook = await getBookById(bookId);
    console.log(selectedBook);
    setSelectedBook(selectedBook.data.data);
  };

  const isFavorite = (bookId) => favorites.some(fav => fav._id === bookId);


  const handleSubmitReview = async (e, bookId) => {
    e.preventDefault();
    try {

      console.log(bookId)

      const res = await addReview({
        book: bookId,
        user: user._id,
        userName: user.name,
        bookTitle: selectedBook.title,
        bookAuthor: selectedBook.author,
        rating: rating,
        comment: review,
        date: new Date().toISOString()
      })
      console.log(res);
      // await addDoc(collection(db, 'reviews'), {
      //   userId: user._id,
      //   userName: user.name,
      //   bookId: bookId,
      //   rating: rating,
      //   review: review,
      //   date: new Date().toISOString()
      // });

      toast.success('Review submitted successfully');
      setDailogue(false);
      setReview('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (dailogue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Keep your existing content visible */}
          <h1 className="text-4xl font-bold text-white mb-8 text-center">My Library</h1>

          {/* Floating dialog box */}
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-96 z-50'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Write a Review</h2>
            <form onSubmit={(e) => handleSubmitReview(e, selectedBookId)}>
              <div className='mb-4'>
                <label className='block text-gray-700 font-bold mb-2'>Rating</label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type='button'
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  ))}
                </div>
              </div>
              <div className='mb-4'>
                <label htmlFor='review' className='block text-gray-700 font-bold mb-2'>Your Review</label>
                <textarea
                  id='review'
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  rows={4}
                  placeholder='Share your thoughts about this book...'
                  required
                ></textarea>
              </div>
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                >
                  Submit Review
                </button>
                <button
                  type='button'
                  onClick={() => setDailogue(false)}
                  className='flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F]">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">My Library</h1>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon={faStar} className="mr-2" />
              Favorites
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favorites.map(book => (
                <div key={book._id} className="bg-white rounded-lg p-3 shadow-lg transform transition-transform hover:scale-105">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{book.title}</h3>
                  <p className="text-xs text-gray-600 truncate">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Borrowed Books Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            Borrowed Books
          </h2>

          {borrowedBooks.length === 0 ? (
            <div className="text-center text-white">
              <FontAwesomeIcon icon={faBook} className="text-6xl mb-4 opacity-50" />
              <p className="text-xl">No books borrowed yet</p>
              <p className="text-sm opacity-75">Start exploring and borrow your first book!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {borrowedBooks.map(book => (
                <div key={book._id} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(book._id)}
                      className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${isFavorite(book._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-red-100'
                        }`}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`transition-transform duration-300 ${isFavorite(book._id) ? 'scale-110' : ''
                          }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDailogue(book._id)}
                      className='absolute top-13 right-2 p-2 rounded-full transition-all duration-300 bg-white text-gray-600 hover:bg-red-100'
                    >
                      <FontAwesomeIcon
                        icon={faComment}
                        className={`transition-transform duration-300 ${isFavorite(book._id) ? 'scale-110' : ''
                          }`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-1 text-[#007EA7]" />
                      {book.author}
                    </p>
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <FontAwesomeIcon icon={faCalendar} className="mr-1 text-[#007EA7]" />
                      Borrowed: {new Date().toLocaleDateString()}
                    </p>

                    <button
                      onClick={() => handleReturnBook(book._id)}
                      className="w-full bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white py-2 px-4 rounded-md hover:from-[#007EA7] hover:to-[#00A8E8] transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faUndo} className="mr-2" />
                      Return Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BorrowedBooks;