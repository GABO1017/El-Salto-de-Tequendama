import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function PlayerFem({ animation, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Player_Fem.glb");
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
        <group name="Armature001" rotation={[Math.PI / 2, 0, 0]} scale={0.002}>
        <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="BodyFemale002"
            geometry={nodes.BodyFemale002.geometry}
            material={materials['Skin.002']}
            skeleton={nodes.BodyFemale002.skeleton}
          />
          <skinnedMesh
            name="Eyebrown002"
            geometry={nodes.Eyebrown002.geometry}
            material={materials['Hair.002']}
            skeleton={nodes.Eyebrown002.skeleton}
          />
          <skinnedMesh
            name="GEO-body_female_realisticeyeL003"
            geometry={nodes['GEO-body_female_realisticeyeL003'].geometry}
            material={materials.Eye}
            skeleton={nodes['GEO-body_female_realisticeyeL003'].skeleton}
          />
          <skinnedMesh
            name="GEO-body_female_realisticeyeR003"
            geometry={nodes['GEO-body_female_realisticeyeR003'].geometry}
            material={materials.Eye}
            skeleton={nodes['GEO-body_female_realisticeyeR003'].skeleton}
          />
          <skinnedMesh
            name="HairFemale002"
            geometry={nodes.HairFemale002.geometry}
            material={materials['Hair.002']}
            skeleton={nodes.HairFemale002.skeleton}
          />
          <skinnedMesh
            name="Ropa1001"
            geometry={nodes.Ropa1001.geometry}
            material={materials['Fabric 24']}
            skeleton={nodes.Ropa1001.skeleton}
          />
          <skinnedMesh
            name="Ropa2"
            geometry={nodes.Ropa2.geometry}
            material={materials.Fabric}
            skeleton={nodes.Ropa2.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/Player_Fem.glb");
export default PlayerFem;
