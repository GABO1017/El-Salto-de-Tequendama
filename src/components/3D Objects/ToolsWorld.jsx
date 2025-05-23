import React from 'react'
import { useGLTF } from '@react-three/drei'

export function ToolsWorld(props) {
  const { nodes, materials } = useGLTF('/models/ToolsWorld.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.ToolThree002.geometry}
        material={materials.Steel}
      />
      <mesh
        geometry={nodes.ToolThree002_1.geometry}
        material={materials.Wood}
      />
    </group>
  )
}

useGLTF.preload('/models/ToolsWorld.glb')
export default ToolsWorld;