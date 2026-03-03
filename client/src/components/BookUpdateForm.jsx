import { useEffect, useState } from "react";

export const BookUpdateForm = ({ setBookNewData , BookNewData, updateBook, onCancel , book}) => {
    const handleUpdateBook=async(e)=>{
        e.preventDefault()
        console.log(book._id,BookNewData)
        await updateBook(book._id,BookNewData)
        onCancel()
    }

    return(
        <div>
            <h3 className=" flex text-2xl font-bold mb-4 text-gray-900">Update {book.title}</h3>
            <div>
                 <div className='w-1/3 mb-4'>
                    <img src={book.coverImage} alt="" className="w-full h-auto rounded-lg" />
                 </div>
            </div>
                            <form onSubmit={handleUpdateBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={BookNewData.title}
                                    onChange={(e) => setBookNewData({ ...BookNewData, title: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Author"
                                    value={BookNewData.author}
                                    onChange={(e) => setBookNewData({ ...BookNewData, author: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Genre"
                                    value={BookNewData.genre}
                                    onChange={(e) => setBookNewData({ ...BookNewData, genre: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Published Year"
                                    value={BookNewData.publishedYear}
                                    onChange={(e) => setBookNewData({ ...BookNewData, publishedYear: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={BookNewData.price}
                                    onChange={(e) => setBookNewData({ ...BookNewData, price: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={BookNewData.stock}
                                    onChange={(e) => setBookNewData({ ...BookNewData, stock: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Rental Price"
                                    value={BookNewData.rentalPrice}
                                    onChange={(e) => setBookNewData({ ...BookNewData, rentalPrice: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="md:col-span-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-200"
                                >
                                    Update Book
                                </button>
            </form>
        </div>
    )
}
