import React, { useRef, useState, useEffect, Suspense } from "react";
import { KeyboardControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Village from "../GameWorld/environment/Village";
import PauseMenu from "../../components/UI/PauseMenu";
import Dead from "../../components/UI/Dead";
import GameUI from "../../components/UI/GameUI";
import Loading from "../../components/UI/Loading";
import AmbientSound from "../../components/UI/AmbientSound";
import PlayerController from "../../three/PlayerController";
import Checkpoint from "../../three/Checkpoint";
import Rain from "../../three/Rain";
import Water from "../../three/Water";
import CinematicCamera from "../../three/CinematicCamera";
import Enemy from "../GameWorld/characters/enemies/Enemy";
import NormalVillagerM from "../GameWorld/characters/npc/NormalVillagerM";
import NormalVillagerF from "../GameWorld/characters/npc/NormalVillagerF";
import WiseVillager1 from "../GameWorld/characters/npc/WiseVillager1";
import WiseVillager2 from "../GameWorld/characters/npc/WiseVillager2";
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
  const progress = useProgress().progress;
  const isCanvasReady = progress === 100;
  const [isCinematicStarted, setIsCinematicStarted] = useState(false);
  const playerRef = useRef();
  const [playerPosition, setPlayerPosition] = useState([-43, 0.5, 8]); // Posición inicial por defecto
  const [playerRotation, setPlayerRotation] = useState([0, -90, 0]); // Rotación inicial por defecto
  const [wisePositions, setWisePositions] = useState([
    [-65, 2, 8], // Sabio 1
    [-65, 2, 6], // Sabio 2
    [-65, 2, 10], // Sabio 3
  ]);
  const [wiseAnimations, setWiseAnimations] = useState([
    "Idle1", // Sabio 1
    "Idle2", // Sabio 2
    "Idle2", // Sabio 3
  ]);
  const [health, setHealth] = useState(50);
  const [isDead, setIsDead] = useState(false);
  const [objective, setObjective] = useState("Habla con los aldeanos"); // Objetivo inicial
  const [subtitles, setSubtitles] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [equippedTool, setEquippedTool] = useState(null); // Estado para la herramienta equipada
  const navigate = useNavigate(); // Obtén el navigate
  const selectedCharacter = localStorage.getItem("selectedCharacter");
  const [playPickup] = useSound("/sounds/pickup.mp3", { volume: 0.5 });
  const deathSound =
    selectedCharacter === "Chia"
      ? "/sounds/death-woman.mp3"
      : "/sounds/death.mp3";
  const [playDeath] = useSound(deathSound, { volume: 0.2 });
  const damageSound =
    selectedCharacter === "Chia"
      ? "/sounds/damage-woman.mp3"
      : "/sounds/damage.mp3";
  const [playDamage] = useSound(damageSound, { volume: 0.3 });

  const [cinematicActive, setCinematicActive] = useState(true);
  // Por ejemplo, cuando termine la cinemática se actualiza el estado:
  const handleCinematicFinish = () => {
    setCinematicActive(false);
  };

  // Bloqueo global de teclas mientras la cinemática esté activa
  useEffect(() => {
    const blockKeyEvents = (e) => {
      // Lista de teclas a bloquear; se pueden ajustar según necesidad
      const keysToBlock = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d",
        "Escape",
        "Space",
        "Shift",
      ];
      if (keysToBlock.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (cinematicActive) {
      window.addEventListener("keydown", blockKeyEvents, true);
    } else {
      window.removeEventListener("keydown", blockKeyEvents, true);
    }

    // Cleanup para asegurarse que se elimine al desmontar o cambiar el estado
    return () => window.removeEventListener("keydown", blockKeyEvents, true);
  }, [cinematicActive]);

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

          // Cargar el personaje desde Firestore
          if (progress.character) {
            localStorage.setItem("selectedCharacter", progress.character);
          }

          showAlert("Partida cargada exitosamente", "success");
        }
      });
    } else if (user) {
      resetGameProgress(user.username, showAlert);
    }
    setIsLoading(false);
  }, [user, location.state]);

  const handleSaveGame = async () => {
    if (user && playerRef.current) {
      showAlert("Guardando... No cierres la pestaña", "info");

      const currentPosition = await playerRef.current.getCurrentPosition();

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
          character: selectedCharacter, // Guardamos el personaje elegido
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
            console.log(
              "✅ playerRef está definido, llamando a playHitAnimation()"
            );
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
      setObjective("Busca a los guardianes del bosque y enfrentate a ellos");
    }
  };

  // Función que se ejecuta cuando el jugador recoge una herramienta
  const handleToolPickup = () => {
    playPickup();
    setEquippedTool("/textures/weapon.svg");
    setObjective("Dirigete al bosque");
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Solo evita el menú contextual si el canvas fue clickeado
      if (e.target.tagName === "CANVAS") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    if (cinematicActive) {
      const timeout = setTimeout(() => {
        setIsCinematicStarted(true);
      }, 1000); // este tiempo depende de cuánto se demore en aparecer
      return () => clearTimeout(timeout);
    }
  }, [cinematicActive]);

  if (!isCanvasReady || !isCinematicStarted) {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Interfaz de usuario */}
      <AmbientSound isPaused={isPaused} isDead={isDead} />
      {!isPaused && !isDead && (
        <GameUI
          health={health}
          onPause={() => setIsPaused(true)}
          objective={objective}
          equippedTool={equippedTool}
          isCinematic={cinematicActive}
          subtitles={subtitles}
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
          gl={{ localClippingEnabled: true }}
        >
          <Suspense fallback={null}>
            <Perf position="bottom-right" />
            <Sky
              distance={10000}
              turbidity={10} // Aumenta la turbidez para dar sensación de nubes
              rayleigh={1} // Disminuye o ajusta rayleigh para menos claridad en el cielo
              inclination={0} // Ajusta la inclinación según convenga
              azimuth={0.25}
            />
            {!isPaused && !isDead && (
              <Rain count={10000} areaSize={200} fallSpeed={10} />
            )}

            <Physics paused={isPaused} debug>
              <Village isPaused={isPaused} position={[10, -120, 0]} scale={5} />
              <Water position={[0, -14.5, 20]} targetY={-1.2} />
              <PlayerController
                ref={playerRef}
                isPaused={isPaused}
                initialPosition={playerPosition}
                characterSelection={selectedCharacter}
                equippedTool={equippedTool}
                rotation={playerRotation}
              />

              <NormalVillagerF
                animation="Idle3"
                position={[-20, 40, 0]}
                playerRef={playerRef}
                setSubtitles={setSubtitles}
                setObjective={setObjective}
              />
              <NormalVillagerM
                animation="Idle1"
                position={[20, 40, 0]}
                playerRef={playerRef}
                setSubtitles={setSubtitles}
                setObjective={setObjective}
              />
              <WiseVillager1
                animation={wiseAnimations[0]}
                position={wisePositions[0]}
                rotation={[0, (Math.PI * 89.6) / 180, 0]}
              />
              <WiseVillager2
                animation={wiseAnimations[1]}
                position={wisePositions[1]}
                rotation={[0, (Math.PI * 89.3) / 180, 0]}
              />
              <WiseVillager2
                animation={wiseAnimations[2]}
                position={wisePositions[2]}
                rotation={[0, (Math.PI * 89.9) / 180, 0]}
              />
              <Enemy
                position={[157, 30, -115]}
                onPlayerCollide={handlePlayerCollision}
                animation="Breathing"
              />
              <Checkpoint
                position={[60, 5, -97]}
                checkpointId="1"
                onCheckpoint={handleCheckpointReached}
              />
              <Tools position={[-20, 20, -11]} onPickUp={handleToolPickup} />
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
            {cinematicActive && (
              <CinematicCamera
                onFinish={handleCinematicFinish}
                setSubtitles={setSubtitles}
                setWisePositions={setWisePositions}
                setWiseAnimations={setWiseAnimations}
                setPlayerRotation={setPlayerRotation}
              />
            )}
          </Suspense>
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
