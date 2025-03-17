import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Jaguar({ position, onPlayerCollide, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/jaguar.glb");
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody
        colliders="trimesh"
        type="dynamic"
        gravityScale={1.5}
        position={position}
        onCollisionEnter={({ other }) => {
          if (onPlayerCollide) {
            onPlayerCollide(other);
          }
        }}
      >
        <group name="Sketchfab_Scene">
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
            <group
              name="0763d63683d8408f86079fdd0077420cfbx"
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            >
              <group name="Object_2">
                <group name="RootNode">
                  <group
                    name="skeleton_#1"
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <group name="Object_5">
                      <primitive object={nodes._rootJoint} />
                      <skinnedMesh
                        name="Object_308"
                        geometry={nodes.Object_308.geometry}
                        material={materials.aiStandardSurface}
                        skeleton={nodes.Object_308.skeleton}
                      />
                      <skinnedMesh
                        name="Object_310"
                        geometry={nodes.Object_310.geometry}
                        material={materials.Lengua}
                        skeleton={nodes.Object_310.skeleton}
                      />
                      <skinnedMesh
                        name="Object_312"
                        geometry={nodes.Object_312.geometry}
                        material={materials.Ojos}
                        skeleton={nodes.Object_312.skeleton}
                      />
                      <skinnedMesh
                        name="Object_314"
                        geometry={nodes.Object_314.geometry}
                        material={materials.dientes}
                        skeleton={nodes.Object_314.skeleton}
                      />
                      <group
                        name="Object_307"
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                      />
                      <group
                        name="Object_309"
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                      />
                      <group
                        name="Object_311"
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                      />
                      <group
                        name="Object_313"
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                      />
                    </group>
                  </group>
                  <group
                    name="Yaguarete"
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  />
                  <group
                    name="Lengua"
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  />
                  <group
                    name="Yaguarete001"
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  />
                  <group
                    name="Yaguarete002"
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/jaguar.glb");
export default Jaguar;
