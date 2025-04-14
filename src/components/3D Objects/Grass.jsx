import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Grass(props) {
  const { nodes, materials } = useGLTF('/models/Grass.glb')
  return (
    <group {...props} dispose={null}>
      
      <group position={[2.324, 23.726, -6.959]} rotation={[0, 1.414, 0]} scale={0.3}>
        <mesh geometry={nodes.Grass_1.geometry} material={materials.GrassType3Material} />
        <mesh geometry={nodes.Grass_2.geometry} material={materials.GrassType1Material} />
        <mesh geometry={nodes.Grass_3.geometry} material={materials.GrassType2Material} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/Grass.glb')
export default Grass;