import React, { useRef } from 'react'
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Grove(props) {
  const { nodes, materials } = useGLTF('/models/Grove.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Grove.geometry}
        material={materials.GroveMaterial}
      />
    </group>
  )
}

useGLTF.preload('/models/Grove.glb')
export default Grove;
