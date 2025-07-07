import React, { useState, useEffect } from 'react';
import { getAllBorrowedBooks } from '../../Servies/servies';

function ManageBorrowedBooks() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await getAllBorrowedBooks();
                setBorrowedBooks(response.data.data);
            } catch (err) {
                console.error('Error fetching borrowed books:', err);
                setError('Failed to fetch borrowed books.');
            }
            setLoading(false);
        };

        fetchBorrowedBooks();
    }, []);

    console.log(borrowedBooks)
    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-background text-text">Loading books...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-background text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 bg-background min-h-screen text-text">
            <h2 className="text-3xl font-bold mb-6 text-primary">Manage Borrowed Books</h2>

            {borrowedBooks.length === 0 ? (
                <div className="text-center text-lg text-gray-500">
                    No books are currently borrowed.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {borrowedBooks.map(borrow => (
                        <div key={borrow._id} className="bg-white rounded-lg shadow-lg p-6 border border-secondary">
                            <h3 className="text-xl font-semibold mb-2 text-primary">{borrow.book.title}</h3>
                            {borrow.coverImage && (
                                <div className="mb-4">
                                    <img 
                                        src={borrow.coverImage} 
                                        alt={`Cover of ${borrow.book.title}`}
                                        className="w-full h-48 object-cover rounded-md shadow-md"
                                    />
                                </div>
                            )}
                            <p className="text-gray-700 mb-1"><strong>Author:</strong> {borrow.bookAuthor}</p>
                            <p className="text-gray-700 mb-1"><strong>Borrowed by:</strong> {borrow.userName}</p>
                            <p className="text-gray-700 mb-1"><strong>Borrow Date:</strong> {new Date(borrow.borrowDate).toLocaleDateString()}</p>
                            <p className="text-gray-700 mb-1"><strong>Return Date:</strong> {new Date(borrow.returnDate).toLocaleDateString()}</p>
                            {/* You can add more details or actions here, e.g., a button to mark as returned */}
                            <div className="mt-4 flex justify-end">
                                <button className="bg-highlight text-text px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors duration-200">
                                    Mark as Returned
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageBorrowedBooks;