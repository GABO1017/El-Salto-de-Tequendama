import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Tree1(props) {
  const { nodes, materials } = useGLTF("/models/Tree1.glb");
  // Array con las posiciones de los colliders
  const colliderPositions = [
    [15.39, 24.4, -15.51],
    [16.15, 24.4, -20.2],
    [17.43, 24.4, -25.32],
    [26.38, 24.4, -28.17],
    [14.25, 24.4, -30.17],
    [6.55, 24.4, -26.65],
    [6.23, 24.4, -18.19],
    [9.28, 24.4, -20.79],
  ];
  return (
    <group {...props} dispose={null}>
      <group position={[0, -0.35, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.leaves003.geometry}
          material={materials.TreeMaterial}
        />
        <RigidBody colliders={false} type="fixed">
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.leaves003_1.geometry}
            material={materials.WoodMaterial}
          />
          {colliderPositions.map((pos, index) => (
            <CuboidCollider key={index} args={[0.1, 0.4, 0.1]} position={pos} />
          ))}
        </RigidBody>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Tree1.glb");
export default Tree1;
