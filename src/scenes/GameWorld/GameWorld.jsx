import React, { useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Village from "../GameWorld/environment/Village";
import PauseMenu from "../../components/UI/PauseMenu";
import Dead from "../../components/UI/Dead";
import GameUI from "../../components/UI/GameUI";
import Loading from "../../components/UI/Loading";
import PlayerController from "../../three/PlayerController";
import Checkpoint from "../../three/Checkpoint";
import Enemy from "../GameWorld/characters/enemies/Enemy";
import { useLocation } from "react-router-dom";
import {
  saveGameProgress,
  loadGameProgress,
  resetGameProgress,
} from "../../services/saveProgress";
import useAuthStore from "../../services/auth";
import { Snackbar, Alert } from "@mui/material";

const GameWorld = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isPaused, setIsPaused] = useState(false);
  const [playerPosition, setPlayerPosition] = useState([-10, 0.5, 0]); // Posición inicial por defecto
  const [health, setHealth] = useState(50);
  const [isDead, setIsDead] = useState(false);
  const [objective, setObjective] = useState("Habla con el sabio del pueblo"); // Objetivo inicial
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Obtén el navigate

  // 🔹 Estado para manejar alertas
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Función para mostrar alertas
  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "run", keys: ["Shift"] },
    { name: "jump", keys: ["Space"] },
  ];

  // Escuchar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPaused((prev) => !prev); // Alterna entre pausa y reanudar
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (user && location.state?.continue) {
      loadGameProgress(user.username, showAlert).then((progress) => {
        if (progress) {
          setPlayerPosition([
            progress.position.x,
            progress.position.y,
            progress.position.z,
          ]);
          setHealth(progress.health);
        }
      });
    } else if (user) {
      resetGameProgress(user.username, showAlert);
    }
    setIsLoading(false);
  }, [user, location.state]);

  // 🔹 Función que actualiza la posición del jugador
  const updatePlayerPosition = (newPosition) => {
    setPlayerPosition(newPosition);
  };

  const handleSaveGame = () => {
    if (user) {
      saveGameProgress(
        user.username,
        {
          position: {
            x: playerPosition[0],
            y: playerPosition[1],
            z: playerPosition[2],
          },
          health: health,
        },
        showAlert
      );
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleMainMenu = () => {
    navigate("/menu");
  };

  const handlePlayerCollision = (other) => {
    if (other.rigidBodyObject?.name === "player") {
      setHealth((prev) => {
        const newHealth = Math.max(0, prev - 10);
        console.log("⚠️ ¡El jugador ha sido golpeado!", health);
        if (newHealth === 0) {
          setIsDead(true); // Marca al jugador como muerto
          setIsPaused(true); // Pausa el juego
        }
        return newHealth;
      });
    }
  };

  const handleContinue = () => {
    if (user) {
      loadGameProgress(user.username).then((progress) => {
        if (progress) {
          setPlayerPosition([
            progress.position.x,
            progress.position.y,
            progress.position.z,
          ]);
          setHealth(progress.health);
          setIsDead(false); // Ocultar pantalla de muerte
          setIsPaused(false); // Reanudar juego
        }
      });
    }
  };

  // Función para manejar el checkpoint automático
  const handleCheckpointReached = (checkpointId) => {
    if (user) {
      // Guarda la posición actual, la salud y el checkpoint (opcional)
      saveGameProgress(user.username, {
        position: {
          x: playerPosition[0],
          y: playerPosition[1],
          z: playerPosition[2],
        },
        health: health,
        checkpoint: checkpointId,
      });
      console.log("Checkpoint automático guardado:", checkpointId);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Interfaz de usuario */}

      {!isPaused && !isDead && (
        <GameUI
          health={health}
          onPause={() => setIsPaused(true)}
          objective={objective}
        />
      )}

      {/* Menús de pausa y muerte */}
      {isPaused && !isDead && (
        <PauseMenu
          onResume={handleResume}
          onMainMenu={handleMainMenu}
          onSave={handleSaveGame}
        />
      )}
      {isDead && (
        <Dead onContinue={handleContinue} onMainMenu={handleMainMenu} />
      )}

      {/* Juego */}
      <KeyboardControls map={keyboardMap}>
        <Canvas
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 5, 15], fov: 75 }}
          shadows
        >
          <Sky
            sunPosition={[500, 100, 500]}
            distance={10000}
            turbidity={8}
            rayleigh={1}
            inclination={0.6}
            azimuth={0.25}
          />
          <Physics paused={isPaused} debug>
            <Village isPaused={isPaused} position={[10, -10, 0]} scale={5} />
            <PlayerController
              isPaused={isPaused}
              initialPosition={playerPosition}
              onPositionChange={updatePlayerPosition}
            />
            <Enemy
              position={[-20, -5, 0]}
              onPlayerCollide={handlePlayerCollision}
            />
            <Checkpoint
              position={[20, -5, -107]}
              checkpointId="1"
              onCheckpoint={handleCheckpointReached}
            />
          </Physics>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[0, 50, 0]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={500}
          />
          <pointLight position={[0, 100, 0]} intensity={1} castShadow />
        </Canvas>
      </KeyboardControls>
      {/* Snackbar para mostrar alertas */}
      <Snackbar
        open={alert.open}
        autoHideDuration={2000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: alert.severity === "success" || alert.severity === "info" ? "#FFA500" : "",
            color: alert.severity === "success" || alert.severity === "info" ? "black" : "",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GameWorld;
