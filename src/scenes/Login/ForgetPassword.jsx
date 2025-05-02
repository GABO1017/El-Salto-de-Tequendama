import React, { useState } from "react";
import { auth} from "../../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
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

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enviar email con Firebase Auth (esto envía un enlace, pero podemos usarlo para notificación)
      await sendPasswordResetEmail(auth, email);

      Swal.fire("Link enviado", "Si te registraste con este correo, habras recibido el link de verificacion. Revisa tu correo", "success");
      navigate("/", { state: { email } });
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el link", "error");
    } finally {
      setLoading(false);
    }
  };

  const navigateLogin = () => {
    navigate("/");
  };

  return (
    <div className="body-menus">
      {loading && <Loading />}
      <div className="titles">
        <h1 className="title-menus">El Salto de Tequendama</h1>
        <h3 className="subtitle-menus">Una aventura educativa Muisca</h3>
      </div>
      <form onSubmit={handleSubmit} className="menus-form">
        <h3 className="text-recuperation">
          Ingresa el correo electronico con el que te registraste para recibir
          un link de recuperacion
        </h3>
        <StyledTextField
          id="email"
          label="Correo Electronico"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="menus-links">
          <a onClick={navigateLogin}>Regresar al inicio de sesion</a>
        </div>
        <button type="submit" className="menus-button">
          Enviar link
        </button>
      </form>
      <AmbientMusic />
    </div>
  );
}

export default ForgetPassword;
