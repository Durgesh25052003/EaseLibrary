import React, { useState, useEffect, useMemo } from 'react';
import { getAllBooks, addBooks, updateBook, getBookById } from '../../Servies/servies';
import { toast } from 'react-toastify';
import { FiBook, FiPlus, FiSearch, FiFilter, FiEdit3, FiTrash2, FiEye, FiTrendingUp, FiAlertTriangle, FiPackage, FiEdit } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { BookUpdateForm } from '../../components/BookUpdateForm';

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingForm, setEditingForm] = useState(false);
    const [BookNewData, setBookNewData] = useState({
        title: "",
        author: "",
        description: "",
        genre: "",
        stock: "",
        rentalPrice: "",
        price: ""
    })
    const [CurrentBook, setCurrentBook] = useState({})


    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        description: '',
        genre: '',
        publishedYear: '',
        price: '',
        stock: '',
        rentalPrice: '',
        coverImage: null,
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await getAllBooks();
            setBooks(response.data.data || []);
        } catch (err) {
            console.error('Error fetching books:', err);
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    // Filter books based on search, genre, and stock status
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
            const matchesStock = stockFilter === 'all' ||
                (stockFilter === 'available' && book.stock > 0) ||
                (stockFilter === 'low' && book.stock <= 5 && book.stock > 0) ||
                (stockFilter === 'out' && book.stock === 0);

            return matchesSearch && matchesGenre && matchesStock;
        });
    }, [books, searchTerm, selectedGenre, stockFilter]);

    const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];

    const handleAddBook = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newBook).forEach(key => {
            if (newBook[key] !== null) formData.append(key, newBook[key]);
        });

        try {
            await addBooks(formData);
            toast.success('Book added successfully!');
            setShowAddForm(false);
            setNewBook({
                title: '', author: '', description: '', genre: '',
                publishedYear: '', price: '', stock: '', rentalPrice: '', coverImage: null
            });
            fetchBooks();
        } catch (err) {
            console.error('Error adding book:', err);
            toast.error('Failed to add book');
        }
    };

    const handleEditBook = async (bookId, book) => {
        try {
            console.log(book, BookNewData, "🌟🌟🌟")
            console.log(bookId, "🌟🌟🌟")
            const res = await updateBook(BookNewData, bookId);
            console.log(res)
            if (res.data.success) {
                toast.success('Book updated successfully!');
                fetchBooks();
            }
        } catch (error) {
            toast.error('Failed to update book');
            console.log(error)
        }
    }

    const handleEditForm = async (bookId) => {
        try {
            const res = await getBookById(bookId);
            if (res.data.success) {
                console.log(res.data.data)
                setCurrentBook(res.data.data)
            }
            setEditingForm(true)

        } catch (error) {
            console.log(error)
        }
    }

    const getStockStatus = (stock) => {
        if (stock === 0) return { color: 'text-red-500', bg: 'bg-red-50', label: 'Out of Stock' };
        if (stock <= 5) return { color: 'text-orange-500', bg: 'bg-orange-50', label: 'Low Stock' };
        return { color: 'text-green-500', bg: 'bg-green-50', label: 'Available' };
    };

    const stats = {
        total: books.length,
        available: books.filter(b => b.stock > 0).length,
        lowStock: books.filter(b => b.stock <= 5 && b.stock > 0).length,
        outOfStock: books.filter(b => b.stock === 0).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (editingForm) {
        return (<BookUpdateForm onUpdate={handleEditBook} onCancel={() => setEditingForm(false)} setBookNewData={setBookNewData} BookNewData={BookNewData} updateBook={handleEditBook} book={CurrentBook}
            className="absolute"
        />)
    }


    return (
        <div className=" relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-yellow-50 p-4 ">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#00A8E8] via-[#00A8E8] to-yellow-400 text-white rounded-2xl mx-2 mb-4"
                >
                    <div className="max-w-7xl mx-auto px-8 py-12">
                        <h1 className="text-4xl font-bold mb-2">Manage Books</h1>
                        <p className="text-blue-100 text-lg">Manage your library collection with ease</p>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Books</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <FiBook className="w-8 h-8 text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Available</p>
                                <p className="text-3xl font-bold text-green-600">{stats.available}</p>
                            </div>
                            <FiPackage className="w-8 h-8 text-green-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
                            </div>
                            <FiAlertTriangle className="w-8 h-8 text-orange-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                                <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
                            </div>
                            <FiTrendingUp className="w-8 h-8 text-red-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Genres</option>
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>

                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Stock</option>
                                <option value="available">Available</option>
                                <option value="low">Low Stock</option>
                                <option value="out">Out of Stock</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 flex items-center gap-2"
                        >
                            <FiPlus /> Add New Book
                        </button>
                    </div>
                </div>

                {/* Add Book Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Add New Book</h3>
                            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={newBook.title}
                                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Author"
                                    value={newBook.author}
                                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Genre"
                                    value={newBook.genre}
                                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Published Year"
                                    value={newBook.publishedYear}
                                    onChange={(e) => setNewBook({ ...newBook, publishedYear: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={newBook.price}
                                    onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={newBook.stock}
                                    onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Rental Price"
                                    value={newBook.rentalPrice}
                                    onChange={(e) => setNewBook({ ...newBook, rentalPrice: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={newBook.description}
                                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                                    rows="3"
                                    required
                                />
                                <div className="md:col-span-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.files[0] })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="md:col-span-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-200"
                                >
                                    Add Book
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredBooks.map((book, index) => {
                            const stockStatus = getStockStatus(book.stock);
                            return (
                                <motion.div
                                    key={book._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className=" relative bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >

                                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
                                                <FiBook className="w-16 h-16 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <FiEdit className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" onClick={
                                                () => handleEditForm(book._id)

                                            } />
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                                        <p className="text-xs text-gray-500 mb-3">{book.genre}</p>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-sm font-medium ${stockStatus.color}`}>
                                                {stockStatus.label}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {book.stock} left
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                            <span>Rental: ${book.rentalPrice}</span>
                                            <span>Price: ${book.price}</span>
                                        </div>

                                        {/* <div className="flex gap-2">
                                            <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                                                <FiEye className="inline mr-1" /> View
                                            </button>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                                <FiEdit3 />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                                <FiTrash2 />
                                            </button>
                                        </div> */}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-12">
                        <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No books found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageBooks;