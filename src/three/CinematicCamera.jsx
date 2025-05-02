import React, { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { Html } from "@react-three/drei";

const rawSteps = [
  // Escenas de la cinemática
  {
    label: "Toma aérea de la aldea",
    duration: 15, //15
    from: { position: new Vector3(30, 70, 50), target: new Vector3(0, 0, 0) },
    to: { position: new Vector3(20, 40, 50), target: new Vector3(0, 0, 0) },
    audio: "/sounds/Escena 1.mp3",
    subtitle:
      "En lo profundo del valle, se extiende una aldea donde la vida transcurre en armonía, custodiada por las antiguas creencias y la protección de los dioses.",
  },
  {
    label: "Cinemática de la tormenta",
    duration: 15, //15
    from: { position: new Vector3(20, 40, 50), target: new Vector3(0, 30, 0) },
    to: {
      position: new Vector3(20, 40, -20),
      target: new Vector3(-20, 30, -20),
    },
    audio: "/sounds/Escena 2.mp3",
    subtitle:
      "Pero la paz se ve rota en un instante. Una tormenta implacable desata su furia, y los ríos, antes serenos, se convierten en torrentes destructores.",
  },
  {
    label: "Inundación recorriendo zonas",
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
    subtitle:
      "El agua arrasa con lo sembrado y lo construido, dejando a la comunidad sumida en el desconcierto. Los murmullos de una antigua ofensa se hacen realidad: han desatado la ira de Chibchacum, el dios protector.",
  },
  {
    label: "Sabio Parte 1",
    duration: 13, //13
    from: {
      position: new Vector3(-57, 1.1, 8),
      target: new Vector3(-65, 1.1, 8),
    },
    to: {
      position: new Vector3(-62, 1.1, 8),
      target: new Vector3(-65, 1.1, 8),
    },
    audio: "/sounds/Escena 4 - Sabio 1.mp3",
    subtitle:
      "La furia de Chibchacum no es caprichosa. Nuestro pueblo ha olvidado el respeto a los antiguos rituales.",
  },
  {
    label: "Sabio Parte 2",
    duration: 18, //18
    from: {
      position: new Vector3(-57, 1.1, 6),
      target: new Vector3(-65, 1.1, 6),
    },
    to: {
      position: new Vector3(-62, 1.1, 6),
      target: new Vector3(-65, 1.1, 6),
    },
    audio: "/sounds/Escena 4 - Sabio 2.mp3",
    subtitle:
      "El desequilibrio se ha instalado en la tierra. Solo hay un camino para apaciguar la ira del dios: encontrar a Bochica, el sabio ancestral, y pedirle que libere las aguas.",
  },
  {
    label: "Sabio Parte 3",
    duration: 11, //11
    from: {
      position: new Vector3(-57, 1.1, 10),
      target: new Vector3(-65, 1.1, 10),
    },
    to: {
      position: new Vector3(-62, 1.1, 10),
      target: new Vector3(-65, 1.1, 10),
    },
    audio: "/sounds/Escena 4 - Sabio 3.mp3",
    subtitle:
      "La montaña sagrada es el refugio de Bochica. Quien logre llegar allí, podrá restaurar la armonía perdida.",
  },
  {
    label: "Aldeano o Aldeana",
    duration: 9, //9
    from: {
      position: new Vector3(-50, 1.1, 8),
      target: new Vector3(-45, 1.1, 8),
    },
    to: {
      position: new Vector3(-47, 1.1, 8),
      target: new Vector3(-45, 1.1, 8),
    },
    audio: "CHIA_DEPENDENT_4",
    subtitle:
      "Si es mi destino salvar a mi pueblo, entonces debo emprender este peligroso viaje.",
  },
  {
    label: "Sabio 3 Despedida",
    duration: 8, //8
    from: {
      position: new Vector3(-47, 1.1, 10),
      target: new Vector3(-50, 1.1, 10),
    },
    to: {
      position: new Vector3(-46, 1.1, 10),
      target: new Vector3(-50, 1.1, 10),
    },
    audio: "/sounds/Escena 5 - Sabio 3.mp3",
    subtitle:
      "Que la sabiduría de nuestros antepasados te guíe en el camino, hijo de la aldea.",
  },
  {
    label: "Sabio 2 Despedida",
    duration: 11, //11
    from: {
      position: new Vector3(-47, 1.1, 6),
      target: new Vector3(-50, 1.1, 6),
    },
    to: {
      position: new Vector3(-46, 1.1, 6),
      target: new Vector3(-50, 1.1, 6),
    },
    audio: "/sounds/Escena 5 - Sabio 2.mp3",
    subtitle:
      "Recuerda: cada paso que des es un voto por la esperanza y la renovación. No estás solo.",
  },
  {
    label: "Despedida Aldeano o Aldeana",
    duration: 10, //10
    from: {
      position: new Vector3(-50, 1.1, 8),
      target: new Vector3(-43, 1.1, 8),
    },
    to: {
      position: new Vector3(-47, 1.1, 8),
      target: new Vector3(-43, 1.1, 8),
    },
    audio: "CHIA_DEPENDENT_5",
    subtitle:
      "No defraudaré a mi gente. Llevaré en mi corazón la fe y el coraje necesarios para enfrentar la adversidad.",
  },
  {
    label: "Cierre alejándose",
    duration: 14, //14
    from: {
      position: new Vector3(-55, 1.1, 8),
      target: new Vector3(-43, 1.1, 8),
    },
    to: {
      position: new Vector3(-55, 100, 8),
      target: new Vector3(-43, 1.1, 8),
    },
    audio: "/sounds/Escena 5.mp3",
    subtitle:
      "Con su destino marcado y el peso de la responsabilidad en sus hombros, el joven aldeano abandona la seguridad de la aldea, dando inicio a la travesía que determinará el futuro de su pueblo.",
  },
];

const CinematicCamera = ({
  onFinish,
  setSubtitles,
  setWisePositions,
  setWiseAnimations,
  setPlayerRotation,
}) => {
  const { camera } = useThree();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const elapsedRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const isChia = localStorage.getItem("selectedCharacter") === "Chia";

  const steps = rawSteps.map((step) => {
    const audio =
      step.audio === "CHIA_DEPENDENT_4"
        ? isChia
          ? "/sounds/Escena 4 - Aldeana.mp3"
          : "/sounds/Escena 4 - Aldeano.mp3"
        : step.audio === "CHIA_DEPENDENT_5"
        ? isChia
          ? "/sounds/Escena 5 - Aldeana.mp3"
          : "/sounds/Escena 5 - Aldeano.mp3"
        : step.audio;

    return {
      ...step,
      audio,
      onStart: () => {
        setSubtitles?.(step.subtitle || "");

        if (step.label === "Aldeano o Aldeana") {
          setWisePositions?.([
            [-50, 2.2, 8], // sabio 1
            [-50, 2.2, 6], // sabio 2
            [-50, 2.2, 10], // sabio 3
          ]);
        }
        // 🔁 Animaciones por escena
        switch (step.label) {
          case "Sabio Parte 1":
            setWiseAnimations?.(["Talk2", "Idle2", "Idle2"]);
            break;
          case "Sabio Parte 2":
            setWiseAnimations?.(["Idle1", "Talk1", "Idle2"]);
            break;
          case "Sabio Parte 3":
            setWiseAnimations?.(["Idle1", "Idle2", "Talk1"]);
            break;
          case "Sabio 3 Despedida":
            setWiseAnimations?.(["Idle1", "Idle2", "Talk1"]);
            break;
          case "Sabio 2 Despedida":
            setWiseAnimations?.(["Idle1", "Talk1", "Idle2"]);
            break;
          case "Cierre alejándose":
            setPlayerRotation?.([0, 0, 0]);
            break;
          default:
            setWiseAnimations?.(["Idle1", "Idle2", "Idle2"]);
            break;
        }
      },
    };
  });

  const currentStep = steps[currentStepIndex];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    elapsedRef.current = 0;
    currentStep?.onStart?.();
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
      if (currentStepIndex === steps.length - 1) {
        setSubtitles("");
        onFinish?.();
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }
  });

  useEffect(() => {
    const handleSkip = (e) => {
      if (e.key === "Escape" || e.key === "Enter") {
        setSubtitles("");
        onFinish?.();
        setPlayerRotation?.([0, 0, 0]);
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

export default CinematicCamera;
