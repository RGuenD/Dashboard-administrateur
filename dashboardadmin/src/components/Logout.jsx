import React from 'react';
import { IoIosLogOut } from "react-icons/io";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate=useNavigate();
    const logoutfunct = async () =>{
        try {
            const auth = getAuth();
            await signOut(auth);
            navigate('/Login');

        }catch(error){
            console.error("Erreur Logout: ", error);
        }
    }
    return (
        <button 
        onClick={logoutfunct}
        style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",      
            alignItems: "center",  
            gap: "8px",
            fontFamily: "Poppins",
            fontSize: "0.8rem",
            fontWeight: "400",
            color: "#000",
        }}
        >
        <IoIosLogOut size={20} /> 
        <span>LOGOUT</span>
        </button>
    )
}

export default Logout
