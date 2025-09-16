import axios from 'axios';

const userRoute = new axios.create({
    baseURL: "http://localHost:3000/api/v1/users",
    withCredentials: true
})
const bookRoute = new axios.create({
    baseURL: "http://localHost:3000/api/v1/books",
    withCredentials: true
})
const reviewRouter= new axios.create({
    baseURL: "http://localHost:3000/api/v1/reviews",
    withCredentials: true
})

export const login = async (user) => {
    try {
        const res = await userRoute.post("/login", user);
        console.log(res);
        return res
    } catch (error) {
        console.log(error);
    }
}

export const signUp = async (user) => {
    try {
        const res = await userRoute.post("/signup", user);
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const getUserById = async (id) => {
    try {
        const res = await userRoute.get(`/getUser/${id}`)
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const updateUserProfile = async (userData) => {
    try {
        const res = userRoute.patch("/profile",
            userData
        )
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const forgetPassword = async (email) => {
    try {
        const res = await userRoute.patch("/forgot-password", {
            email
        })
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const resetPassword = async (password, token) => {
    try {
        const res = await userRoute.patch(`/reset-password/${token}`, {
            password
        })
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error)
    }
}





export const getAllUsers = async () => {
    try {
        const res = await userRoute.get("/getAllUsers");
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getAllBooks = async (page, limit, search) => {
    try {
        const res = await bookRoute.get("/getAllBooks", {
            params: {
                page,
                limit,
                search

            }
        });
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getBookById = async (id) => {
    try {
        const res = await bookRoute.get(`/getBookById/${id}`)
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const getAllBorrowedBooks = async () => {
    try {
        const res = await userRoute.get("/getBorrowedBooks");
        return res
    } catch (error) {
        console.log(error)
    }
}

export const addBooks = async (formData) => {
    try {
        const res = await bookRoute.post("/add-book", formData);
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const returnBook = async (userId, bookId) => {
    try {
        const res = await userRoute.post("/returnBook", {
            userId,
            bookId
        });
        return res;
    } catch (error) {
        console.log(error)
    }
}

export const borrowBook = async (bookId, days) => {
    try {
        const res = await userRoute.post('/borrowBook', {
            bookId,
            days
        })
        return res
    } catch (error) {
        console.log(error)

    }
}

export const getBorrowedBooksByUser = async (userId) => {
    try {
        const res = await userRoute.get(`/getBorrowedBooks/${userId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const addFavoriteBook = async (bookId) => {
    try {
        const res = await userRoute.post('/addFavorite', { bookId });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const removeFavoriteBook = async (bookId) => {
    try {
        const res = await userRoute.post('/removeFavorite', { bookId });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getFavoriteBooks = async () => {
    try {
        const res = await userRoute.get('/getFavorites');
        return res;
    } catch (error) {
        console.log(error);
    }
};



export const verifyBorrowCode = async (borrowCode) => {
    try {
        const res = await userRoute.post('/verifyBorrowCode', { borrowCode });
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//Reviews

export const addReview = async (reviewData) => {
    try {
        const res = await reviewRouter.post("/add-review", reviewData);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const getReviews = async (bookId) => {
    try {
        const res = await reviewRouter.get(`/get-reviews/${bookId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
}

// updating history

export const updateHistory=async (bookId)=>{
    try {
        const res=await userRoute.post("/addHistory",{
            bookId
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getHistory=async()=>{
    try {
        const res=await userRoute.get("/getHistory")
        return res
    } catch (error) {
        console.log(error)
    }
}