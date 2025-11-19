import React from "react";
import { useNavigate } from "react-router";


interface PrivateAdminRouteProps{
    children: React.ReactNode;
}


const PrivateAdminRoute: React.FC<PrivateAdminRouteProps> = ({children}) => {

    const navigate = useNavigate();
    const token = sessionStorage.getItem("adminData");

    if (!token){
        navigate("/login");
        return null;
    }

    return <>{children}</>
}


export default PrivateAdminRoute