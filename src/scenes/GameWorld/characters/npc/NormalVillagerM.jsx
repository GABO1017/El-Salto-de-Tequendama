import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export function NormalVillagerM({
  animation,
  setSubtitles,
  setObjective,
  playerRef,
  ...props
}) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Aldeano.glb");
  const { actions } = useAnimations(animations, group);
  const villagerRef = useRef();
  const bodyRef = useRef();
  const isTouchingPlayer = useRef(false);

  const dialogueLines = [
    "Las cosechas se van a dañar",
    "Ofendimos a Chibchacum",
    "El bosque es muy peligroso, hay guardianes enojados",
    "Necesitas encontrar una herramienta para atacar",
    "¿Has oído el tambor en la distancia? Nadie lo toca desde hace años."
  ];

  useEffect(() => {
    if (!actions[animation]) return;
    const action = actions[animation];
    action.reset().fadeIn(0.24).play();
    return () => action.fadeOut(0.24);
  }, [animation]);

  const interactWithVillager = () => {
    const line =
      dialogueLines[Math.floor(Math.random() * dialogueLines.length)];
    setSubtitles?.(line);

    if (actions["Talking2"]) {
      actions[animation]?.fadeOut(0.2);
      actions["Talking2"].reset().fadeIn(0.2).play();

      setTimeout(() => {
        actions["Talking2"]?.stop();
        if (actions[animation]) {
          actions[animation].reset().fadeIn(0.1).play();
        }
      }, 4000);
      
    }

    if (line === "Necesitas encontrar una herramienta para atacar") {
      setObjective?.(
        "Busca alguna herramienta dentro de las casas para poder atacar"
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "f" && isTouchingPlayer.current) {
        interactWithVillager();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <group
      ref={(ref) => {
        group.current = ref;
        villagerRef.current = ref;
      }}
      {...props}
      dispose={null}
    >
      <RigidBody
        ref={bodyRef}
        colliders={false}
        lockRotations
        gravityScale={5.5}
        name="villager"
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            isTouchingPlayer.current = true;
            setSubtitles?.("Presiona la letra F para interactuar");
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            isTouchingPlayer.current = false;
            setSubtitles?.("");
          }
        }}
      >
        <group name="Scene">
          <group
            name="Armature001"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.016}
            position-y={1.3}
          >
            <skinnedMesh
              name="CejasM001"
              geometry={nodes.CejasM001.geometry}
              material={materials.HairMaterial}
              skeleton={nodes.CejasM001.skeleton}
            />
            <group name="CinturonM001">
              <skinnedMesh
                name="CinturonMmesh002"
                geometry={nodes.CinturonMmesh002.geometry}
                material={materials.TelaOscuraMaterial}
                skeleton={nodes.CinturonMmesh002.skeleton}
              />
              <skinnedMesh
                name="CinturonMmesh002_1"
                geometry={nodes.CinturonMmesh002_1.geometry}
                material={materials.TelaPatronMaterial}
                skeleton={nodes.CinturonMmesh002_1.skeleton}
              />
            </group>
            <skinnedMesh
              name="Collar001"
              geometry={nodes.Collar001.geometry}
              material={materials.OroMaterial}
              skeleton={nodes.Collar001.skeleton}
            />
            <skinnedMesh
              name="CuerpoM001"
              geometry={nodes.CuerpoM001.geometry}
              material={materials.SkinMaterial}
              skeleton={nodes.CuerpoM001.skeleton}
            />
            <skinnedMesh
              name="Ojos001"
              geometry={nodes.Ojos001.geometry}
              material={materials.EyeMaterial}
              skeleton={nodes.Ojos001.skeleton}
            />
            <skinnedMesh
              name="PañueloM001"
              geometry={nodes.PañueloM001.geometry}
              material={materials.TelaOscuraMaterial}
              skeleton={nodes.PañueloM001.skeleton}
            />
            <skinnedMesh
              name="PeloM001"
              geometry={nodes.PeloM001.geometry}
              material={materials.HairMaterial}
              skeleton={nodes.PeloM001.skeleton}
            />
            <skinnedMesh
              name="RopaM001"
              geometry={nodes.RopaM001.geometry}
              material={materials.TelaMaterial}
              skeleton={nodes.RopaM001.skeleton}
            />
            <primitive object={nodes.mixamorigHips} />
          </group>
        </group>
        <CapsuleCollider args={[0.6, 0.7]} position={[0, 2, 0]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Aldeano.glb");
export default NormalVillagerM;
