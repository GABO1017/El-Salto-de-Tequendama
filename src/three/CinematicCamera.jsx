import React, { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { Html } from "@react-three/drei";

const steps = [
  {
    // Toma aérea de la aldea
    duration: 14, //14
    from: {
      position: new Vector3(30, 70, 50),
      target: new Vector3(0, 0, 0),
    },
    to: {
      position: new Vector3(20, 40, 50),
      target: new Vector3(0, 0, 0),
    },
    audio: "/sounds/Escena 1.mp3",
    onStart: () => {
      console.log("Toma aérea iniciada");
    },
    onComplete: () => {
      console.log("Finalizó toma aérea");
    },
  },
  {
    // Cinemática de la inundación, recorriendo distintas áreas
    // Cinematica de la tormenta
    duration: 15, //15
    from: {
      position: new Vector3(20, 40, 50),
      target: new Vector3(0, 30, 0),
    },
    to: {
      position: new Vector3(20, 40, -20),
      target: new Vector3(-20, 30, -20),
    },
    audio: "/sounds/Escena 2.mp3",
    onStart: () => {
      console.log("Movimiento por el mundo iniciado");
    },
    onComplete: () => {
      console.log("Movimiento completado");
    },
  },
  {
    // Cinemática de la inundación, recorriendo distintas áreas
    duration: 18, //18
    from: {
      position: new Vector3(20, 150, -175),
      target: new Vector3(25, 0, 15),
    },
    to: {
      position: new Vector3(25, 100, -140),
      target: new Vector3(25, 0, 15),
    },
    audio: "/sounds/Escena 3.mp3",
    onStart: () => {
      console.log("Enfocando la choza principal");
    },
    onComplete: () => {
      console.log("Choza enfocada y audio reproducido");
    },
  },
  {
    // Enfocar la choza principal y reproduce sabio 1
    duration: 13, //13
    from: {
      position: new Vector3(-50, 1.6, 8),
      target: new Vector3(-65, 1.6, 8),
    },
    to: {
      position: new Vector3(-58, 1.6, 8),
      target: new Vector3(-65, 1.6, 8),
    },
    audio: "/sounds/Escena 4 - Sabio 1.mp3",
    onStart: () => {
      console.log("Cámara acercándose al personaje");
    },
    onComplete: () => {
      console.log("Diálogos terminados");
    },
  },
  {
    // Sabio 2
    duration: 18, //18
    from: {
      position: new Vector3(-57, 1.6, 6),
      target: new Vector3(-65, 1.6, 6),
    },
    to: {
      position: new Vector3(-59, 1.6, 6),
      target: new Vector3(-65, 1.6, 6),
    },
    audio: "/sounds/Escena 4 - Sabio 2.mp3",
    onStart: () => {
      console.log("Mostrando todo el mundo inundado");
    },
    onComplete: () => {
      console.log("Cinemática finalizada");
    },
  },
  {
    // Sabio 3
    duration: 11, //11
    from: {
      position: new Vector3(-57, 1.6, 10),
      target: new Vector3(-65, 1.6, 10),
    },
    to: {
      position: new Vector3(-59, 1.6, 10),
      target: new Vector3(-65, 1.6, 10),
    },
    audio: "/sounds/Escena 4 - Sabio 3.mp3",
    onStart: () => {
      console.log("Mostrando todo el mundo inundado");
    },
    onComplete: () => {
      console.log("Cinemática finalizada");
    },
  },
  {
    // Aldeano
    duration: 9, //9
    from: {
      position: new Vector3(-65, 1.6, 8),
      target: new Vector3(-45, 1.6, 8),
    },
    to: {
      position: new Vector3(-58, 1.6, 8),
      target: new Vector3(-45, 1.6, 8),
    },
    audio: "/sounds/Escena 4 - Aldeano.mp3",
    onStart: () => {
      console.log("Mostrando todo el mundo inundado");
    },
    onComplete: () => {
      console.log("Cinemática finalizada");
    },
  },
  {
    // Sabio 3 Despedida 
    duration: 8 ,//8
    from: {
      position: new Vector3(-47, 1.6, 10),
      target: new Vector3(-50, 1.6, 10),
    },
    to: {
      position: new Vector3(-46, 1.6, 10),
      target: new Vector3(-50, 1.6, 10),
    },
    audio: "/sounds/Escena 5 - Sabio 3.mp3",
    onStart: () => {
      console.log("Mostrando todo el mundo inundado");
    },
    onComplete: () => {
      console.log("Cinemática finalizada");
    },
  },
  {
    // Sabio 2 Despedida 
    duration: 11 ,//11
    from: {
      position: new Vector3(-47, 1.6, 6),
      target: new Vector3(-50, 1.6, 6),
    },
    to: {
      position: new Vector3(-46, 1.6, 6),
      target: new Vector3(-50, 1.6, 6),
    },
    audio: "/sounds/Escena 5 - Sabio 2.mp3",
    onStart: () => {
      console.log("Mostrando todo el mundo inundado");
    },
    onComplete: () => {
      console.log("Cinemática finalizada");
    },
  },
  {
    // Aldeano Despedida 
    duration: 10 ,//10
    from: {
      position: new Vector3(-60, 1.6, 8),
      target: new Vector3(-43, 1.6, 8),
    },
    to: {
      position: new Vector3(-55, 1.6, 8),
      target: new Vector3(-43, 1.6, 8),
    },
    audio: "/sounds/Escena 5 - Aldeano.mp3",
    onStart: () => {
      console.log("Mostrando todo el mundo inundado");
    },
    onComplete: () => {
      console.log("Cinemática finalizada");
    },
  },
  {
    // Ultima cinematica alejandose
    duration: 14 ,//14
    from: {
      position: new Vector3(-55, 1.6, 8),
      target: new Vector3(-43, 1.6, 8),
    },
    to: {
      position: new Vector3(-55, 100, 8),
      target: new Vector3(-43, 1.6, 8),
    },
    audio: "/sounds/Escena 5.mp3",
    onStart: () => {
      console.log("Mostrando todo el mundo inundado");
    },
    onComplete: () => {
      console.log("Cinemática finalizada");
    },
  },
];

const CinematicCamera = ({ onFinish }) => {
  const { camera } = useThree();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const elapsedRef = useRef(0);
  const currentStep = steps[currentStepIndex];

  // Estado que indica que ya estamos en el cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    elapsedRef.current = 0;
    if (currentStep?.onStart) {
      currentStep.onStart();
    }
  }, [currentStepIndex, currentStep]);

  useFrame((state, delta) => {
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
      if (currentStep.onComplete) currentStep.onComplete();
      // Si no hay más etapas, avisamos que terminó la cinemática
      if (currentStepIndex === steps.length - 1) {
        if (onFinish) onFinish();
      } else {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  });

  // Solo renderizamos contenido relacionado con <audio> en el cliente.
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

export default CinematicCamera;
