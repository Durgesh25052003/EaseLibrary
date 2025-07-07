import React, { useState, useEffect } from 'react';
import { getAllBooks, addBooks } from '../../Servies/servies'; // Assuming addBook exists
import {toast} from 'react-toastify';


function ManageBooks() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        description: '',
        genre: '', // New field
        publishedYear: '', // New field
        price: '', // New field
        stock: '', // New field
        rentalPrice: '', // New field
        coverImage: null, // For file object
    });
    const [addBookMessage, setAddBookMessage] = useState('');

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await getAllBooks();
                setBorrowedBooks(response.data.data);
            } catch (err) {
                console.error('Error fetching borrowed books:', err);
                setError('Failed to fetch borrowed books.');
            }
            setLoading(false);
        };

        fetchBorrowedBooks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewBook(prev => ({ ...prev, coverImage: e.target.files[0] }));
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        setAddBookMessage('');
        console.log(newBook)
        const formData = new FormData();
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('description', newBook.description);
        formData.append('genre', newBook.genre); // Append new field
        formData.append('publishedYear', newBook.publishedYear); // Append new field
        formData.append('price', newBook.price); // Append new field
        formData.append('stock', newBook.stock); // Append new field
        formData.append('rentalPrice', newBook.rentalPrice); // Append new field
        if (newBook.coverImage) {
            formData.append('coverImage', newBook.coverImage);
        }

        try {
            const response = await addBooks(formData); // Call your addBook API function
            
            setAddBookMessage('Book added successfully!');
            toast.success("Book added Successfully")
            // setNewBook({ title: '', author: '', description: '', genre: '', publishedYear: '', price: '', stock: '', coverImage: null }); // Clear form
            // Optionally re-fetch borrowed books or update state if needed
        } catch (err) {
            console.error('Error adding book:', err);
            toast.error("Failed to add book")
            setAddBookMessage('Failed to add book: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-background text-text">Loading books...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-background text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 bg-background min-h-screen text-text">
            <h2 className="text-3xl font-bold mb-6 text-primary">Manage Books</h2>

            {/* Add New Book Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-secondary">
                <h3 className="text-2xl font-bold mb-4 text-primary">Add New Book</h3>
                <form onSubmit={handleAddBook} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newBook.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={newBook.author}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newBook.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                            required
                        ></textarea>
                    </div>
                    {/* New fields added below */}
                    <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                        <input
                            type="text"
                            id="genre"
                            name="genre"
                            value={newBook.genre}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">Published Year</label>
                        <input
                            type="number"
                            id="publishedYear"
                            name="publishedYear"
                            value={newBook.publishedYear}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={newBook.price}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={newBook.stock}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Rental Price</label>
                        <input
                            type="number"
                            id="rentalPrice"
                            name="rentalPrice"
                            value={newBook.rentalPrice}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-100 p-2"
                        />
                    </div>
                    {/* End of new fields */}
                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
                        <input
                            type="file"
                            id="coverImage"
                            name="coverImage"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-highlight text-text py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors duration-200 font-semibold"
                    >
                        Add Book
                    </button>
                    {addBookMessage && <p className="mt-2 text-center text-sm font-medium text-primary">{addBookMessage}</p>}
                </form>
            </div>

            {/* Existing Borrowed Books Section */}
            <h2 className="text-3xl font-bold mb-6 text-primary">Current Books</h2>
            {borrowedBooks.length === 0 ? (
                <div className="text-center text-lg text-gray-500">
                    No books are currently borrowed.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {borrowedBooks.map(borrow => (
                        <div key={borrow._id} className="bg-white rounded-lg shadow-lg p-6 border border-secondary">
                            <h3 className="text-xl font-semibold mb-2 text-primary">{borrow?.title || 'Unknown Book'}</h3>
                            {borrow?.coverImage && (
                                <div className="mb-4">
                                    <img
                                        src={borrow.coverImage}
                                        alt={`Cover of ${borrow.title}`}
                                        className="w-full h-48 object-cover rounded-md shadow-md"
                                    />
                                </div>
                            )}
                            <p className="text-gray-700 mb-1"><strong>Author:</strong> {borrow?.author || 'Unknown Author'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageBooks;