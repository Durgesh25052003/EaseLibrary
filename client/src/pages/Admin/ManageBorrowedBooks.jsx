import React, { useState, useEffect, useMemo } from 'react';
import { getAllBorrowedBooks, returnBook } from '../../Servies/servies';
import { toast } from 'react-toastify';
import { FiCalendar, FiUser, FiBook, FiClock, FiAlertTriangle, FiCheckCircle, FiMail, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";
import Emptybox from "../../../public/Emptybox.json";

function ManageBorrowedBooks() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await getAllBorrowedBooks();
            // Fixed: Ensure we always have an array, even when API returns null/undefined
            const booksData = response?.data?.data || [];
            setBorrowedBooks(Array.isArray(booksData) ? booksData : []);
        } catch (err) {
            console.error('Error fetching borrowed books:', err);
            toast.error('Failed to fetch borrowed books');
            setBorrowedBooks([]); // Ensure empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Fixed: Safe filtering with null checks
    const filteredBooks = useMemo(() => {
        if (!Array.isArray(borrowedBooks) || borrowedBooks.length === 0) {
            return [];
        }

        return borrowedBooks.filter(borrow => {
            if (!borrow) return false;

            const matchesSearch =
                (borrow.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (borrow.book?.author?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (borrow.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

            const today = new Date();
            const dueDate = new Date(borrow.returnDate);
            const isOverdue = dueDate < today && !borrow.returned;
            const isDueToday = dueDate.toDateString() === today.toDateString();

            let matchesStatus = true;
            switch (statusFilter) {
                case 'overdue':
                    matchesStatus = isOverdue;
                    break;
                case 'active':
                    matchesStatus = !borrow.returned;
                    break;
                case 'returned':
                    matchesStatus = borrow.returned;
                    break;
                case 'dueToday':
                    matchesStatus = isDueToday && !borrow.returned;
                    break;
                default:
                    matchesStatus = true;
            }

            return matchesSearch && matchesStatus;
        });
    }, [borrowedBooks, searchTerm, statusFilter]);

    const handleReturnBook = async (userId, bookId) => {
        try {
            await returnBook(userId, bookId);
            toast.success('Book marked as returned successfully!');
            fetchBorrowedBooks();
        } catch (error) {
            console.error('Error returning book:', error);
            toast.error('Failed to return book');
        }
    };

    const getStatusInfo = (borrow) => {
        if (!borrow) return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Unknown', icon: FiClock };

        const today = new Date();
        const dueDate = new Date(borrow.returnDate);
        const isOverdue = dueDate < today && !borrow.returned;
        const isDueToday = dueDate.toDateString() === today.toDateString();

        if (borrow.returned) {
            return { color: 'text-green-600', bg: 'bg-green-50', label: 'Returned', icon: FiCheckCircle };
        } else if (isOverdue) {
            return { color: 'text-red-600', bg: 'bg-red-50', label: 'Overdue', icon: FiAlertTriangle };
        } else if (isDueToday) {
            return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Due Today', icon: FiClock };
        } else {
            return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Active', icon: FiClock };
        }
    };

    const getDaysRemaining = (dueDate) => {
        if (!dueDate) return 'No due date';

        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return 'Due today';
        return `${diffDays} days remaining`;
    };

    // Fixed: Safe statistics calculation with null checks
    const stats = {
        total: Array.isArray(borrowedBooks) ? borrowedBooks.length : 0,
        active: Array.isArray(borrowedBooks) ? borrowedBooks.filter(b => b && !b.returned).length : 0,
        overdue: Array.isArray(borrowedBooks) ? borrowedBooks.filter(b => {
            if (!b || b.returned) return false;
            const dueDate = new Date(b.returnDate);
            return dueDate < new Date();
        }).length : 0,
        dueToday: Array.isArray(borrowedBooks) ? borrowedBooks.filter(b => {
            if (!b || b.returned) return false;
            const dueDate = new Date(b.returnDate);
            return dueDate.toDateString() === new Date().toDateString();
        }).length : 0
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-yellow-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 via-cyan-500 to-yellow-400 rounded-2xl p-8 mb-8 text-white"
                >
                    <h1 className="text-4xl font-bold mb-2">Manage Borrowed Books</h1>
                    <p className="text-blue-100 text-lg">Track and manage all borrowed books in your library</p>
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
                                <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
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
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
                            </div>
                            <FiClock className="w-8 h-8 text-blue-500" />
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
                                <p className="text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                            </div>
                            <FiAlertTriangle className="w-8 h-8 text-red-500" />
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
                                <p className="text-sm font-medium text-gray-600">Due Today</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.dueToday}</p>
                            </div>
                            <FiCalendar className="w-8 h-8 text-orange-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by book title, author, or borrower..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="overdue">Overdue</option>
                            <option value="dueToday">Due Today</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <Lottie animationData={Emptybox} loop autoplay className="mx-auto w-32 h-32 mb-4" />
                        <p className="text-gray-500 text-lg">No borrowed books found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredBooks.map((borrow, index) => {
                                const status = getStatusInfo(borrow);
                                return (
                                    <motion.div
                                        key={borrow._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative">
                                            {borrow.book?.coverImage ? (
                                                <img
                                                    src={borrow.book.coverImage}
                                                    alt={borrow.book.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
                                                    <FiBook className="w-16 h-16 text-gray-400" />
                                                </div>
                                            )}
                                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} flex items-center gap-1`}>
                                                <status.icon className="w-3 h-3" />
                                                {status.label}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                                                {borrow.book?.title || 'Unknown Book'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                by {borrow.book?.author || 'Unknown Author'}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiUser className="w-4 h-4" />
                                                    <span>{borrow.userName || 'Unknown User'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiCalendar className="w-4 h-4" />
                                                    <span>Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FiClock className="w-4 h-4" />
                                                    <span className={status.color}>
                                                        Due: {new Date(borrow.returnDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    {getDaysRemaining(borrow.returnDate)}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {!borrow.returned && (
                                                    <button
                                                        onClick={() => handleReturnBook(borrow.user?._id, borrow.book?._id)}
                                                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm flex items-center justify-center gap-1"
                                                    >
                                                        <FiCheckCircle className="w-4 h-4" />
                                                        Mark Returned
                                                    </button>
                                                )}
                                                {!borrow.returned && (
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                                        <FiMail className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {!borrow.returned && (
                                                    <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200">
                                                        <FiRefreshCw className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageBorrowedBooks;
