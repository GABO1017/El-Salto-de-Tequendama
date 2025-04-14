import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function HousePrincipal(props) {
  const { nodes, materials } = useGLTF("/models/HousePrincipal.glb");

  // Array con las posiciones de los colliders
  const colliderPositions = [
    [-12.87, 24.3, 0.79],
    [-16.62, 24.3, 0.77],
    [-13.06, 24.3, 2.68],
    [-16.7, 24.3, 2.13],
  ];

  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders="trimesh" name="houses" debug>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.HomeClay001.geometry}
          material={materials.ClayMaterial}
        />
      </RigidBody>

      <RigidBody colliders={false} type="fixed">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.HomeClay001_1.geometry}
          material={materials.WoodMaterial}
        />

        {/* Colliders iterados desde el array */}
        {colliderPositions.map((pos, index) => (
          <CuboidCollider key={index} args={[0.05, 0.5, 0.05]} position={pos} />
        ))}
      </RigidBody>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.HomeClay001_2.geometry}
        material={materials.StrawMaterial}
      />
    </group>
  );
}

useGLTF.preload("/models/HousePrincipal.glb");
export default HousePrincipal;
