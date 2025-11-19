import { useState } from "react"
import { useNavigate } from "react-router"
import "./login.css"
import api from "../../services/api"

function Login(){


    const[user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [userAttempts, setUserAttempts] = useState(0)

    const navigate = useNavigate()

  

    const handleSubmit = async () => {
        
        try{
            if (userAttempts > 3){
                alert("Usuário bloqueado por excesso de tentativas")
                setUserAttempts(0)
            }else{
                const result = await api.post(`/admin/login?username=${user}&password=${password}`)
                const token = result.data.token
                sessionStorage.setItem("adminData",token)
                alert("Login realizado com sucesso!")
                navigate("/users")
                setUserAttempts(0)
            }  
        }catch(error){
            setUserAttempts(userAttempts + 1)
            console.log("Erro ao efetuar login: ", error)
            alert("Erro ao efetuar login")
        }
    }




    return (
        <>
            <div className="main-content">
                <h2>Login</h2>
                <div className="form">
                    
                  
                    <input type="text" placeholder="User" onChange={(e) => setUser(e.target.value)}/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                
                </div>
                <button className="btn" onClick={handleSubmit}> 
                    <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
                    <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                    <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
                    </svg>
                    <span>Entrar</span>     
                </button>
                    
            </div>
        </>
    )
}


export default Login