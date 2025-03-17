import React, { useRef, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Village2 from "../GameWorld/environment/Village2";
import PauseMenu from "../../components/UI/PauseMenu";
import Dead from "../../components/UI/Dead";
import GameUI from "../../components/UI/GameUI";
import Loading from "../../components/UI/Loading";
import AmbientSound from "../../components/UI/AmbientSound";
import PlayerController from "../../three/PlayerController";
import Checkpoint from "../../three/Checkpoint";
import Rain from "../../three/Rain";
import Enemy from "../GameWorld/characters/enemies/Enemy";
import Jaguar from "../GameWorld/characters/enemies/Jaguar";
import Tools from "../../components/3D Objects/Tools";
import { useLocation } from "react-router-dom";
import {
  saveGameProgress,
  loadGameProgress,
  resetGameProgress,
} from "../../services/saveProgress";
import useAuthStore from "../../services/auth";
import { Snackbar, Alert } from "@mui/material";
import { Perf } from "r3f-perf";
import useSound from "use-sound";

const GameWorld = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isPaused, setIsPaused] = useState(false);
  const playerRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState([-10, 0.5, 0]); // Posición inicial por defecto
  const [health, setHealth] = useState(50);
  const [isDead, setIsDead] = useState(false);
  const [objective, setObjective] = useState("Habla con el sabio del pueblo"); // Objetivo inicial
  const [isLoading, setIsLoading] = useState(true);
  const [equippedTool, setEquippedTool] = useState(null); // Estado para la herramienta equipada
  const navigate = useNavigate(); // Obtén el navigate
  const [playDamage] = useSound("/sounds/damage.mp3", { volume: 0.3 });
  const [playDeath] = useSound("/sounds/death.mp3", { volume: 0.2 });
  const [playPickup] = useSound("/sounds/pickup.mp3", { volume: 0.5 });

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
          setEquippedTool(progress.equippedTool || null);
          showAlert("Partida cargada exitosamente", "success");
        }
      });
    } else if (user) {
      resetGameProgress(user.username, showAlert);
    }
    setIsLoading(false);
  }, [user, location.state]);

  const handleSaveGame = () => {
    if (user && playerRef.current) {
      showAlert("Guardando... No cierres la pestaña", "info");
      const currentPosition = playerRef.current.getCurrentPosition();
      saveGameProgress(
        user.username,
        {
          position: {
            x: currentPosition[0],
            y: currentPosition[1],
            z: currentPosition[2],
          },
          health: health,
          equippedTool: equippedTool,
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
          playDeath(); // Reproduce el sonido de muerte
          playerRef.current.playDeathAnimation();
          setIsDead(true); // Marca al jugador como muerto
          setIsPaused(true); // Pausa el juego
        } else {
          // Si la salud sigue por encima de 0, reproducir el sonido de daño
          playDamage();
          if (playerRef.current) {
            console.log("✅ playerRef está definido, llamando a playHitAnimation()");
            playerRef.current.playHitAnimation(); // Llama la animación de golpe
          }
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

  // Función de alerta personalizada para el checkpoint
  const checkpointAlert = (message, severity) => {
    if (severity === "success") {
      showAlert("Punto de autoguardado alcanzado", "success");
    } else {
      showAlert(message, severity);
    }
  };

  // Función para manejar el checkpoint automático
  const handleCheckpointReached = (checkpointId) => {
    if (user && playerRef.current) {
      // Muestra alerta de guardado antes de iniciar el proceso
      showAlert("Guardando... No cierres la pestaña", "info");

      const currentPosition = playerRef.current.getCurrentPosition();
      saveGameProgress(
        user.username,
        {
          position: {
            x: currentPosition[0],
            y: currentPosition[1],
            z: currentPosition[2],
          },
          health: health,
          checkpoint: checkpointId,
        },
        checkpointAlert // Se utiliza la alerta personalizada
      );
      console.log("Checkpoint automático guardado:", checkpointId);
    }
  };

  // Función que se ejecuta cuando el jugador recoge una herramienta
  const handleToolPickup = () => {
    playPickup();
    setEquippedTool("/textures/weapon.svg");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Interfaz de usuario */}
      <AmbientSound isPaused={isPaused} isDead={isDead}/>
      {!isPaused && !isDead && (
        <GameUI
          health={health}
          onPause={() => setIsPaused(true)}
          objective={objective}
          equippedTool={equippedTool}
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
          <Perf position="bottom-right" />
          <Sky
            distance={10000}
            turbidity={10} // Aumenta la turbidez para dar sensación de nubes
            rayleigh={1} // Disminuye o ajusta rayleigh para menos claridad en el cielo
            inclination={0} // Ajusta la inclinación según convenga
            azimuth={0.25}
          />
          <Rain count={10000} areaSize={200} fallSpeed={10} />

          <Physics paused={isPaused} debug>
            <Village2 isPaused={isPaused} position={[10, -10, 0]} scale={5}/>
            <PlayerController
              ref={playerRef}
              isPaused={isPaused}
              initialPosition={playerPosition}
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
            <Tools position={[-20, -3, -10]} onPickUp={handleToolPickup} />
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
            backgroundColor:
              alert.severity === "success" || alert.severity === "info"
                ? "#FFA500"
                : "",
            color:
              alert.severity === "success" || alert.severity === "info"
                ? "black"
                : "",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GameWorld;
