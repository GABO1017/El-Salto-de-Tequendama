import React, { useState } from "react";
import useAuthStore from "../../services/auth";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";
import './../../styles/global.css';         

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      width: "100%",
      background: "rgba(255, 255, 255, 0.1)",  // Fondo semitransparente
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

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const { loginUser, error } = useAuthStore();
    const navigate = useNavigate();  // Obtén el navigate

    const handleSubmit = (e) => {
      e.preventDefault();
      loginUser(username, password, navigate);  // Pasa navigate como argumento
    };

    const navigatePassForgot = () => {
        navigate('/olvide-mi-contrasena')
    }

    const navigateRegister = () => {
        navigate('/registro')
    }

    return (
        <div className="body-menus">
        <div className="titles">
            <h1 className="title-menus">El Salto de Tequendama</h1>
            <h3 className="subtitle-menus">Una aventura educativa Muisca</h3>
        </div>
        <form onSubmit={handleSubmit} className="menus-form" >
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
            <div className="menus-links">
                <a onClick={navigateRegister}>Aun no te has registrado?</a>
                <a onClick={navigatePassForgot}>Olvide mi contraseña</a>
            </div>
            <button type="submit" className="menus-button">Inicia Sesion</button>
            {error && <p className="menus-error">{error}</p>}
        </form>
    </div>
    );
}

export default Login;

