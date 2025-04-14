import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export function NormalVillagerF({ animation, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Aldeana.glb");
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (!actions[animation]) return;

    const action = actions[animation];

    action.reset().fadeIn(0.24).play();

    return () => action.fadeOut(0.24);
  }, [animation]);
  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody
        colliders={false}
        lockRotations
        gravityScale={1.5}
        name="villager"
      >
        <group name="Scene">
          <group
            name="Armature"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.016}
            position-y={1}
          >
            <skinnedMesh
              name="Aretes"
              geometry={nodes.Aretes.geometry}
              material={materials.OroMaterial}
              skeleton={nodes.Aretes.skeleton}
            />
            <skinnedMesh
              name="Cejas"
              geometry={nodes.Cejas.geometry}
              material={materials.HairMaterial}
              skeleton={nodes.Cejas.skeleton}
            />
            <group name="Cinturon">
              <skinnedMesh
                name="BodyF009mesh"
                geometry={nodes.BodyF009mesh.geometry}
                material={materials.TelaOscuraMaterial}
                skeleton={nodes.BodyF009mesh.skeleton}
              />
              <skinnedMesh
                name="BodyF009mesh_1"
                geometry={nodes.BodyF009mesh_1.geometry}
                material={materials.TelaPatronMaterial}
                skeleton={nodes.BodyF009mesh_1.skeleton}
              />
            </group>
            <skinnedMesh
              name="Cuerpo"
              geometry={nodes.Cuerpo.geometry}
              material={materials.SkinMaterial}
              skeleton={nodes.Cuerpo.skeleton}
            />
            <skinnedMesh
              name="Ojo1"
              geometry={nodes.Ojo1.geometry}
              material={materials.EyeMaterial}
              skeleton={nodes.Ojo1.skeleton}
            />
            <skinnedMesh
              name="Ojo2"
              geometry={nodes.Ojo2.geometry}
              material={materials.EyeMaterial}
              skeleton={nodes.Ojo2.skeleton}
            />
            <skinnedMesh
              name="Pañuelo"
              geometry={nodes.Pañuelo.geometry}
              material={materials.TelaOscuraMaterial}
              skeleton={nodes.Pañuelo.skeleton}
            />
            <skinnedMesh
              name="Pelo"
              geometry={nodes.Pelo.geometry}
              material={materials.HairMaterial}
              skeleton={nodes.Pelo.skeleton}
            />
            <skinnedMesh
              name="Rapa"
              geometry={nodes.Rapa.geometry}
              material={materials.TelaMaterial}
              skeleton={nodes.Rapa.skeleton}
            />
            <primitive object={nodes.mixamorigHips} />
          </group>
        </group>
        <CapsuleCollider args={[0.6, 0.7]} position={[0, 2, 0]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Aldeana.glb");
export default NormalVillagerF;
