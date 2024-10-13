import React, { useState } from "react";
import useAuthStore from "../../services/auth";
import { useNavigate } from 'react-router-dom';
import './../../styles/global.css';         

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const { registerUser, error } = useAuthStore();
    const navigate = useNavigate();  

    const handleSubmit = (e) => {
      e.preventDefault();
      registerUser(email, password, username, navigate);  
    };

    return (
        <div>
            REGISTER
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    required
                />
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
                <button type="submit">Registrarse</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Register;
