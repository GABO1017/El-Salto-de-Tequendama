import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import Player from "../scenes/GameWorld/characters/Player";
// Importa useSound (asegúrate de instalarlo: npm install use-sound)
import useSound from "use-sound";

/** Normaliza un ángulo dentro del rango -π a π */
const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

/** Lerp entre dos ángulos evitando problemas de discontinuidad */
const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

const PlayerController = forwardRef(({ isPaused, initialPosition }, ref) => {
  // Controles y parámetros configurables
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, JUMP_FORCE } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 3.5, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 7.0, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(7),
        min: degToRad(0.1),
        max: degToRad(10),
        step: degToRad(0.1),
      },
      JUMP_FORCE: { value: 7.0, min: 0.2, max: 12, step: 0.1 },
    }
  );

  // Referencias a objetos y estados
  const rb = useRef();
  const inTheAir = useRef(false);
  const container = useRef();
  const character = useRef();
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const [animation, setAnimation] = useState("Idle");
  // Ref para bloquear la actualización de animación durante el ataque
  const attackLock = useRef(false);

  // Referencias de cámara
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());

  // Controles del teclado
  const [, get] = useKeyboardControls();

  // --- Integración de sonido ---

  const [playFootstep] = useSound("/sounds/footstep.mp3", { volume: 0.03 });
  const [playJump] = useSound("/sounds/jump.mp3", { volume: 0.9 });
  const [playAttack] = useSound("/sounds/attack.mp3", { volume: 0.4 });

  // Ref para controlar el cooldown entre pisadas (en milisegundos)
  const lastFootstepTime = useRef(0);

  /** Maneja la lógica de movimiento y rotación del personaje */
  const handleMovement = (vel) => {
    if (attackLock.current) {
      vel.x = 0;
      vel.z = 0;
      return vel;
    }
    let speed = get().run ? RUN_SPEED : WALK_SPEED;
    const movement = { x: 0, z: 0 };

    if (get().forward) movement.z = 1;
    if (get().backward) movement.z = -1;
    if (get().left) movement.x = 1;
    if (get().right) movement.x = -1;

    // Actualiza la rotación objetivo en función de la dirección
    if (movement.x !== 0) {
      rotationTarget.current += ROTATION_SPEED * movement.x;
    }

    if (movement.x !== 0 || movement.z !== 0) {
      characterRotationTarget.current = Math.atan2(movement.x, movement.z);
      vel.x =
        Math.sin(rotationTarget.current + characterRotationTarget.current) *
        speed;
      vel.z =
        Math.cos(rotationTarget.current + characterRotationTarget.current) *
        speed;

      // Solo actualizar la animación si no se está saltando ni atacando
      if (!inTheAir.current && !attackLock.current) {
        setAnimation(speed === RUN_SPEED ? "Running" : "Walking");
      }
    } else if (!inTheAir.current && !attackLock.current) {
      vel.x = 0;
      vel.z = 0;
      setAnimation("Idle");
    }

    // Interpolación suave de la rotación del personaje
    character.current.rotation.y = lerpAngle(
      character.current.rotation.y,
      characterRotationTarget.current,
      0.1
    );

    return vel;
  };

  /** Maneja la lógica de salto y selecciona la animación adecuada */
  const handleJump = (vel) => {
    if (get().jump && !inTheAir.current) {
      console.log("Jump");
      inTheAir.current = true;

      // Reproduce el sonido de salto
      playJump();

      // Obtener la velocidad actual y aplicar la fuerza de salto
      const curVel = rb.current.linvel();
      rb.current.setLinvel({ x: curVel.x, y: JUMP_FORCE, z: curVel.z }, true);

      // Si hay movimiento horizontal, asigna "Jumping", de lo contrario "JumpStading"
      if (Math.abs(vel.x) > 0.1 || Math.abs(vel.z) > 0.1) {
        setAnimation("Jumping");
      } else {
        setAnimation("JumpStading");
      }
    }
    return vel;
  };

  /** Maneja el ataque mediante click izquierdo */
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0 && !attackLock.current && !isPaused) {
        console.log("Attack iniciado");
        // Reproduce el sonido de ataque
        playAttack();
        attackLock.current = true;
        setAnimation("Attack2");
        setTimeout(() => {
          attackLock.current = false;
          if (!inTheAir.current) {
            setAnimation("Idle");
          }
        }, 1000);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [isPaused]);

  useFrame(({ camera }) => {
    if (isPaused) return;
    if (rb.current) {
      // Obtener la velocidad actual y aplicar la lógica de movimiento y salto
      let vel = rb.current.linvel();
      vel = handleMovement(vel);
      vel = handleJump(vel);

      // Mantener la velocidad en Y para respetar la gravedad
      const curVel = rb.current.linvel();
      vel.y = curVel.y;
      rb.current.setLinvel(vel, true);

      // --- Lógica para reproducir sonido de pisada ---
      const currentTime = performance.now();
      // Si el jugador está en tierra y la animación es Walking o Running
      if (
        !inTheAir.current &&
        (animation === "Walking" || animation === "Running")
      ) {
        // Calcula la velocidad horizontal (puedes ajustar el umbral según convenga)
        const horizontalSpeed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
        // Establece un intervalo entre pisadas: 500 ms para Walking, 300 ms para Running
        const interval = animation === "Running" ? 200 : 300;
        if (
          horizontalSpeed > 0.1 &&
          currentTime - lastFootstepTime.current > interval
        ) {
          console.log("Pisada");
          playFootstep();
          lastFootstepTime.current = currentTime;
        }
      }
    }

    // Lógica de la cámara
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });

  // Permite al componente padre acceder a la posición actual
  useImperativeHandle(ref, () => ({
    getCurrentPosition: () => {
      if (rb.current) {
        const pos = rb.current.translation();
        return [pos.x, pos.y, pos.z];
      }
      return initialPosition;
    },
  }));

  useEffect(() => {
    if (rb.current) {
      rb.current.setTranslation(
        {
          x: initialPosition[0],
          y: initialPosition[1],
          z: initialPosition[2],
        },
        true
      );
    }
  }, [initialPosition]);

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      gravityScale={1.5}
      position={initialPosition}
      name="player"
      onCollisionEnter={({ other }) => {
        console.log("Colisión con:", other.rigidBodyObject.name);
        if (other.rigidBodyObject.name === "village") {
          inTheAir.current = false;
          if (!attackLock.current) {
            const curVel = rb.current.linvel();
            setAnimation(
              Math.abs(curVel.x) > 4 || Math.abs(curVel.z) > 4
                ? "Running"
                : Math.abs(curVel.x) > 0.1 || Math.abs(curVel.z) > 0.1
                ? "Walking"
                : "Idle"
            );
          }
        }
      }}
    >
      <group ref={container}>
        {/* Cámara */}
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={5} position-z={-8} />

        {/* Personaje */}
        <group ref={character} position={[0, 0, 0]}>
          <Player scale={0.8} animation={animation} />
        </group>
      </group>
      {/* Collider del personaje */}
      <CapsuleCollider args={[0.6, 0.7]} position={[0, 1, 0]} />
    </RigidBody>
  );
});

export default PlayerController;
