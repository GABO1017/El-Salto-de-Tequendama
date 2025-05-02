import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
  forwardRef,
} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
 
const Enemy = forwardRef(
  (
    {
      onPlayerCollide,
      animation,
      playerRef,
      isPaused: initialPaused,
      isDead: initialDead,
      setObjective,
      onDeath,
      ...props
    },
    ref
  ) => {
    const group = useRef();
    const rigidBodyRef = useRef();
    const armatureRef = useRef();
    const modelContainerRef = useRef();
    const gltf = useGLTF("/models/Enemy.glb");
    const cloned = useMemo(() => clone(gltf.scene), [gltf.scene]);
    const { animations, materials } = gltf;
    const { actions } = useAnimations(animations, group);
 
    const [health, setHealth] = useState(100);
    const [isDead, setIsDead] = useState(initialDead || false);
 
    const [isInactive, setIsInactive] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState(animation);
    const [canMove, setCanMove] = useState(true);
    const [isAttacking, setIsAttacking] = useState(false);
    const [isPaused, setIsPaused] = useState(initialPaused || false);
 
    // Actualizar el estado local de pausa cuando cambia la prop
    useEffect(() => {
      setIsPaused(initialPaused || initialDead);
    }, [initialPaused, initialDead]);
 
    const speed = 2.5;
    const detectionRange = 20;
    const attackCooldown = 800; // 2 segundos de espera entre ataques
    const lastAttackTime = useRef(0);
 
    const currentRotation = useRef(0);
    const targetRotation = useRef(0);
 
    const nodes = useMemo(() => {
      const allNodes = {};
      cloned.traverse((child) => {
        if (child.isSkinnedMesh || child.isBone || child.isMesh) {
          allNodes[child.name] = child;
        }
      });
      return allNodes;
    }, [cloned]);
 
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
 
    // Referencia para controlar si onDeath ya ha sido llamado
    const deathCallbackFired = useRef(false);
    
    const takeDamage = (amount) => {
      if (isDead) return; // No procesar daño si ya está muerto
      
      setHealth((prev) => {
        const newHealth = Math.max(0, prev - amount);
 
        if (newHealth === 0 && !deathCallbackFired.current) {
          setCanMove(false);
          setCurrentAnimation("Dying");
          setIsDead(true);
          
          // Marcar que ya se llamó a onDeath para evitar múltiples llamadas
          deathCallbackFired.current = true;
          
          setTimeout(() => {
            setIsInactive(true);
            if (rigidBodyRef.current) {
              try {
                rigidBodyRef.current.setEnabled(false);
              } catch (e) {
                console.warn(
                  "No se pudo desactivar el RigidBody del enemigo:",
                  e
                );
              }
            }
            
            // Llamar a onDeath correctamente
            if (onDeath && typeof onDeath === 'function') {
              onDeath();
            }
          }, 2000); // Reducido a 2 segundos para mejorar la experiencia
        } else if (newHealth > 0) {
          setCanMove(false);
          setCurrentAnimation("Swipping");
          setTimeout(() => {
            setCurrentAnimation("Idle");
            setCanMove(true);
          }, 1000);
        }
        return newHealth;
      });
    };
 
    // Función para manejar el ataque del enemigo
    const performAttack = () => {
      const now = Date.now();
 
      // Verifica si ha pasado suficiente tiempo desde el último ataque
      if (now - lastAttackTime.current < attackCooldown) return false;
 
      lastAttackTime.current = now;
      setIsAttacking(true);
      setCanMove(false);
 
      // Cambiar a la animación de ataque
      setCurrentAnimation("Punch");
 
      // Detener al enemigo durante el ataque
      if (rigidBodyRef.current) {
        rigidBodyRef.current.wakeUp();
        rigidBodyRef.current.setLinvel(
          {
            x: 0,
            y: rigidBodyRef.current.linvel().y,
            z: 0,
          },
          true
        );
      }
 
      // Después de 2 segundos, volver al estado normal
      setTimeout(() => {
        setIsAttacking(false);
        setCanMove(true);
        setCurrentAnimation("Idle");
      }, 800);
 
      return true;
    };
 
    // Manejar la colisión con el jugador
    const handlePlayerCollision = (other) => {
      if (isPaused) return; // No procesar colisiones si el juego está pausado
 
      if (other.rigidBodyObject?.name === "player" && !isAttacking && canMove) {
        // Intentar realizar un ataque cuando colisiona con el jugador
        const attackPerformed = performAttack();
 
        // Solo llamar al callback externo si se realizó el ataque
        if (attackPerformed && onPlayerCollide) {
          onPlayerCollide(other);
        }
      }
    };
 
    useEffect(() => {
      if (!actions[currentAnimation]) return;
 
      const action = actions[currentAnimation];
 
      if (currentAnimation === "Dying") {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      } else if (currentAnimation === "Punch") {
        action.setLoop(THREE.LoopOnce, 1);
        // No clamp cuando termina el ataque
      } else {
        action.setLoop(THREE.LoopRepeat);
      }
 
      action.reset().fadeIn(0.24).play();
 
      return () => action.fadeOut(0.24);
    }, [currentAnimation]);
 
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
 
    useImperativeHandle(ref, () => ({
      getPosition: () => {
        if (isInactive || !rigidBodyRef.current) return null;
        try {
          const pos = rigidBodyRef.current.translation();
          return new THREE.Vector3(pos.x, pos.y, pos.z);
        } catch (e) {
          console.warn("❌ Error al obtener posición del enemigo:", e);
          return null;
        }
      },
      takeDamage,
      // Añadir método para pausar/reanudar manualmente si es necesario
      setPaused: (paused) => {
        setIsPaused(paused);
      },
      isInactive: () => isInactive,
      isDead: () => isDead,
    }));
 
    // IMPORTANTE: No podemos usar un return condicional antes de definir todos los hooks
    // Moveremos esta lógica al return del componente
 
    useFrame((state, delta) => {
      if (
        isInactive ||
        !rigidBodyRef.current ||
        !playerRef?.current?.rb?.current ||
        !canMove ||
        !modelContainerRef.current ||
        isAttacking ||
        isPaused // No procesar la lógica de movimiento si está pausado
      )
        return;
 
      const playerPos = playerRef.current.rb.current.translation();
      const enemyPos = rigidBodyRef.current.translation();
 
      const playerVector = new THREE.Vector3(
        playerPos.x,
        playerPos.y,
        playerPos.z
      );
      const enemyVector = new THREE.Vector3(enemyPos.x, enemyPos.y, enemyPos.z);
      const distance = enemyVector.distanceTo(playerVector);
 
      if (distance < detectionRange) {
        const direction = new THREE.Vector3()
          .subVectors(playerVector, enemyVector)
          .normalize();
        direction.y = 0;
 
        // Actualizar la velocidad del enemigo
        rigidBodyRef.current.wakeUp();
        rigidBodyRef.current.setLinvel(
          {
            x: direction.x * speed,
            y: rigidBodyRef.current.linvel().y,
            z: direction.z * speed,
          },
          true
        );
 
        if (currentAnimation !== "Run") setCurrentAnimation("Run");
 
        // Calcular el ángulo al que debe mirar
        targetRotation.current = Math.atan2(direction.x, direction.z);
 
        // Suavizar la rotación usando lerp
        currentRotation.current = lerpAngle(
          currentRotation.current,
          targetRotation.current,
          delta * 10 // Ajustar este valor para cambiar la velocidad de giro
        );
 
        // Aplicar la rotación al contenedor del modelo
        modelContainerRef.current.rotation.y = currentRotation.current;
      } else {
        rigidBodyRef.current.wakeUp();
        rigidBodyRef.current.setLinvel(
          {
            x: 0,
            y: rigidBodyRef.current.linvel().y,
            z: 0,
          },
          true
        );
 
        if (currentAnimation !== "Idle") setCurrentAnimation("Idle");
      }
    });
 
    // Si el enemigo está muerto desde las props iniciales, no renderizamos nada
    // IMPORTANTE: Esto debe estar en el return final, después de definir todos los hooks
    if (initialDead) {
      return null;
    }
    
    return (
      <group ref={group} {...props} dispose={null}>
        <RigidBody
          ref={rigidBodyRef}
          colliders={false}
          lockRotations
          gravityScale={1.5}
          name="enemy"
          enabled={!isPaused} // Desactivar físicas cuando está pausado
          onCollisionEnter={handlePlayerCollision}
        >
          <CapsuleCollider args={[1.5, 1]} position={[0, 6, 0]} />
 
          {/* Contenedor para la rotación del modelo */}
          <group ref={modelContainerRef} position={[0, 2.2, 0]}>
            <group name="Scene">
              <group
                name="Armature"
                ref={armatureRef}
                rotation={[Math.PI / 2, 0, 0]} // Mantener solo la rotación base
                scale={0.02}
                position-y={1.92}
              >
                <skinnedMesh
                  name="Body"
                  geometry={nodes.Body.geometry}
                  material={materials.BodyMaterial}
                  skeleton={nodes.Body.skeleton}
                />
                <skinnedMesh
                  name="Leaves"
                  geometry={nodes.Leaves.geometry}
                  material={materials.LeavesMaterial}
                  skeleton={nodes.Leaves.skeleton}
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
 
useGLTF.preload("/models/Enemy.glb");
export default Enemy;