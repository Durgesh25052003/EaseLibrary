import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCamera, FaSave, FaSpinner, FaBook } from 'react-icons/fa';
import { getUserById, updateUserProfile } from '../../Servies/servies';

import toast from 'react-hot-toast';

function EditProfile() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        profilePic: '',
        createdAt: null,
        updatedAt: null,
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profilePic: null,
    });

    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const userRef = useRef(null);


    useEffect(() => {
        fetchUserData();
        userRef.current = JSON.parse(sessionStorage.getItem("user"))

    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            console.log(useRef.current)
            const response = await getUserById(userRef.current._id);
            console.log(response)
            const user = response.data.user || {};
            setUserData({
                name: user.name || '',
                email: user.email || '',
                profilePic: user.profilePic || '',
                createdAt: user.createdAt || null,
                updatedAt: user.updatedAt || null,
            });
            setFormData({
                name: user.name || '',
                email: user.email || '',
                profilePic: null,
            });
            setPreviewUrl(user.profilePic || '');
        } catch (error) {
            toast.error('Failed to load profile data');
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profilePic: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            if (formData.profilePic) {
                formDataToSend.append('profilePic', formData.profilePic);
            }

            await updateUserProfile(formDataToSend);
            toast.success('Profile updated successfully');
            fetchUserData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        try {
            return new Date(dateString).toLocaleDateString();
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
                            <FaBook className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">Edit Profile</h1>
                    <p className="text-blue-100">Update your personal information</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
                >
                    <form onSubmit={handleProfileUpdate} className="space-y-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                            >
                                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="w-16 h-16 text-white/60" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-[#007EA7] text-white p-3 rounded-full cursor-pointer hover:bg-[#005f7f] transition-colors shadow-lg">
                                    <FaCamera className="w-5 h-5" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </motion.div>
                            <p className="text-sm text-blue-200 mt-3">Click to change photo</p>
                        </div>

                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2 flex items-center">
                                    <FaUser className="mr-2" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-300"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2 flex items-center">
                                    <FaEnvelope className="mr-2" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-300"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="pt-6 border-t border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
                                <div>
                                    <p className="text-sm font-medium mb-1">Account Created</p>
                                    <p className="text-white">{formatDate(userData.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-1">Last Updated</p>
                                    <p className="text-white">{formatDate(userData.updatedAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            type="submit"
                            disabled={saving}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-[#00A8E8] to-[#007EA7] text-white py-4 rounded-lg font-semibold hover:from-[#007EA7] hover:to-[#005f7f] transition-all duration-300 flex items-center justify-center disabled:opacity-50 shadow-lg"
                        >
                            {saving ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Save Profile Changes
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default EditProfile;