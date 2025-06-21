import React, { useEffect, useState } from 'react';
import { getAllUsers, getAllBorrowedBooks } from '../../Servies/servies';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [BorrowedBooks, setBorrowedBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await getAllUsers();
                const filteredUsers = usersRes.data.data.filter(user => !user.isAdmin);
                setUsers(filteredUsers)
                // Fetch borrowed books for each user and attach them to the user object
                const borrowedBooksRes = await getAllBorrowedBooks();
                setBorrowedBooks(borrowedBooksRes.data.data);


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    console.log(users)
    console.log(BorrowedBooks[0])



    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <div className="space-y-4">
                {users.map(user => (
                    <div key={user._id} className="border rounded-lg p-4 shadow">
                        <div className="flex items-center gap-4 mb-4">
                            {user.profilePic && (
                                <img 
                                    src={user.profilePic} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <h3 className="text-xl font-semibold">{user.name}</h3>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Borrowed Books:</h4>
                            {user.borrowedBooks && user.borrowedBooks.length > 0 ? (
                                <div className="grid gap-4">
                                    {user.borrowedBooks.map(book => (
                                        <div key={book._id} className="border p-3 rounded">
                                            <p className="font-medium">{book.title}</p>
                                            <p className="text-sm text-gray-600">Author: {book.author}</p>
                                            <p className="text-sm text-gray-600">
                                              Genre:{
                                                book.genre
                                              }
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Rental Price:{
                                                    book.rentalPrice
                                                }
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No books currently borrowed</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageUsers;