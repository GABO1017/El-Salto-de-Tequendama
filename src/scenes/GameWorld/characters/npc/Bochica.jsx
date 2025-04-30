import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export function Bochica({ animation, setSubtitles, startCinematicEnding, ...props }) {
  const group = useRef();
  const bodyRef = useRef();
  const isTouchingPlayer = useRef(false);
  const exitTimeout = useRef(null);

  const { nodes, materials, animations } = useGLTF("/models/Bochica.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions[animation]) return;
    const action = actions[animation];
    action.reset().fadeIn(0.24).play();
    return () => action.fadeOut(0.24);
  }, [animation]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "f" && isTouchingPlayer.current) {
        setSubtitles?.("");
        if (actions["Talking"]) {
          actions[animation]?.fadeOut(0.2);
          actions["Talking"].reset().fadeIn(0.2).play();
        }
        startCinematicEnding?.(); // 🔥 iniciar nueva cinemática
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startCinematicEnding, actions, animation]);

  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody
        ref={bodyRef}
        colliders={false}
        lockRotations
        gravityScale={2.5}
        name="bochica"
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            if (exitTimeout.current) clearTimeout(exitTimeout.current);
            isTouchingPlayer.current = true;
            setSubtitles?.("Presiona la letra F para hablar con Bochica");
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            exitTimeout.current = setTimeout(() => {
              isTouchingPlayer.current = false;
              setSubtitles?.("");
            }, 1000);
          }
        }}
      >
        <group name="Scene">
          <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.02}>
            <skinnedMesh
              name="Bochica"
              geometry={nodes.Bochica.geometry}
              material={materials.BochicaMaterial}
              skeleton={nodes.Bochica.skeleton}
            />
            <primitive object={nodes.mixamorigHips} />
          </group>
        </group>
        <CapsuleCollider args={[0.6, 0.7]} position={[0, 1.05, 0]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Bochica.glb");
export default Bochica;
