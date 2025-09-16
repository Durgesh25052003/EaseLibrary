import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getHistory } from '../../Servies/servies';
import { FiCalendar, FiBook, FiClock, FiCheckCircle, FiAlertTriangle, FiSearch, FiFilter, FiUser, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";
import Emptybox from "../../../public/Emptybox.json";
import LoadingBar from '../../components/LoadingBar';

function UserHistory() {
    // FIX: Replace useRef with useState for proper re-rendering
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        if (userData && userData._id) {
            setUserId(userData._id);
            fetchUserHistory();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserHistory = async () => {
        try {
            setLoading(true);
            const response = await getHistory();
            // FIX: Use setState instead of mutating ref
            setHistory(response?.data?.data || []);
            console.log(response?.data?.data);
        } catch (err) {
            console.error('Error fetching user history:', err);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // FIX: Update useMemo dependency to use the state variable directly
    const filteredHistory = useMemo(() => {
        if (!Array.isArray(history) || history.length === 0) return [];
        
        return history.filter(item => {
            if (!item) return false;

            // FIX: Add status filtering based on filterStatus
            const matchesSearch = 
                (item.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (item.book?.author?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (item.book?.genre?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

            const matchesStatus = filterStatus === 'all' || 
                (filterStatus === 'returned' && item.returned) ||
                (filterStatus === 'active' && !item.returned) ||
                (filterStatus === 'overdue' && !item.returned && new Date(item.returnDate) < new Date());

            return matchesSearch && matchesStatus;
        });
    }, [history, searchTerm, filterStatus]);

    console.log('Filtered history:', filteredHistory);

    // FIX: Update stats calculation to use state variable
    const stats = {
        total: Array.isArray(history) ? history.length : 0,
        returned: Array.isArray(history) ? history.filter(item => item?.returned).length : 0,
        active: Array.isArray(history) ? history.filter(item => !item?.returned).length : 0,
        overdue: Array.isArray(history) ? history.filter(item => 
            !item?.returned && new Date(item.returnDate) < new Date()
        ).length : 0
    };

    const getStatusInfo = (item) => {
        if (!item) return { color: 'text-gray-600', bg: 'bg-gray-50/20', label: 'Unknown', icon: FiClock };

        if (item.returned) {
            return { color: 'text-green-200', bg: 'bg-green-500/20', label: 'Returned', icon: FiCheckCircle };
        } else if (new Date(item.returnDate) < new Date()) {
            return { color: 'text-red-200', bg: 'bg-red-500/20', label: 'Overdue', icon: FiAlertTriangle };
        } else {
            return { color: 'text-blue-200', bg: 'bg-blue-500/20', label: 'Borrowed', icon: FiClock };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getReadingDuration = (borrowedDate, returnDate, actualReturnDate) => {
        const start = new Date(borrowedDate);
        const end = actualReturnDate ? new Date(actualReturnDate) : new Date(returnDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Less than a day';
        if (diffDays === 1) return '1 day';
        return `${diffDays} days`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-6">
                <div className="max-w-7xl mx-auto">
                    <LoadingBar type="spinner" text="Loading your reading history..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 text-white border border-white/20"
                >
                    <h1 className="text-4xl font-bold mb-2">My Reading History</h1>
                    <p className="text-white/80 text-lg">Track your borrowing journey and reading adventures</p>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/80">Total Books</p>
                                <p className="text-3xl font-bold text-white">{stats.total}</p>
                            </div>
                            <FiBook className="w-8 h-8 text-white/80" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/80">Returned</p>
                                <p className="text-3xl font-bold text-green-200">{stats.returned}</p>
                            </div>
                            <FiCheckCircle className="w-8 h-8 text-green-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/80">Currently Borrowed</p>
                                <p className="text-3xl font-bold text-blue-200">{stats.active}</p>
                            </div>
                            <FiClock className="w-8 h-8 text-blue-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/80">Overdue</p>
                                <p className="text-3xl font-bold text-red-200">{stats.overdue}</p>
                            </div>
                            <FiAlertTriangle className="w-8 h-8 text-red-200" />
                        </div>
                    </motion.div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by book title, author, or genre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        >
                            <option value="all" className="text-gray-900">All Books</option>
                            <option value="returned" className="text-gray-900">Returned</option>
                            <option value="active" className="text-gray-900">Currently Borrowed</option>
                            <option value="overdue" className="text-gray-900">Overdue</option>
                        </select>
                    </div>
                </div>

                {/* History Cards */}
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-12">
                        <Lottie animationData={Emptybox} loop autoplay className="mx-auto w-32 h-32 mb-4" />
                        <p className="text-white/80 text-lg">No reading history found</p>
                        <p className="text-white/60 text-sm mt-2">Start borrowing books to build your reading journey!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredHistory.map((item, index) => {
                                const status = getStatusInfo(item);
                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300"
                                    >
                                        <div className="relative">
                                            {item.book?.coverImage ? (
                                                <img
                                                    src={item.book.coverImage}
                                                    alt={item.book.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                                                    <FiBook className="w-16 h-16 text-white/60" />
                                                </div>
                                            )}
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                                {status.label}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">
                                                {item.book?.title || 'Unknown Title'}
                                            </h3>
                                            <p className="text-sm text-white/80 mb-1">by {item.book?.author || 'Unknown Author'}</p>
                                            <p className="text-xs text-white/60 mb-4">{item.book?.genre || 'Unknown Genre'}</p>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-white/70">Borrowed Date:</span>
                                                    <span className="font-medium text-white">{formatDate(item.accessedAt)}</span>
                                                </div>

                                                {item.returned ? (
                                                    <>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-white/70">Returned Date:</span>
                                                            <span className="font-medium text-green-200">{formatDate(item.actualReturnDate)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-white/70">Reading Duration:</span>
                                                            <span className="font-medium text-purple-200">
                                                                {getReadingDuration(item.accessedAt, item.returnDate, item.actualReturnDate)}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-white/70">Expected Return:</span>
                                                            <span className="font-medium text-orange-200">{formatDate(item.returnDate)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-white/70">Days Borrowed:</span>
                                                            <span className="font-medium text-blue-200">
                                                                {getReadingDuration(item.accessedAt, item.returnDate)}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-white/20">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-white/70">Rental Price:</span>
                                                    <span className="font-bold text-yellow-200">${item.book.rentalPrice || 0}</span>
                                                </div>
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

export default UserHistory;