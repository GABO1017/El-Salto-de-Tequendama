import React from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Tree2(props) {
  const { nodes, materials } = useGLTF("/models/Tree2.glb");
  // Array con las posiciones de los colliders
  const colliderPositions = [
    [8.82, 24.1, -16.61],
    [-1.89, 24.1, -18.78],
    [-3.69, 24.1, -21.4],
    [9.84, 24.1, -25.95],
    [23.65, 24.1, -33.92],
    [23.65, 24.1, -19.64],
    [26.72, 24.1, -20.52],
    [32.18, 24, -29.98],
  ];
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tree002.geometry}
        material={materials.TreeMaterial}
      />
      <RigidBody colliders={false} type="fixed">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.tree002_1.geometry}
          material={materials.WoodMaterial}
        />
        {colliderPositions.map((pos, index) => (
          <CuboidCollider key={index} args={[0.05, 0.4, 0.05]} position={pos} />
        ))}
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Tree2.glb");
export default Tree2;
