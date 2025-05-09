import React, { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { Html } from "@react-three/drei";

const rawSteps = [
  // Escenas de la cinemática
  {
    duration: 15, //15
    from: {
      position: new Vector3(265, 47, -245),
      target: new Vector3(259, 47, -245),
    },
    to: {
      position: new Vector3(257, 47, -241),
      target: new Vector3(259, 47, -245),
    },
    audio: "/sounds/Escena Final - Bochica 1.mp3",
    subtitle:
      "Hijo del agua y la tierra, tu coraje ha resonado en los vientos de los antiguos. Chibchacum no busca venganza, sino equilibrio",
  },
  {
    duration: 21, //21
    from: {
      position: new Vector3(259, 47, -236),
      target: new Vector3(259, 47, -245),
    },
    to: {
      position: new Vector3(259, 47, -242),
      target: new Vector3(259, 47, -245),
    },
    audio: "/sounds/Escena Final - Bochica 2.mp3",
    subtitle:
      "Hoy, por tu fe y determinación, liberaré las aguas… pero recuerda: el verdadero cambio no se impone con fuerza, sino que nace del corazón de un pueblo que aprende a respetar la vida que lo rodea.",
  },
  {
    duration: 25, //21
    from: {
      position: new Vector3(259, 60, -249),
      target: new Vector3(0, 30, 0),
    },
    to: {
      position: new Vector3(0, 50, 0),
      target: new Vector3(0, 30, 0),
    },
    audio: "/sounds/Escena Final.mp3",
    subtitle:
      "Y así, con un gesto ancestral, las aguas comienzan a retirarse, como si la tierra misma respirara aliviada. Pero más allá de la tormenta, queda una lección grabada en el espíritu del pueblo: que el equilibrio con la naturaleza es el verdadero camino hacia la paz.",
  },
];

const CinematicEnding = ({
  onFinish,
  setSubtitles,
  setIsRaining,
  setWaterY,
}) => {
  const { camera } = useThree();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const elapsedRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const isChia = localStorage.getItem("selectedCharacter") === "Chia";

  const steps = rawSteps.map((step) => {
    const audio = step.audio;

    return {
      ...step,
      audio,
      onStart: () => {
        setSubtitles?.(step.subtitle);
      },
    };
  });

  const currentStep = steps[currentStepIndex];
  useEffect(() => {
    setMounted(true);

    // Ejecutar subtítulo del primer paso al montar
    if (steps.length > 0 && typeof setSubtitles === "function") {
      setSubtitles(steps[0].subtitle);
    }
  }, []);

  useEffect(() => {
    elapsedRef.current = 0;

    if (currentStepIndex === steps.length - 1) {
      // Desactivar lluvia gradualmente
      setTimeout(() => setIsRaining(false), 10000);

      // Subir nivel del agua lentamente
      let y = -1.2;
      const interval = setInterval(() => {
        y -= 0.1; // ↓ ahora baja el agua
        setWaterY(y);
        if (y <= -20) clearInterval(interval); // el agua deja de bajar al llegar a -20
      }, 50);
    }
    if (currentStepIndex > 0 && typeof setSubtitles === "function") {
      setSubtitles(steps[currentStepIndex].subtitle);
    }
  }, [currentStepIndex]);

  useFrame((_, delta) => {
    if (!currentStep) return;
    elapsedRef.current += delta;
    const progress = Math.min(elapsedRef.current / currentStep.duration, 1);

    const newPos = new Vector3()
      .copy(currentStep.from.position)
      .lerp(currentStep.to.position, progress);
    camera.position.copy(newPos);

    const target = new Vector3()
      .copy(currentStep.from.target)
      .lerp(currentStep.to.target, progress);
    camera.lookAt(target);

    if (progress >= 1) {
      currentStep.onComplete?.();

      const nextIndex = currentStepIndex + 1;

      if (nextIndex < steps.length) {
        setCurrentStepIndex(nextIndex);
        setSubtitles(steps[nextIndex].subtitle); // ← muestra siguiente subtítulo justo al avanzar
      } else {
        setSubtitles(""); // ← solo se borra al final de todo
        onFinish?.();
      }
    }
  });

  useEffect(() => {
    const handleSkip = (e) => {
      if (e.key === "Escape" || e.key === "Enter") {
        setSubtitles("");
        onFinish?.();
      }
    };

    window.addEventListener("keydown", handleSkip);
    return () => window.removeEventListener("keydown", handleSkip);
  }, []);

  return (
    <Html style={{ display: "none" }}>
      {mounted && currentStep?.audio && (
        <audio
          key={currentStepIndex}
          src={currentStep.audio}
          autoPlay
          preload="auto"
        />
      )}
    </Html>
  );
};

export default CinematicEnding;
