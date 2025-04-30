import React, { useEffect, useState } from "react";
import useAuthStore from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { loadGameProgress } from "../../services/saveProgress"; // Importar función de carga
import styles from "./../../styles/Menu.module.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AmbientMusic from "../../components/UI/AmbientMusic";
import Config from "../../components/UI/Config";

function MainMenu() {
  const { logoutUser, user } = useAuthStore();
  const navigate = useNavigate();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleConfig = () => {
    setShowConfig(true);
  };

  const handleConfigClose = () => {
    setShowConfig(false);
  };

  useEffect(() => {
    if (user) {
      loadGameProgress(user.username).then((progress) => {
        setHasSavedGame(!!progress); // Si hay progreso, habilita el botón "Continuar"
      });
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser(navigate);
  };

  const navigateControls = () => {
    navigate("/controles");
  };

  const continueGame = () => {
    navigate("/juego", { state: { continue: true } });
  };

  const startNewGame = () => {
    navigate("/seleccion-personaje"); // Ir a la selección de personaje
  };

  return (
    <div>
      {showConfig ? (
        <Config onBack={handleConfigClose} className={styles.bodyMain}/>
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="absolute"
              color="transparent"
              sx={{ boxShadow: 0 }}
            >
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
                  Cerrar Sesión <LogoutIcon />
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
              <button className="menus-button" onClick={navigateControls}>
                Controles
              </button>
              <div className={styles.playButtons}>
                <button
                  className="menus-button"
                  onClick={continueGame}
                  disabled={!hasSavedGame}
                >
                  Continuar
                </button>
                <button className="menus-button" onClick={startNewGame}>
                  Nueva Aventura
                </button>
              </div>
            </div>
          </div>
          <AmbientMusic />
        </>
      )}
    </div>
  );
}

export default MainMenu;
