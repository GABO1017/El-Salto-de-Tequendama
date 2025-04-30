import React, { useRef, useState, useEffect, Suspense } from "react";
import { KeyboardControls, useProgress, useGLTF } from "@react-three/drei";
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
import CinematicEnding from "../../three/CinematicEnding";
import Enemy from "../GameWorld/characters/enemies/Enemy";
import NormalVillagerM from "../GameWorld/characters/npc/NormalVillagerM";
import NormalVillagerF from "../GameWorld/characters/npc/NormalVillagerF";
import WiseVillager1 from "../GameWorld/characters/npc/WiseVillager1";
import WiseVillager2 from "../GameWorld/characters/npc/WiseVillager2";
import Bochica from "../GameWorld/characters/npc/Bochica";
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

// Precarga de modelos críticos
const modelPaths = [
  "/models/villagerM.glb",
  "/models/villagerF.glb",
  "/models/playerMasc.glb",
  "/models/playerFem.glb",
  // Agrega más modelos según sea necesario
];

// Precargar modelos fuera del ciclo de renderizado
modelPaths.forEach((path) => {
  useGLTF.preload(path);
});

const GameWorld = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isPaused, setIsPaused] = useState(false);
  const { progress } = useProgress();
  const [forcedLoading, setForcedLoading] = useState(false);
  // Comprueba si viene de selección de personaje
  // Verificar si viene de selección de personaje
  const isFromSelection =
    location.state?.fromSelection ||
    localStorage.getItem("isLoadingGame") === "true";
  const isCanvasReady = progress === 100;
  const [isCinematicStarted, setIsCinematicStarted] = useState(false);
  const playerRef = useRef();
  const enemyRefs = useRef([]);
  const enemyPositions = [
    [180, -3, -115],
    [135, -3, -110],
    [127, -4, -145],
    [120, -4, -165],
  ];

  const villagerMRefs = useRef([]);
  const villagerMPositions = [
    [20, 10, 0],
    [-10, 10, 40],
    [0, 10, 0],
    [-50, 10, 30],
    [75, 10, -10],
    [30, 10, 50],
    [25, 10, -50],
    [45, 10, 8],
    [-30, 10, -18],
    [-15, 10, -85],
    [-5, 10, -75],
    [-10, 10, -90],
  ];

  const villagerFRefs = useRef([]);
  const villagerFPositions = [
    [-20, 10, 0],
    [-10, 10, 20],
    [-35, 10, 20],
    [-55, 10, -15],
    [-18, 10, 32],
    [-30, 10, 5],
    [-42, 10, -17],
    [-12, 10, 38],
    [-25, 10, -60],
    [5, 10, -40],
    [-5, 10, -5],
    [-5, 10, -54],
  ];

  const [playerPosition, setPlayerPosition] = useState([259, 47, -248]); // Posición inicial por defecto -43 0.6 8
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
  const [objective, setObjective] = useState(
    "Habla con los aldeanos para conseguir una pista"
  ); // Objetivo inicial
  const [subtitles, setSubtitles] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
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
  const [isEndingActive, setEndingActive] = useState(false);

  const [isRaining, setIsRaining] = useState(true);
  const [skyConfig, setSkyConfig] = useState({
    turbidity: 10,
    rayleigh: 1,
  });
  const [waterY, setWaterY] = useState(-14.5); // posición inicial
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

    if (cinematicActive || isEndingActive === true) {
      window.addEventListener("keydown", blockKeyEvents, true);
    } else {
      window.removeEventListener("keydown", blockKeyEvents, true);
    }

    // Cleanup para asegurarse que se elimine al desmontar o cambiar el estado
    return () => window.removeEventListener("keydown", blockKeyEvents, true);
  }, [cinematicActive, isEndingActive]);

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
          setPlayerRotation([0, 0, 0]);

          // Cargar el personaje desde Firestore
          if (progress.character) {
            localStorage.setItem("selectedCharacter", progress.character);
          }

          // Controlar la reproducción de la cinemática
          if (progress.isNewGame) {
            setCinematicActive(true);
          } else {
            setCinematicActive(false);
          }

          showAlert("Partida cargada exitosamente", "success");
        }
      });
    } else if (user) {
      resetGameProgress(user.username, showAlert);
    }
    setIsLoading(false); // Cambia el estado de carga a falso después de cargar la partida
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
        if (newHealth === 0) {
          playDeath(); // Reproduce el sonido de muerte
          playerRef.current.playDeathAnimation();
          setIsDead(true); // Marca al jugador como muerto
          setIsPaused(true); // Pausa el juego
        } else {
          // Si la salud sigue por encima de 0, reproducir el sonido de daño
          playDamage();
          if (playerRef.current) {
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

  // Efecto para manejar la precarga
  // Efecto para simular tiempo de carga cuando viene de selección
  useEffect(() => {
    if (isFromSelection) {
      setForcedLoading(true);
      const timer = setTimeout(() => {
        setForcedLoading(false);
        localStorage.removeItem("isLoadingGame");
      }, 3000); // Asegura tiempo para la carga de modelos

      return () => clearTimeout(timer);
    }
  }, [isFromSelection]);

  const isLoading2 = progress !== 100 || forcedLoading || isLoading;

  if (isLoading2) {
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
          isEndingActive={isEndingActive}
          subtitles={subtitles}
        />
      )}

      {/* Menús de pausa y muerte */}
      {isPaused && !isDead && (
        <PauseMenu
          onResume={handleResume}
          onMainMenu={handleMainMenu}
          onSave={handleSaveGame}
          objective={objective}
        />
      )}
      {isDead && (
        <Dead onContinue={handleContinue} onMainMenu={handleMainMenu} />
      )}

      {/* Juego */}
      <KeyboardControls map={keyboardMap}>
        <Canvas
          style={{ width: "100%", height: "100%", backgroundColor: "#87CEEB" }}
          camera={{ position: [0, 5, 15], fov: 75 }}
          shadows
          gl={{ localClippingEnabled: true }}
        >
          <Suspense fallback={null}>
            <Perf position="bottom-right" />
            {isRaining && (
              <Sky
                {...skyConfig}
                distance={10000}
                inclination={0}
                azimuth={0.25}
              />
            )}

            {!isPaused && !isDead && isRaining && (
              <Rain count={10000} areaSize={200} fallSpeed={10} />
            )}

            <Physics paused={isPaused} debug>
              <Village isPaused={isPaused} position={[10, -120, 0]} scale={5} />
              <Water position={[0, waterY, 20]} targetY={-1.2} />
              <PlayerController
                ref={playerRef}
                isPaused={isPaused}
                initialPosition={playerPosition}
                characterSelection={selectedCharacter}
                equippedTool={equippedTool}
                rotation={playerRotation}
                enemyRefs={enemyRefs}
              />

              {villagerFPositions.map((pos, index) => (
                <NormalVillagerF
                  key={index}
                  ref={(el) => {
                    if (el) villagerFRefs.current[index] = el;
                  }}
                  position={pos}
                  animation="Idle3"
                  playerRef={playerRef}
                  isPaused={isPaused}
                  setSubtitles={setSubtitles}
                  setObjective={setObjective}
                />
              ))}

              {villagerMPositions.map((pos, index) => (
                <NormalVillagerM
                  key={index}
                  ref={(el) => {
                    if (el) villagerMRefs.current[index] = el;
                  }}
                  position={pos}
                  animation="Idle1"
                  playerRef={playerRef}
                  isPaused={isPaused}
                  setSubtitles={setSubtitles}
                  setObjective={setObjective}
                />
              ))}

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
              {enemyPositions.map((pos, index) => (
                <Enemy
                  key={index}
                  ref={(el) => {
                    if (el) enemyRefs.current[index] = el;
                  }}
                  position={pos}
                  animation="Idle"
                  playerRef={playerRef}
                  isPaused={isPaused} // Pasar el estado de pausa
                  isDead={isDead} // Pasar el estado de muerte
                  setObjective={setObjective}
                  onPlayerCollide={(other) =>
                    handlePlayerCollision(other, index)
                  }
                />
              ))}

              <Bochica
                position={[259, 49, -245]} // Posición de Bochica
                animation="Idle"
                setSubtitles={setSubtitles}
                startCinematicEnding={() => setEndingActive(true)}
              />

              <Checkpoint
                position={[60, 5, -97]}
                checkpointId="1"
                onCheckpoint={handleCheckpointReached}
              />
              <Tools position={[-15, 20, -93]} onPickUp={handleToolPickup} />
            </Physics>
            <ambientLight intensity={1.5} />
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
            {isEndingActive && (
              <CinematicEnding
                setSubtitles={setSubtitles}
                onFinish={() => setEndingActive(false)}
                setIsRaining={setIsRaining}
                setWaterY={setWaterY}
                setSkyConfig={setSkyConfig}
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
