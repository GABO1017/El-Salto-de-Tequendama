import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

export function Enemy({ onPlayerCollide, animation, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Enemy.glb");
  const { actions } = useAnimations(animations, group);
   useEffect(() => {
      if (!actions[animation]) return;
  
      const action = actions[animation];
  
      // Si es la animación de muerte, la configuramos para que no haga loop
      if (animation === "Dying") {
        action.setLoop(THREE.LoopOnce, 1); // Solo una vez
        action.clampWhenFinished = true; // Se queda en el último frame
      } else {
        action.setLoop(THREE.LoopRepeat); // Otras animaciones pueden repetirse
      }
  
      action.reset().fadeIn(0.24).play();
  
      return () => action.fadeOut(0.24);
    }, [animation]);
  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody
        colliders={false}
        lockRotations
        gravityScale={1.5}
        name="enemy"
        onCollisionEnter={({ other }) => {
          if (onPlayerCollide) {
            onPlayerCollide(other);
          }
        }}
      >
        <group name="Scene">
          <group
            name="Armature"
            rotation={[Math.PI / 2, 0, 0]}
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
        <CapsuleCollider args={[1.5, 1]} position={[0, 4, 0]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Enemy.glb");
export default Enemy;
