import React from "react";
import useAuthStore from "../../services/auth";
import { useNavigate } from "react-router-dom";
import styles from "./../../styles/Menu.module.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

function MainMenu() {
  const { logoutUser, user } = useAuthStore();
  const navigate = useNavigate(); // Obtén el navigate

  const handleLogout = () => {
    logoutUser(navigate); // Pasa navigate como argumento al cerrar sesión
  };

  const navigateControls = () => {
    navigate("/controls");
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="absolute" color="transparent" sx={{ boxShadow: 0 }}>
          <Toolbar>
            <Avatar sx={{ bgcolor: "#FFD700" }}>
              <PersonIcon sx={{ color: "black" }} />
            </Avatar>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, marginLeft: 3 }}
            >
              Bienvenido, {user?.username}!
            </Typography>
            <a className={styles.logout} onClick={handleLogout}>
              Cerrar Sesión
            </a>
          </Toolbar>
        </AppBar>
      </Box>
      <div className={styles.bodyMain}>
        <div className="titles">
          <h1 className="title-menus">El Salto de Tequendama</h1>
          <h3 className="subtitle-menus">Una aventura educativa Muisca</h3>
        </div>
        <div className="menus-form">
          <button className="menus-button">Configuracion</button>
          <button className="menus-button" onClick={navigateControls}>Controles</button>
          <div className={styles.playButtons}>
            <button className="menus-button" disabled>Continuar</button>
            <button className="menus-button" >Nueva Aventura</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
