import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Player({animation, ...props}) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Player_Muisca.glb");
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.24).play();
    return () => actions?.[animation]?.fadeOut(0.24);
  }, [animation]);
  return (
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          <group name="Armature">
          <primitive object={nodes.mixamorigHips} />
            <skinnedMesh
              name="Bag"
              geometry={nodes.Bag.geometry}
              material={materials.Hat}
              skeleton={nodes.Bag.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Body"
              geometry={nodes.Body.geometry}
              material={materials.Skin}
              skeleton={nodes.Body.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Bracele"
              geometry={nodes.Bracele.geometry}
              material={materials.Golden}
              skeleton={nodes.Bracele.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Earings"
              geometry={nodes.Earings.geometry}
              material={materials.Golden}
              skeleton={nodes.Earings.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Eye1"
              geometry={nodes.Eye1.geometry}
              material={materials["Material.001"]}
              skeleton={nodes.Eye1.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Eye2"
              geometry={nodes.Eye2.geometry}
              material={materials["Material.001"]}
              skeleton={nodes.Eye2.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Eyebrow"
              geometry={nodes.Eyebrow.geometry}
              material={materials.Hair}
              skeleton={nodes.Eyebrow.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Hair"
              geometry={nodes.Hair.geometry}
              material={materials.Hair}
              skeleton={nodes.Hair.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Hat"
              geometry={nodes.Hat.geometry}
              material={materials.Hat}
              skeleton={nodes.Hat.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Pelt"
              geometry={nodes.Pelt.geometry}
              material={materials.Golden}
              skeleton={nodes.Pelt.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Robe"
              geometry={nodes.Robe.geometry}
              material={materials.Robe}
              skeleton={nodes.Robe.skeleton}
              castShadow
              receiveShadow
            />
          </group>
        </group>
      </group>
  );
}

useGLTF.preload("/Player_Muisca.glb");
export default Player;
