import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function PlayerMasc({ animation, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Player_Muisca.glb");
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (!actions[animation]) return;

    const action = actions[animation];

    // Si es la animación de muerte, la configuramos para que no haga loop
    if (animation === "Death") {
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
      <group name="Scene">
        <group name="Armature001" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Bag"
            geometry={nodes.Bag.geometry}
            material={materials.Hat}
            skeleton={nodes.Bag.skeleton}
          />
          <skinnedMesh
            name="Body"
            geometry={nodes.Body.geometry}
            material={materials.SkinSof}
            skeleton={nodes.Body.skeleton}
          />
          <skinnedMesh
            name="Bracele"
            geometry={nodes.Bracele.geometry}
            material={materials["Golden.002"]}
            skeleton={nodes.Bracele.skeleton}
          />
          <skinnedMesh
            name="Earings"
            geometry={nodes.Earings.geometry}
            material={materials["Golden.002"]}
            skeleton={nodes.Earings.skeleton}
          />
          <skinnedMesh
            name="Eye1"
            geometry={nodes.Eye1.geometry}
            material={materials["Material.003"]}
            skeleton={nodes.Eye1.skeleton}
          />
          <skinnedMesh
            name="Eye2"
            geometry={nodes.Eye2.geometry}
            material={materials["Material.003"]}
            skeleton={nodes.Eye2.skeleton}
          />
          <skinnedMesh
            name="Eyebrow"
            geometry={nodes.Eyebrow.geometry}
            material={materials.Hair}
            skeleton={nodes.Eyebrow.skeleton}
          />
          <skinnedMesh
            name="Hair"
            geometry={nodes.Hair.geometry}
            material={materials.Hair}
            skeleton={nodes.Hair.skeleton}
          />
          <skinnedMesh
            name="Hat"
            geometry={nodes.Hat.geometry}
            material={materials.Hat}
            skeleton={nodes.Hat.skeleton}
          />
          <skinnedMesh
            name="Pelt"
            geometry={nodes.Pelt.geometry}
            material={materials["Golden.002"]}
            skeleton={nodes.Pelt.skeleton}
          />
          <skinnedMesh
            name="Robe"
            geometry={nodes.Robe.geometry}
            material={materials["Robe.001"]}
            skeleton={nodes.Robe.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/Player_Muisca.glb");
export default PlayerMasc;
