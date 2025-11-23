import { useState } from "react";
import { useNavigate } from "react-router";
import "./login.css";
import api from "../../services/api";

function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [userAttempts, setUserAttempts] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            if (userAttempts > 3) {
                alert("Usuário bloqueado por excesso de tentativas");
                setUserAttempts(0);
                return;
            }

            const result = await api.post(`/admin/login?username=${user}&password=${password}`);
            const token = result.data.token;

            sessionStorage.setItem("adminData", token);

            navigate("/users");
            setUserAttempts(0);
        } catch (error) {
            setUserAttempts(userAttempts + 1);
            console.log("Erro ao efetuar login:", error);
            alert("Erro ao efetuar login");
        }
    };

    return (
        <div className="main-content">
            {/* imagem/logo futura */}
            {/* <img src="/logo.png" className="logo" /> */}

            <h2>GeoMaps — Admin</h2>

            <div className="form">
                <input
                    type="text"
                    placeholder="Usuário"
                    onChange={(e) => setUser(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button className="btn" onClick={handleSubmit}>
                Entrar
            </button>

            {/* <button className="btn-reset-pass">
                Esqueci minha senha
            </button> */}
        </div>
    );
}

export default Login;
