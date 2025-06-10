import axios from 'axios';

const userRoute= new axios.create({
    baseURL:"http://localHost:3000/api/v1/users",
    withCredentials:true
})
const bookRoute= new axios.create({
    baseURL:"http://localHost:3000/api/v1/books",
    withCredentials:true
})

export const login=async (user)=>{
    try {
        const res=await userRoute.post("/login",user);
        console.log(res);
        return res
    } catch (error) {
        console.log(error);
    }
}

export const signUp=async (user)=>{
    try {
        const res=await userRoute.post("/signup",user);
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const forgetPassword=async(email)=>{
    try {
        const res=await userRoute.patch("/forgot-password",{
            email
        })
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const resetPassword=async(password,token)=>{
    try {
        const res=await userRoute.patch(`/reset-password/${token}`,{
            password
        })
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const getAllUsers=async()=>{
    try {
        const res=await userRoute.get("/getAllUsers");
        return res
    }catch(error){
        console.log(error)
    }
}

export const getAllBooks=async()=>{
    try {
        const res=await bookRoute.get("/getAllBooks");
        return res
    }catch(error){
        console.log(error)
    }
}

export const getAllBorrowedBooks=async()=>{
    try {
        const res=await userRoute.get("/getBorrowedBooks");
        return res
    } catch (error) {
        console.log(error)
    }
}