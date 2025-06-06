import React, { useState, useEffect, Suspense } from "react";
import { useProgress } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { Howler } from "howler";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import PlayerMasc from "../../scenes/GameWorld/characters/PlayerMasc";
import PlayerFem from "../../scenes/GameWorld/characters/PlayerFem";
import Loading from "../UI/Loading";
import "./../../styles/global.css";

const CharacterSelection = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setIsLoaded(true), 500); // pequeño retardo opcional
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  const selectCharacter = (character) => {
    localStorage.setItem("selectedCharacter", character);
    localStorage.setItem("isLoadingGame", "true"); // Agregar flag para carga

    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume().then(() => {
        localStorage.setItem("audioUnlocked", "true");
        navigate("/juego", { state: { fromSelection: true } });
      });
    } else {
      localStorage.setItem("audioUnlocked", "true");
      navigate("/juego", { state: { fromSelection: true } });
    }
  };

  if (!isLoaded) return <Loading />;

  return (
    <div className="character-selection-body">
      <div className="character-selection-container">
        <h1 className="character-selection-text">Selecciona tu personaje</h1>
        <div className="character-cards">
          {/* Card de Sue */}
          <Card sx={{ width: 200, backgroundColor: "#212121", color: "white" }}>
            <CardActionArea onClick={() => selectCharacter("Sue")}>
              <div style={{ width: "100%", aspectRatio: "3 / 5" }}>
                <Suspense fallback={null}>
                  <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[1, 2, 3]} />
                    <PlayerMasc
                      animation="Stading"
                      scale={0.7}
                      position={[0, -1.2, 0]}
                    />
                  </Canvas>
                </Suspense>
              </div>
              <CardContent>
                <Typography variant="h6" align="center">
                  Sue (Masculino)
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Card de Chía */}
          <Card sx={{ width: 200, backgroundColor: "#212121", color: "white" }}>
            <CardActionArea onClick={() => selectCharacter("Chia")}>
              <div style={{ width: "100%", aspectRatio: "3 / 5" }}>
                <Suspense fallback={null}>
                  <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[1, 2, 3]} />
                    <PlayerFem
                      animation="Idel"
                      scale={0.7}
                      position={[0, -1.2, 0]}
                    />
                  </Canvas>
                </Suspense>
              </div>
              <CardContent>
                <Typography variant="h6" align="center">
                  Chía (Femenino)
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;
