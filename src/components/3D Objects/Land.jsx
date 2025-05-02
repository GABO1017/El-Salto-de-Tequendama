import React from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Land(props) {
  const { nodes, materials } = useGLTF("/models/Land.glb");
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders="trimesh" name="village" debug>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Land.geometry}
          material={materials.GrassLandMaterial}
        />

        <CuboidCollider args={[80, 20, 1]} position={[5.49, 35.31, 55.97]} />
        <CuboidCollider args={[1, 20, 80]} position={[55.97, 35.31, 5.49]} />
        <CuboidCollider args={[80, 20, 1]} position={[-5.49, 35.31, -55.97]} />
        <CuboidCollider args={[1, 20, 80]} position={[-55.97, 35.31, -5.49]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models//Land.glb");
export default Land;
