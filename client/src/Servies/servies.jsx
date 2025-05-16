import axios from 'axios';

const userRoute= new axios.create({
    baseURL:"http://localHost:3000/api/v1/users",
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
        const res=await userRoute.patch("/forget-password",{
            email
        })
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error)
    }
}