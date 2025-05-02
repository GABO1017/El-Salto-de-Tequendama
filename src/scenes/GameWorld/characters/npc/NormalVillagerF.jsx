import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const NormalVillagerF = forwardRef(
  (
    {
      animation,
      setSubtitles,
      setObjective,
      playerRef,
      isPaused: initialPaused,
      speed = 2,
      ...props
    },
    ref
  ) => {
    const gltf = useGLTF("/models/Aldeana.glb");
    const cloned = useMemo(() => clone(gltf.scene), [gltf.scene]);

    const group = useRef();
    const villagerRef = useRef();
    const bodyRef = useRef();
    const modelContainerRef = useRef();
    const isTouchingPlayer = useRef(false);

    const { animations } = gltf;
    const { actions } = useAnimations(animations, group);

    const [currentAnimation, setCurrentAnimation] = useState(
      animation || "Idle1"
    );
    const [isWalking, setIsWalking] = useState(true);
    const [currentSpeed, setCurrentSpeed] = useState(speed);

    const direction = useRef(new Vector3());
    const directionChangeTimer = useRef(0);

    const hasInteracted = useRef(false);
    const subtitleTimeout = useRef(null);
    const exitTimeout = useRef(null); // <-- Nuevo ref para controlar la salida

    const [isPaused, setIsPaused] = useState(initialPaused || false);

    const dialogueLines = [
      "Estamos recolectando hierbas sagradas.",
      "Algo extraño sucede en las montañas.",
      "Debes tener cuidado con los espíritus del bosque.",
      "Busca la sabiduría de los ancestros en los templos.",
      "Dicen que los árboles susurran secretos al anochecer.",
    ];

    // Cambio inicial de dirección
    useEffect(() => {
      changeDirection();
    }, []);

    const changeDirection = () => {
      direction.current
        .set((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2)
        .normalize();
    };

    useImperativeHandle(ref, () => ({
      stopWalking: () => setIsWalking(false),
      startWalking: () => setIsWalking(true),
      setSpeed: (s) => setCurrentSpeed(s),
      setPaused: (paused) => {
        setIsPaused(paused);
      },
    }));

    const interactWithVillager = () => {
      const line =
        dialogueLines[Math.floor(Math.random() * dialogueLines.length)];
      setSubtitles?.(line);

      // Parar de caminar para hablar
      setIsWalking(false);
      setCurrentSpeed(0);

      // 👇 Marcar que interactuamos
      hasInteracted.current = true;

      if (actions["Talking2"]) {
        actions[currentAnimation]?.fadeOut(0.2);
        actions["Talking2"].reset().fadeIn(0.2).play();

        setTimeout(() => {
          actions["Talking2"]?.stop();
          if (actions[currentAnimation]) {
            actions[currentAnimation].reset().fadeIn(0.1).play();
          }

          // Reanudar caminar
          setIsWalking(true);
          setCurrentSpeed(speed);
        }, 4000);
      }
      if (subtitleTimeout.current) {
        clearTimeout(subtitleTimeout.current);
      }
      subtitleTimeout.current = setTimeout(() => {
        setSubtitles?.("");
        hasInteracted.current = false; // Resetear interacción
      }, 4000);
    };

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key.toLowerCase() === "f" && isTouchingPlayer.current) {
          interactWithVillager();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
      if (!actions[currentAnimation]) return;
      const action = actions[currentAnimation];
      action.reset().fadeIn(0.24).play();
      return () => action.fadeOut(0.24);
    }, [currentAnimation]);

    useFrame((state, delta) => {
      if (!villagerRef.current || !bodyRef.current) return;

      if (isWalking) {
        // Movimiento aleatorio continuo
        bodyRef.current.wakeUp();
        bodyRef.current.setLinvel(
          {
            x: direction.current.x * currentSpeed,
            y: bodyRef.current.linvel().y,
            z: direction.current.z * currentSpeed,
          },
          true
        );

        if (currentAnimation !== "Walking") setCurrentAnimation("Walking");

        // Rotación de modelo
        const angle = Math.atan2(direction.current.x, direction.current.z);
        if (modelContainerRef.current) {
          modelContainerRef.current.rotation.y = angle;
        }

        // Cambiar dirección cada 5-8 segundos
        directionChangeTimer.current += delta;
        if (directionChangeTimer.current > Math.random() * 3 + 5) {
          changeDirection();
          directionChangeTimer.current = 0;
        }
      } else {
        // Quieto
        bodyRef.current.wakeUp();
        bodyRef.current.setLinvel(
          {
            x: 0,
            y: bodyRef.current.linvel().y,
            z: 0,
          },
          true
        );

        if (currentAnimation !== "Idle1") setCurrentAnimation("Idle1");
      }
    });

    // Actualizar el estado local de pausa cuando cambia la prop
    useEffect(() => {
      setIsPaused(initialPaused);
    }, [initialPaused]);

    // Efecto para pausar/reanudar todas las animaciones
    useEffect(() => {
      // Obtener todas las acciones activas
      const allActions = Object.values(actions);

      if (isPaused) {
        // Pausar todas las animaciones
        allActions.forEach((action) => {
          if (action.isRunning()) {
            action.paused = true;
          }
        });
      } else {
        // Reanudar todas las animaciones
        allActions.forEach((action) => {
          if (action.paused) {
            action.paused = false;
          }
        });
      }
    }, [isPaused, actions]);

    const nodes = useMemo(() => {
      const allNodes = {};
      cloned.traverse((child) => {
        if (child.isSkinnedMesh || child.isBone || child.isMesh) {
          allNodes[child.name] = child;
        }
      });
      return allNodes;
    }, [cloned]);

    const materials = gltf.materials;

    return (
      <group
        ref={(ref2) => {
          group.current = ref2;
          villagerRef.current = ref2;
        }}
        {...props}
        dispose={null}
      >
        <RigidBody
          ref={bodyRef}
          colliders={false}
          lockRotations
          gravityScale={5.5}
          name="villager"
          onCollisionEnter={({ other }) => {
            if (other.rigidBodyObject?.name === "player") {
              if (exitTimeout.current) {
                clearTimeout(exitTimeout.current);
              }
              isTouchingPlayer.current = true;
              setSubtitles?.("Presiona la letra F para interactuar");
            }
          }}
          onCollisionExit={({ other }) => {
            if (other.rigidBodyObject?.name === "player") {
              exitTimeout.current = setTimeout(() => {
                isTouchingPlayer.current = false;

                if (!hasInteracted.current) {
                  setSubtitles?.("");
                }
              }, 1000); // 1000 ms = 1 segundo
            }
          }}
        >
          <CapsuleCollider args={[0.6, 0.7]} position={[0, 2, 0]} />
          <group ref={modelContainerRef} position={[0, 2.2, 0]}>
            <group name="Scene">
              <group
                name="Armature"
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.016}
                position-y={-1.2}
              >
                <skinnedMesh
                  name="Aretes"
                  geometry={nodes.Aretes.geometry}
                  material={materials.OroMaterial}
                  skeleton={nodes.Aretes.skeleton}
                />
                <skinnedMesh
                  name="Cejas"
                  geometry={nodes.Cejas.geometry}
                  material={materials.HairMaterial}
                  skeleton={nodes.Cejas.skeleton}
                />
                <group name="Cinturon">
                  <skinnedMesh
                    name="BodyF009mesh"
                    geometry={nodes.BodyF009mesh.geometry}
                    material={materials.TelaOscuraMaterial}
                    skeleton={nodes.BodyF009mesh.skeleton}
                  />
                  <skinnedMesh
                    name="BodyF009mesh_1"
                    geometry={nodes.BodyF009mesh_1.geometry}
                    material={materials.TelaPatronMaterial}
                    skeleton={nodes.BodyF009mesh_1.skeleton}
                  />
                </group>
                <skinnedMesh
                  name="Cuerpo"
                  geometry={nodes.Cuerpo.geometry}
                  material={materials.SkinMaterial}
                  skeleton={nodes.Cuerpo.skeleton}
                />
                <skinnedMesh
                  name="Ojo1"
                  geometry={nodes.Ojo1.geometry}
                  material={materials.EyeMaterial}
                  skeleton={nodes.Ojo1.skeleton}
                />
                <skinnedMesh
                  name="Ojo2"
                  geometry={nodes.Ojo2.geometry}
                  material={materials.EyeMaterial}
                  skeleton={nodes.Ojo2.skeleton}
                />
                <skinnedMesh
                  name="Pañuelo"
                  geometry={nodes.Pañuelo.geometry}
                  material={materials.TelaOscuraMaterial}
                  skeleton={nodes.Pañuelo.skeleton}
                />
                <skinnedMesh
                  name="Pelo"
                  geometry={nodes.Pelo.geometry}
                  material={materials.HairMaterial}
                  skeleton={nodes.Pelo.skeleton}
                />
                <skinnedMesh
                  name="Rapa"
                  geometry={nodes.Rapa.geometry}
                  material={materials.TelaMaterial}
                  skeleton={nodes.Rapa.skeleton}
                />
                <primitive object={nodes.mixamorigHips} />
              </group>
            </group>
          </group>
        </RigidBody>
      </group>
    );
  }
);

useGLTF.preload("/models/Aldeana.glb");
export default NormalVillagerF;
