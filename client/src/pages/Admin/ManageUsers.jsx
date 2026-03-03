import React, { useEffect, useState } from 'react';
import { getAllUsers, getAllBorrowedBooks } from '../../Servies/servies';
import {
    FiUsers,
    FiMail,
    FiBook,
    FiCalendar,
    FiSearch,
    FiFilter,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiUser
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, borrowedBooksRes] = await Promise.all([
                    getAllUsers(),
                    getAllBorrowedBooks()
                ]);

                const filteredUsers = usersRes.data.data.filter(user => !user.isAdmin);
                setUsers(filteredUsers);
                setBorrowedBooks(borrowedBooksRes.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getUserBorrowedBooks = (userId) => {
        return borrowedBooks.filter(book => book.userId === userId);
    };

    const getOverdueBooks = (userBooks) => {
        return userBooks.filter(book => {
            const dueDate = new Date(book.dueDate);
            const today = new Date();
            return dueDate < today && book.status === 'borrowed';
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const userBooks = getUserBorrowedBooks(user._id);
        const hasActiveBooks = userBooks.length > 0;
        const hasOverdueBooks = getOverdueBooks(userBooks).length > 0;

        if (filterStatus === 'active') return hasActiveBooks;
        if (filterStatus === 'overdue') return hasOverdueBooks;
        if (filterStatus === 'inactive') return !hasActiveBooks;
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-yellow-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8"></div>
                        <div className="grid gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
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
                    <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
                    <p className="text-blue-100 text-lg">Manage library members and their borrowed books</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent appearance-none bg-white"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Users</option>
                                <option value="active">Active Borrowers</option>
                                <option value="overdue">Overdue Books</option>
                                <option value="inactive">No Active Books</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map(user => {
                        const userBooks = getUserBorrowedBooks(user._id);
                        const overdueBooks = getOverdueBooks(userBooks);
                        const hasOverdue = overdueBooks.length > 0;

                        return (
                            <div key={user._id} className="group">
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-[#00A8E8] to-[#007EA7] p-6 text-white">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                                {user.profilePic ? (
                                                    <img
                                                        src={user.profilePic}
                                                        alt={user.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <FiUser className="w-8 h-8 text-white" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold">{user.name}</h3>
                                                <p className="text-blue-100 text-sm">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="bg-white/20 rounded-full px-3 py-1">
                                                    <span className="text-sm font-bold">{user.borrowedBooks.length}</span>
                                                </div>
                                                <p className="text-xs text-blue-100">Books</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Status */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-gray-600">Status</span>
                                            <div className="flex items-center space-x-2">
                                                {hasOverdue ? (
                                                    <>
                                                        <FiXCircle className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm text-red-600 font-medium">{overdueBooks.length} Overdue</span>
                                                    </>
                                                ) : userBooks.length > 0 ? (
                                                    <>
                                                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm text-green-600 font-medium">Active</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiClock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-500">Inactive</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Borrowed Books */}
                                        {userBooks.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <FiBook className="w-4 h-4 mr-2" />
                                                    Borrowed Books
                                                </h4>
                                                <div className="space-y-2">
                                                    {userBooks.slice(0, 3).map(book => (
                                                        <div key={book._id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                                            {book.coverImage ? (
                                                                <img
                                                                    src={book.coverImage}
                                                                    alt={book.title}
                                                                    className="w-10 h-14 rounded object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-14 bg-gradient-to-br from-[#00A8E8] to-[#007EA7] rounded flex items-center justify-center">
                                                                    <FiBook className="w-5 h-5 text-white" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                                                                <p className="text-xs text-gray-500">Due: {new Date(book.dueDate).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {userBooks.length > 3 && (
                                                        <p className="text-xs text-gray-500 text-center">
                                                            +{userBooks.length - 3} more books
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <button className="w-full bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white py-2 px-4 rounded-lg hover:shadow-lg transition-shadow duration-200"
                                                onClick={
                                                    () => {
                                                        navigate(`/admin/user/${user._id}`);
                                                    }
                                                }
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-500">No users found</h3>
                        <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;