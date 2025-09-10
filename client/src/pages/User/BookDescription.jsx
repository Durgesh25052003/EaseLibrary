import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { borrowBook, getBookById, getReviews } from '../../Servies/servies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar, faCalendar, faUser, faBook, faTag, faInfoCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faClock, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { db } from '../../../Firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';


const BookDescription = () => {
  const { bookId } = useParams();
  console.log(bookId)

  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalDays, setRentalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [Reviews,setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const ratingAverage= useRef(0)
  let [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await getBookById(bookId);
        console.log(response)
        if (response?.data?.data) {
          setBook(response.data.data);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Failed to load book details');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  useEffect(() => {
    if (book) {
      setTotalPrice(book.rentalPrice * rentalDays);
    }
  }, [book, rentalDays]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user)
    setUser(user);
  }, [])

  const getBookReviews = async () => {
    try {
      const res = await getReviews(bookId);
      console.log("Review response:", res);
      setReviews(res.data);
      console.log(res.data)
      if(res.data.length>0){
        ratingAverage.current=res.data.reduce((acc,cur)=>{
        return cur.rating+acc
       },0)
       ratingAverage.current=ratingAverage.current/res.data.length
       console.log(ratingAverage.current)
      }
      setTimeout(() => console.log("Reviews state:", Reviews), 0);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (bookId) {
      getBookReviews();
    }
  }, [bookId])



  const handleBorrow = async (book, days) => {
    try {
      console.log(`Borrowing ${book.title} for ${days} days`);
      console.log(`Total price: $${book.rentalPrice * days}`);
      // Add your borrow API call here
      const res = await borrowBook(bookId, days);
      //Adding the Notifications in the Firebase
      console.log(user)
      if (res?.data?.success) {
        toast.success('Book borrowed successfully');
      } else {
        toast.error('Book is already Borrowed');
      }
      await addDoc(collection(db, 'notifications'), {
        id: user._id,
        message: `${user.name} request to borrow ${book.title} for ${days} days`,
        title: 'Book Request',
        type: 'borrow',
        date: new Date().toISOString().split("T")[0]

      })

      console.log(res)

      // const res = await borrowBook(bookId, days);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-xl">
          <FontAwesomeIcon icon={faInfoCircle} className="text-4xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={() => navigate('/user/discover')}
            className="bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white px-6 py-2 rounded-lg hover:from-[#007EA7] hover:to-[#00A8E8] transition-all duration-300"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F]">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/user/discover')}
          className="mb-6 flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="font-medium">Back to Discover</span>
        </button>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Book Image Section */}
            <div className="md:w-1/3 p-8">
              <div className="relative">
                <img
                  src={book.coverImage || '/placeholder-book.jpg'}
                  alt={book.title}
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${book.stock > 0
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {book.stock > 0 ? 'Available' : 'Borrowed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Details Section */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <FontAwesomeIcon icon={faUser} className="text-[#00A8E8]" />
                  <span className="text-lg">by <span className="font-semibold">{book.author}</span></span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <FontAwesomeIcon icon={faStar} className="text-[#FFD23F]" />
                  <span className="text-lg font-semibold">{book.rating || 4.5}/5</span>
                  <span className="text-gray-400">•</span>
                  <FontAwesomeIcon icon={faBook} className="text-[#007EA7]" />
                  <span>{book.totalCopies} copies available</span>
                </div>
              </div>

              {/* Genre & Category */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faTag} className="text-[#00A8E8]" />
                  <span className="text-lg font-semibold text-gray-700">Genre</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {book.genre?.split(',').map((g, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white rounded-full text-sm"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-[#007EA7]" />
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-[#00A8E8]/10 to-[#007EA7]/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-[#00A8E8]" />
                    <span className="font-semibold text-gray-700">Published</span>
                  </div>
                  <p className="text-gray-600">{book.publishedDate || 'Not specified'}</p>
                </div>
                <div className="bg-gradient-to-r from-[#007EA7]/10 to-[#FFD23F]/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faBook} className="text-[#FFD23F]" />
                    <span className="font-semibold text-gray-700">Pages</span>
                  </div>
                  <p className="text-gray-600">{book.pages || 'Not specified'} pages</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Days Selection */}
                  <div>
                    <label className="text-white/80 text-sm flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faCalendarDays} />
                      Rental Duration
                    </label>
                    <select
                      value={rentalDays}
                      onChange={(e) => setRentalDays(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map(days => (
                        <option key={days} value={days} className="text-gray-800">
                          {days} {days === 1 ? 'day' : 'days'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Display */}
                  <div className="text-right">
                    <div className="text-white/80 text-sm flex items-center justify-end gap-2">
                      <FontAwesomeIcon icon={faClock} />
                      Total Cost
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-xl text-white/80 line-through">
                        ${book.rentalPrice * rentalDays}
                      </span>
                      <span className="text-3xl font-bold text-white">
                        ${totalPrice}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">
                      {rentalDays} {rentalDays === 1 ? 'day' : 'days'} × ${book.rentalPrice}/day
                    </p>
                  </div>
                </div>

                {/* Borrow Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    disabled={!book.stock > 0}
                    onClick={() => handleBorrow(book, rentalDays)}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${book.stock > 0
                      ? 'bg-white text-[#00A8E8] hover:bg-gray-100 shadow-lg'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    {book.stock > 0 ? (
                      <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Borrow for {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                      </span>
                    ) : (
                      'Currently Unavailable'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">ISBN</h3>
            <p className="text-gray-600">{book.isbn || 'Not provided'}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Language</h3>
            <p className="text-gray-600">{book.language || 'English'}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Publisher</h3>
            <p className="text-gray-600">{book.publisher || 'Not specified'}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FontAwesomeIcon icon={faStar} className="text-[#FFD23F]" />
              Reviews
            </h2>
          </div>

          {/* Review Stats */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-800 mb-2">{ratingAverage.current }</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={star <= Math.floor(ratingAverage.current) ? 'text-[#FFD23F]' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{Reviews.length} reviews</p>
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                // Calculate how many reviews have this rating
                const ratingCount = Reviews.filter(review => review.rating === rating).length;
                // Calculate percentage (avoid division by zero)
                const percentage = Reviews.length > 0 ? Math.round((ratingCount / Reviews.length) * 100) : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-24">
                      {rating} <FontAwesomeIcon icon={faStar} className="text-[#FFD23F]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFD23F] rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-gray-600">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="p-6 border-t border-gray-200 space-y-6">
            {Reviews && Reviews.length > 0 ? (
              (showAllReviews ? Reviews : Reviews.slice(0, 3)).map((review) => (
                <div key={review._id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{review.userName}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesomeIcon
                              key={star}
                              icon={faStar}
                              className={star <= review.rating ? 'text-[#FFD23F]' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">• {new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this book!</p>
            )}
          </div>

          {/* View All Reviews Button */}
          <div className="p-6 bg-gray-50">
            {Reviews && Reviews.length > 3 && (
              <button 
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white py-3 px-6 rounded-lg hover:from-[#007EA7] hover:to-[#00A8E8] transition-all duration-300 font-semibold"
              >
                {showAllReviews ? 'Show Less Reviews' : 'View All Reviews'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDescription;

