import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
 
export function Tools({ position, onPickUp, ...props }) {
  const { nodes, materials } = useGLTF("/models/Tools.glb");
  const [isCollected, setIsCollected] = useState(false);
  const ref = useRef();
 
  // Función que se ejecuta cuando el jugador toca la herramienta
  const handleCollision = (event) => {
    if (event.rigidBodyObject?.name === "player") {
      setIsCollected(true); // Ocultar la herramienta
      onPickUp(); // Notificar a GameWorld que se recogió
    }
  };
 
  if (isCollected) return null;
 
  return (
    <RigidBody
      ref={ref}
      type="dynamic"
      gravityScale={1.5}
      onCollisionEnter={handleCollision} // Detecta la colisión con el jugador
    >
    <group {...props} position={position} dispose={null} scale={0.6} rotateY={90}>
      <mesh
        geometry={nodes.ToolOne.geometry}
        material={materials.Steel2}
      />
      <mesh
        geometry={nodes.StickToolOne.geometry}
        material={materials.rough_wood}
      />
    </group>
    </RigidBody>
  );
}
 
useGLTF.preload("/models/Tools.glb");
export default Tools;
 