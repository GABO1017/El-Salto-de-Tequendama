import React, { useRef, useEffect, useState } from "react";
import { Slider, IconButton, Box } from "@mui/material";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeOff from "@mui/icons-material/VolumeOff";
import ambientSound from "../../assets/audio/Música Regional Muisca.mp3";

const AmbientMusic = () => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.01); // Volumen inicial
  const [showSlider, setShowSlider] = useState(false); // Mostrar/ocultar slider

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  // Selección de icono según el volumen
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeOff sx={{ color: "#FFD700" }} />;
    if (volume > 0 && volume <= 0.5)
      return <VolumeDown sx={{ color: "#FFD700" }} />;
    return <VolumeUp sx={{ color: "#FFD700" }} />;
  };

  return (
    <div>
      <audio ref={audioRef} autoPlay loop>
        <source src={ambientSound} type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>

      {/* Contenedor flotante */}
      <Box
        sx={{
          position: "fixed",
          zIndex: 100,
          bottom: "20px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "rgba(0, 0, 0, 0.4)",
          padding: "8px",
          borderRadius: "8px",
          transition: "all 0.5s ease",
          "&:hover": {
            gap: 2, // Espacio extra al hacer hover
          },
        }}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {/* Botón de volumen con el icono dinámico */}
        <IconButton>{getVolumeIcon()}</IconButton>

        {/* Slider visible solo al hacer hover */}
        {showSlider && (
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{
              width: 150,
              color: "#FFD700",
              "& .MuiSlider-thumb": {
                bgcolor: "#FFD700",
                "&:hover": {
                  boxShadow: "0 0 0 8px rgba(255, 215, 0, 0.1)", // Aura al hacer hover
                },
                "&:focus, &:active": {
                  boxShadow: "0 0 0 8px rgba(255, 215, 0, 0.3)", // Aura al seleccionar
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.5,
              },
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default AmbientMusic;
