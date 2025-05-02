import React from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Houses(props) {
  const { nodes, materials } = useGLTF("/models/Houses.glb");
    // Array con las posiciones de los colliders
    const colliderPositions = [
      [16.36, 24, -12.66],
      [17.47, 24, -13.05],
      [18.41, 24, -11.84],
      [16.1, 24, -11.2],
      [15.91, 24, -9.51],
      [14.74, 24, -9.45],
      [14.08, 24, -8.11],
      [16.48, 24, -8.09],
      [14.74, 24, -9.45],
      [13.62, 24, -6.82],
      [11.92, 24, -6.53],
      [14.04, 24, -5.12],
      [7.5, 24, -4.22],
      [6.35, 24, -5.26],
      [5.2, 24, -4.45],
      [5.84, 24, -3],
      [3.24, 24, -2.58],
      [3.47, 24, -4.3],
      [1.79, 24, -4.67],
      [1.67, 24, 2.33],
      [0.29, 24, 1.69],
      [-0.52, 24, 2.53],
      [-0.09, 24, 3.96],
      [-0.68, 24, 5.98],
      [-0.68, 24, 5.98],
      [0.77, 24, 5.68],
      [0.79, 24, 7.88],
      [-5.76, 24, 11.52],
      [-7.04, 24, 10.93],
      [-6.09, 24, 13.02],
      [-7.97, 24, 12.22],
      [-11.04, 24, 10.89],
      [-12.75, 24, 11.25],
      [-11.26, 24, 9.19],
      [-15.83, 24, -1.88],
      [-14.38, 24, -1.38],
      [-13.63, 24, -2.57],
      [-14.78, 24, -3.65],
      [-12.95, 24, -4.41],
      [-12.19, 24, -3.08],
      [-11.03, 24, -3.3],
      [-10.57, 24, -4.73],
      [-8.89, 24, -15.87],
      [-8.12, 24, -14.3],
      [-6.51, 24, -14.95],
      [-5.32, 24, -16.93],
      [-4.17, 24, -17.16],
      [-6.09, 24, -18.26],
      [-3.71, 24, -18.57],
    ];
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders="trimesh" name="houses" debug>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse014.geometry}
          material={materials.ClayMaterial}
        />
      </RigidBody>
      <RigidBody colliders={false} type="fixed">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ClayHouse014_1.geometry}
          material={materials.WoodMaterial}
        />

        {/* Colliders iterados desde el array */}
        {colliderPositions.map((pos, index) => (
          <CuboidCollider key={index} args={[0.03, 0.3, 0.03]} position={pos} />
        ))}
      </RigidBody>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ClayHouse014_2.geometry}
        material={materials.StrawMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ClayHouse014_3.geometry}
        material={materials.StrawMaterial}
      />
    </group>
  );
}

useGLTF.preload("/models/Houses.glb");
export default Houses;
