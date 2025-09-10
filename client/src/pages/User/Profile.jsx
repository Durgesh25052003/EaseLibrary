import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaBook, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../../Servies/servies';
import toast from 'react-hot-toast';

function Profile() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        profilePic: '',
        createdAt: null,
        borrowedBooks: [],
        favoriteBooks: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userRef = React.useRef(null);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user") || '{}');
        userRef.current = user;
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(sessionStorage.getItem("user") || '{}');
            const response = await getUserById(user._id);
            const userInfo = response.data.user || {};
            setUserData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                profilePic: userInfo.profilePic || '',
                createdAt: userInfo.createdAt || null,
                borrowedBooks: userInfo.borrowedBooks || [],
                favoriteBooks: userInfo.favorites || []
            });
        } catch (error) {
            toast.error('Failed to load profile data');
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#00A8E8] via-[#007EA7] to-[#FFD23F] p-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
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
                            <FaUser className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-blue-100">View your personal information</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative group mb-6"
                            >
                                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30 mx-auto">
                                    {userData.profilePic ? (
                                        <img
                                            src={userData.profilePic}
                                            alt={userData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="w-16 h-16 text-white/60" />
                                    )}
                                </div>
                            </motion.div>

                            <h2 className="text-2xl font-bold text-white mb-2">{userData.name}</h2>
                            <p className="text-blue-200 mb-4">{userData.email}</p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/user/edit')}
                                className="w-full bg-[#007EA7] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005f7f] transition-colors flex items-center justify-center gap-2"
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Profile Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold text-white mb-6">Profile Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <FaUser className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-blue-200 text-sm">Full Name</p>
                                        <p className="text-white font-medium">{userData.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <FaEnvelope className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-blue-200 text-sm">Email Address</p>
                                        <p className="text-white font-medium">{userData.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <FaCalendarAlt className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-blue-200 text-sm">Member Since</p>
                                        <p className="text-white font-medium">{formatDate(userData.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-8 pt-8 border-t border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-4">Library Activity</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 rounded-lg p-4 text-center">
                                        <div className="w-10 h-10 bg-[#007EA7] rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <FaBook className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-2xl font-bold text-white">{userData.borrowedBooks.length}</p>
                                        <p className="text-blue-200 text-sm">Borrowed Books</p>
                                    </div>

                                    <div className="bg-white/10 rounded-lg p-4 text-center">
                                        <div className="w-10 h-10 bg-[#FFD23F] rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <FaHeart className="w-5 h-5 text-[#007EA7]" />
                                        </div>
                                        <p className="text-2xl font-bold text-white">{userData.favoriteBooks.length}</p>
                                        <p className="text-blue-200 text-sm">Favorite Books</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Profile;