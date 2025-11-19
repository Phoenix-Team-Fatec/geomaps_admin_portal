import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";



export function useAdminData(){

    const [admin, setAdmin] = useState<any>(null)

    useEffect(() => {
        const token = sessionStorage.getItem("adminData")
        if (token){
            try{
                const data = jwtDecode(token)
                setAdmin(data)
            }catch(error){
                console.log("Erro ao carregar dados do usuário: ", error)
            }
        }
    },[])
    
    return admin
}