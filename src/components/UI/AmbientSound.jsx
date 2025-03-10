import React, { useRef, useEffect } from "react";

const AmbientSound = ({ isPaused, isDead }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPaused || isDead) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch((err) =>
          console.error("Error al reproducir sonido ambiental:", err)
        );
      }
    }
  }, [isPaused]);

  return (
    <audio
      ref={audioRef}
      src="/sounds/rain_storm.mp3"  // Ajusta la ruta a tu sonido
      loop
      autoPlay
      preload="auto"
    />
  );
};

export default AmbientSound;
