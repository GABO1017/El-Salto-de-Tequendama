import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import PlayerMasc from "../../scenes/GameWorld/characters/PlayerMasc";
import PlayerFem from "../../scenes/GameWorld/characters/PlayerFem";
import "./../../styles/global.css";

const CharacterSelection = () => {
  const navigate = useNavigate();

  const selectCharacter = (character) => {
    localStorage.setItem("selectedCharacter", character); // Guardar elección
    navigate("/juego"); // Navegar al GameWorld
  };

  return (
    <div className="character-selection-body">
      <div className="character-selection-container">
        <h1 className="character-selection-text">Selecciona tu personaje</h1>
        <div className="character-cards">
          {/* Card de Sue */}
          <Card sx={{ width: 250, backgroundColor: "#212121", color: "white" }}>
            <CardActionArea onClick={() => selectCharacter("Sue")}>
              <div style={{ width: "100%", height: 500 }}>
                <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[1, 2, 3]} />
                  <PlayerMasc animation="Stading" scale={0.8} position={[0, -1.5, 0]}  />
                </Canvas>
              </div>
              <CardContent>
                <Typography variant="h6" align="center">
                  Sue (Masculino)
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Card de Chía */}
          <Card sx={{ width: 250, backgroundColor: "#212121", color: "white" }}>
            <CardActionArea onClick={() => selectCharacter("Chia")}>
              <div style={{ width: "100%", height: 500 }}>
                <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[1, 2, 3]} />
                  <PlayerFem animation="Idel" scale={0.8} position={[0, -1.5, 0]} />
                </Canvas>
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
