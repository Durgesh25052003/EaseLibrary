import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooks, getUserById } from '../../Servies/servies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const Category = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const userBorrowRef = useRef([]);
    const navigate = useNavigate();

    // Fetch books and extract categories
    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllBooks();

            if (response?.data?.data) {
                const allBooks = response.data.data;
                setBooks(allBooks);
                setFilteredBooks(allBooks);

                // Extract unique categories from genres
                const uniqueCategories = [...new Set(allBooks.flatMap(book => book.genre ? book.genre.split(',').map(g => g.trim()) : []).filter(Boolean))].sort()
                setCategories(['All', ...uniqueCategories]);
            } else {
                setBooks([]);
                setFilteredBooks([]);
                setCategories(['All']);
            }
        } catch (err) {
            setError('Failed to load books. Please try again.');
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    const isBorrowed = async () => {
        const userSession = JSON.parse(sessionStorage.getItem("user"));
        const userId = userSession._id;
        console.log(userId)
        const getUser = await getUserById(userId);
        console.log(getUser)
        userBorrowRef.current = getUser.data.user.borrowedBooks
        console.log(userBorrowRef.current)
    }

    useEffect(() => {
        fetchBooks();
        isBorrowed()
    }, []);



    // Filter books based on category and search
    useEffect(() => {
        let filtered = books;
        console.log(books)
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(book =>
                book.genre && book.genre.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBooks(filtered);
    }, [books, selectedCategory, searchQuery]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearFilters = () => {
        setSelectedCategory('All');
        setSearchQuery('');
    };




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
                    <FontAwesomeIcon icon={faBook} className="text-4xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
                    <button
                        onClick={fetchBooks}
                        className="bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white px-6 py-2 rounded-lg hover:from-[#007EA7] hover:to-[#00A8E8] transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F]">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Book Categories</h1>
                    <p className="text-white/80 text-lg">Explore our collection by category</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
                            />
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="bg-gradient-to-r from-[#FFD23F] to-[#007EA7] text-white px-4 py-2 rounded-lg hover:from-[#007EA7] hover:to-[#FFD23F] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                            Clear Filters
                        </button>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategorySelect(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white shadow-lg transform scale-105'
                                    : 'bg-white/50 text-gray-700 hover:bg-white/80 hover:shadow-md'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-white mb-4">
                    <p className="text-lg">
                        Showing <span className="font-bold">{filteredBooks.length}</span> books
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                    </p>
                </div>

                {/* Books Grid */}
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) =>
                        (
                            <div
                                key={book._id}
                                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                                onClick={() => navigate(`/user/bookdesc/${book._id}`)}
                            >
                                {/* Book Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={book.coverImage || '/placeholder-book.jpg'}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${!userBorrowRef.current.includes(book._id)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                            }`}>
                                            {!userBorrowRef.current.includes(book._id) ? 'Available' : 'Borrowed'}

                                        </span>
                                    </div>
                                </div>

                                {/* Book Details */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
                                        {book.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        by {book.author}
                                    </p>

                                    {/* Genre Tags */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {book.genre?.split(',').slice(0, 2).map((genre, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gradient-to-r from-[#00A8E8]/20 to-[#007EA7]/20 text-[#007EA7] text-xs rounded-full"
                                            >
                                                {genre.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price and Copies */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-green-600">
                                            ${book.rentalPrice}/day
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {book.totalCopies} copies
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#00A8E8]/80 via-[#007EA7]/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                                    <div className="p-4 w-full">
                                        <button className="w-full bg-white text-[#007EA7] font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <FontAwesomeIcon icon={faBook} className="text-6xl text-white/50 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No books found</h3>
                        <p className="text-white/70">
                            {searchQuery
                                ? 'Try adjusting your search or filters'
                                : 'No books available in this category'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;