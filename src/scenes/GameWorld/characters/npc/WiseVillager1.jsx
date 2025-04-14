import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export function WiseVillager1({ animation, ...props}) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Sabio1.glb");
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (!actions[animation]) return;

    const action = actions[animation];

    action.reset().fadeIn(0.24).play();

    return () => action.fadeOut(0.24);
  }, [animation]);
  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody colliders={false} lockRotations gravityScale={1.5} name="wise">
        <group name="Scene">
          <group
            name="Armature"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.016}
            position-y={1}
          >
            <skinnedMesh
              name="Aretes001"
              geometry={nodes.Aretes001.geometry}
              material={materials.OroMaterial}
              skeleton={nodes.Aretes001.skeleton}
            />
            <skinnedMesh
              name="BodyM001"
              geometry={nodes.BodyM001.geometry}
              material={materials.SkinMaterial}
              skeleton={nodes.BodyM001.skeleton}
            />
            <skinnedMesh
              name="Cadena001"
              geometry={nodes.Cadena001.geometry}
              material={materials.OroMaterial}
              skeleton={nodes.Cadena001.skeleton}
            />
            <group name="Capa001">
              <skinnedMesh
                name="Capamesh"
                geometry={nodes.Capamesh.geometry}
                material={materials.TelaPatronCuadradoMaterial}
                skeleton={nodes.Capamesh.skeleton}
              />
              <skinnedMesh
                name="Capamesh_1"
                geometry={nodes.Capamesh_1.geometry}
                material={materials.TelaNegraMaterial}
                skeleton={nodes.Capamesh_1.skeleton}
              />
            </group>
            <skinnedMesh
              name="Cejas001"
              geometry={nodes.Cejas001.geometry}
              material={materials.HairMaterial}
              skeleton={nodes.Cejas001.skeleton}
            />
            <skinnedMesh
              name="Eyes001"
              geometry={nodes.Eyes001.geometry}
              material={materials.EyeMaterial}
              skeleton={nodes.Eyes001.skeleton}
            />
            <group name="Gorro001">
              <skinnedMesh
                name="Gorromesh"
                geometry={nodes.Gorromesh.geometry}
                material={materials.TelaNegraMaterial}
                skeleton={nodes.Gorromesh.skeleton}
              />
              <skinnedMesh
                name="Gorromesh_1"
                geometry={nodes.Gorromesh_1.geometry}
                material={materials.TelaPatronCuadradoMaterial}
                skeleton={nodes.Gorromesh_1.skeleton}
              />
              <skinnedMesh
                name="Gorromesh_2"
                geometry={nodes.Gorromesh_2.geometry}
                material={materials.TelaRojaMaterial}
                skeleton={nodes.Gorromesh_2.skeleton}
              />
            </group>
            <group name="Ropa001">
              <skinnedMesh
                name="Ropamesh"
                geometry={nodes.Ropamesh.geometry}
                material={materials.TelaRojaMaterial}
                skeleton={nodes.Ropamesh.skeleton}
              />
              <skinnedMesh
                name="Ropamesh_1"
                geometry={nodes.Ropamesh_1.geometry}
                material={materials.TelaNegraMaterial}
                skeleton={nodes.Ropamesh_1.skeleton}
              />
            </group>
            <primitive object={nodes.mixamorigHips} />
          </group>
        </group>
        <CapsuleCollider args={[0.6, 0.7]} position={[0, 2, 0]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Sabio1.glb");
export default WiseVillager1;
