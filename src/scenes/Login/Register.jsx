import React, { useState } from "react";
import useAuthStore from "../../services/auth";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";
import './../../styles/global.css';         

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      width: "100%",
       // Fondo semitransparente
      backdropFilter: "blur(5px)",  // Efecto borroso
      color: "white",  // Texto de color blanco
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "white",  // Borde inicial blanco
      },
      "&:hover fieldset": {
        borderColor: "white",  // Borde blanco al hacer hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",  // Borde blanco al estar activo
      },
    },
    "& .MuiInputLabel-root": {
      color: "white",  // Color del label (inicial)
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",  // Color del label al estar activo
    },
  }));

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
        <div className="body-register">
            <div className="titles">
                <h1 className="title-register">El Salto de Tequendama</h1>
                <h3 className="subtitle-register">Una aventura educativa Muisca</h3>
            </div>
            <form onSubmit={handleSubmit} className="register-form" >
                <StyledTextField
                    id="email"
                    label="Correo"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <StyledTextField
                    id="username"
                    label="Nombre de usuario"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <StyledTextField
                    id="password"
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <button type="submit" className="register-button">Registrarse</button>
                {error && <p className="register-error">{error}</p>}
            </form>
        </div>
    );
}

export default Register;
