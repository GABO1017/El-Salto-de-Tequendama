import React, { useState } from "react";
import useAuthStore from "../../services/auth";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Loading from "../../components/UI/Loading";
import AmbientMusic from "../../components/UI/AmbientMusic";

import "./../../styles/global.css";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    width: "100%",
    background: "rgba(255, 255, 255, 0.1)", // Fondo semitransparente
    backdropFilter: "blur(5px)", // Efecto borroso
    color: "white", // Texto de color blanco
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "white", // Borde inicial blanco
    },
    "&:hover fieldset": {
      borderColor: "white", // Borde blanco al hacer hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "white", // Borde blanco al estar activo
    },
  },
  "& .MuiInputLabel-root": {
    color: "white", // Color del label (inicial)
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white", // Color del label al estar activo
  },
}));

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser, error } = useAuthStore();
  const navigate = useNavigate(); // Obtén el navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el loading antes de la solicitud

    try {
      await loginUser(username, password, navigate);
    } finally {
      setLoading(false); // Desactiva el loading después de la respuesta
    }
  };

  const navigatePassForgot = () => {
    navigate("/olvide-mi-contrasena");
  };

  const navigateRegister = () => {
    navigate("/registro");
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="body-menus">
      {loading && <Loading />}
      <div className="titles">
        <h1 className="title-menus">El Salto de Tequendama</h1>
        <h3 className="subtitle-menus">Una aventura educativa Muisca</h3>
      </div>
      <form onSubmit={handleSubmit} className="menus-form">
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
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                    sx={{ color: "white" }} // Cambia el color del icono a blanco
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "white" }} />
                    ) : (
                      <Visibility sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <div className="menus-links">
          <a onClick={navigateRegister}>Aun no te has registrado?</a>
          <a onClick={navigatePassForgot}>Olvide mi contraseña</a>
        </div>
        <button type="submit" className="menus-button">
          Inicia Sesion
        </button>
      </form>
      <AmbientMusic />
    </div>
  );
}

export default Login;
