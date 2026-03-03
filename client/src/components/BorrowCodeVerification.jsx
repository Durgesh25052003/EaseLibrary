import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { verifyBorrowCode } from '../Servies/servies';
import { db } from '../../Firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

const BorrowCodeVerification = ({ onVerifySuccess }) => {
    const [inputCode, setInputCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [verifiedData, setVerifiedData] = useState(null);

    const deleteNotifications = async (borrowCode, userId) => {
        try {
            // Create queries to find notifications related to this borrow request
            const notificationsRef = collection(db, 'notifications');

            // Query by borrow code
            const codeQuery = query(notificationsRef, where('borrowCode', '==', borrowCode));
            const codeSnapshot = await getDocs(codeQuery);

            // Query by user ID
            const userQuery = query(notificationsRef, where('userId', '==', userId));
            const userSnapshot = await getDocs(userQuery);

            // Combine and deduplicate documents
            const docsToDelete = new Set();
            codeSnapshot.forEach(doc => docsToDelete.add(doc.id));
            userSnapshot.forEach(doc => docsToDelete.add(doc.id));

            // Delete all matching notifications
            const deletePromises = Array.from(docsToDelete).map(docId =>
                deleteDoc(doc.ref)
            );

            await Promise.all(deletePromises);

            console.log(`Deleted ${docsToDelete.size} notifications`);
        } catch (error) {
            console.error('Error deleting notifications:', error);
            // Don't throw error as this is a secondary operation
        }
    };

    const handleVerify = async () => {
        if (!inputCode.trim()) {
            setMessage({ type: 'error', text: 'Please enter the borrow code' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await verifyBorrowCode(inputCode);

            if (response.data.success) {
                setVerifiedData(response.data.data);
                setMessage({ type: 'success', text: 'Borrow code verified successfully!' });

                // Delete notifications from Firebase after successful verification
                await deleteNotifications(inputCode, response.data.data.user._id);

                if (onVerifySuccess) {
                    onVerifySuccess(response.data.data);
                }
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Invalid borrow code' });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Verification failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#007EA7] to-[#00A8E8] bg-clip-text text-transparent">
                            Borrow Code Verification
                        </h2>
                        <p className="text-gray-600 mt-2 text-sm">
                            Enter the borrow code to verify your book request
                        </p>
                    </div>

                    {/* Verification Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Borrow Code
                            </label>
                            <input
                                type="text"
                                value={inputCode}
                                onChange={(e) => {
                                    setInputCode(e.target.value);
                                    setMessage({ type: '', text: '' });
                                    setVerifiedData(null);
                                }}
                                placeholder="Enter 6-digit code"
                                maxLength={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                            />
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FFD23F] to-[#F7C948] text-gray-900 font-semibold py-3 px-4 rounded-lg hover:from-[#F7C948] hover:to-[#FFD23F] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify Code'
                            )}
                        </button>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`p-3 rounded-lg text-center text-sm font-medium ${message.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Verified Data Display */}
                    {verifiedData && (
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-green-800">Borrow Details</h3>
                            <div className="text-sm text-green-700 space-y-1">
                                <p><strong>User:</strong> {verifiedData.user.name}</p>
                                <p><strong>Book:</strong> {verifiedData.book.title}</p>
                                <p><strong>Author:</strong> {verifiedData.book.author}</p>
                                <p><strong>Borrow Date:</strong> {new Date(verifiedData.borrowDate).toLocaleDateString()}</p>
                                <p><strong>Return Date:</strong> {new Date(verifiedData.returnDate).toLocaleDateString()}</p>
                                <p><strong>Amount:</strong> ${verifiedData.amountPaid}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowCodeVerification;