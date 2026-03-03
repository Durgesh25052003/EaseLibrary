import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userRoute from '../../Servies/servies';
import { useState } from 'react';

const AuthSuccess = () => {
    const navigate=useNavigate();
    const [User, setUser] = useState({});
     const handleAuth=async ()=>{
            const params = new URLSearchParams(window.location.search)
            console.log(params);
            const accessToken = params.get("token")
            console.log("Token", accessToken);
            if(accessToken){
                localStorage.setItem("accessToken", accessToken)
                try {
                    const res=await userRoute.get("http://localhost:3000/api/v1/users/me",{
                        headers:{
                            Authorization: `Bearer ${accessToken}`
                        }
                    }) 
                 console.log(res);
                 setUser(res.data.user);
                 sessionStorage.setItem('user',JSON.stringify(res.data.user))
                 if(!res.data.user.isAdmin){
                 navigate("/user");
                 }
                } catch (error) {
                console.log(error);
            }
        }
    }
    useEffect(()=>{
       handleAuth()
}, [navigate]);
    return (
        <div>Auth-Success</div>
    )
}

export default AuthSuccess;

