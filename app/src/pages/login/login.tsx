import { useState } from "react";
import { useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";
import api from "../../services/api";

function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [userAttempts, setUserAttempts] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            // Clear previous error
            setErrorMessage("");

            if (userAttempts >= 3) {
                setErrorMessage("Usuário bloqueado por excesso de tentativas");
                return;
            }

            if (!user.trim() || !password.trim()) {
                setErrorMessage("Por favor, preencha todos os campos");
                return;
            }

            const result = await api.post(`/admin/login?username=${user}&password=${password}`);
            const token = result.data.token;

            sessionStorage.setItem("adminData", token);

            navigate("/users");
            setUserAttempts(0);
        } catch (error: unknown) {
            setUserAttempts(userAttempts + 1);
            console.log("Erro ao efetuar login:", error);

            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 401) {
                setErrorMessage("Usuário ou senha incorretos");
            } else {
                setErrorMessage("Erro ao conectar com o servidor");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page">
            <div className="main-content">
                <div className="login-container">
                {/* Logo placeholder - uncomment when logo is available */}
                {/* <img src="/logo.png" alt="GeoMaps Logo" className="logo" /> */}

                <h2 className="login-title">GeoMaps — Admin</h2>
                <p className="login-subtitle">Sistema de Administração</p>

                <div className="form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className={errorMessage ? "input-error" : ""}
                        />
                    </div>

                    <div className="input-group password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errorMessage ? "input-error" : ""}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <button className="btn" onClick={handleSubmit}>
                    Entrar
                </button>

                {/* Reset password button - uncomment when functionality is ready */}
                {/* <button className="btn-reset-pass">
                    Esqueci minha senha
                </button> */}
                </div>
            </div>
        </div>
    );
}

export default Login;
