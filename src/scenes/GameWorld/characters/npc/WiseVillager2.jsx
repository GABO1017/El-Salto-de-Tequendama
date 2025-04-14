import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export function WiseVillager2({ animation, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Sabio2.glb");
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
              name="Aretes2001"
              geometry={nodes.Aretes2001.geometry}
              material={materials.OroMaterial}
              skeleton={nodes.Aretes2001.skeleton}
            />
            <skinnedMesh
              name="BodyM2001"
              geometry={nodes.BodyM2001.geometry}
              material={materials.SkinMaterial}
              skeleton={nodes.BodyM2001.skeleton}
            />
            <skinnedMesh
              name="Cejas2001"
              geometry={nodes.Cejas2001.geometry}
              material={materials.HairMaterial}
              skeleton={nodes.Cejas2001.skeleton}
            />
            <skinnedMesh
              name="Eyes2001"
              geometry={nodes.Eyes2001.geometry}
              material={materials.EyeMaterial}
              skeleton={nodes.Eyes2001.skeleton}
            />
            <group name="Gorro2001">
              <skinnedMesh
                name="Gorro2mesh"
                geometry={nodes.Gorro2mesh.geometry}
                material={materials.TelaRojaMaterial}
                skeleton={nodes.Gorro2mesh.skeleton}
              />
              <skinnedMesh
                name="Gorro2mesh_1"
                geometry={nodes.Gorro2mesh_1.geometry}
                material={materials.TelaNegraMaterial}
                skeleton={nodes.Gorro2mesh_1.skeleton}
              />
            </group>
            <skinnedMesh
              name="ParteCorona1001"
              geometry={nodes.ParteCorona1001.geometry}
              material={materials.OroMaterial}
              skeleton={nodes.ParteCorona1001.skeleton}
            />
            <group name="RopaExterior001">
              <skinnedMesh
                name="RopaExteriormesh"
                geometry={nodes.RopaExteriormesh.geometry}
                material={materials.TelaRojaMaterial}
                skeleton={nodes.RopaExteriormesh.skeleton}
              />
              <skinnedMesh
                name="RopaExteriormesh_1"
                geometry={nodes.RopaExteriormesh_1.geometry}
                material={materials.TelaNegraMaterial}
                skeleton={nodes.RopaExteriormesh_1.skeleton}
              />
            </group>
            <skinnedMesh
              name="RopaInterior001"
              geometry={nodes.RopaInterior001.geometry}
              material={materials.TelaNegraMaterial}
              skeleton={nodes.RopaInterior001.skeleton}
            />
            <primitive object={nodes.mixamorigHips} />
          </group>
        </group>
        <CapsuleCollider args={[0.6, 0.7]} position={[0, 2, 0]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Sabio2.glb");
export default WiseVillager2;
