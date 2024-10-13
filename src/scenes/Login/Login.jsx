import React, { useState } from "react";
import useAuthStore from "../../services/auth";
import { useNavigate } from 'react-router-dom';
import './../../styles/global.css';         

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const { loginUser, error } = useAuthStore();
    const navigate = useNavigate();  // Obtén el navigate

    const handleSubmit = (e) => {
      e.preventDefault();
      loginUser(username, password, navigate);  // Pasa navigate como argumento
    };

    return (
        <div>
            LOGIN
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nombre de usuario"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit">Iniciar sesión</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Login;

