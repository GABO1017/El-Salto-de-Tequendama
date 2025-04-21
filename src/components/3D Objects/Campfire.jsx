import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Campfire(props) {
  const { nodes, materials } = useGLTF("/models/Campfire.glb");
  return (
    <group {...props} dispose={null}>

        <mesh
          castShadow
          receiveShadow
          geometry={
            nodes.campfire_modelsubtool14_campfire_model6_stone_0.geometry
          }
          material={materials.campfire_model6_stone}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={
            nodes.campfire_modelsubtool14_campfire_model6_stone2_0.geometry
          }
          material={materials.campfire_model6_stone2}
        />
          <RigidBody type="fixed" colliders={false} name="campfire" debug>
        <mesh
          castShadow
          receiveShadow
          geometry={
            nodes.campfire_modelsubtool14_campfire_model6_wood_0.geometry
          }
          material={materials.campfire_model6_wood}
        />
         <CuboidCollider  args={[3, 2, 4]}  position={[0, 0.5, -0.5]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Campfire.glb");
export default Campfire;
