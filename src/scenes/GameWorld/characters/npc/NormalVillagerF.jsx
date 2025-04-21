import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export function NormalVillagerF({
  animation,
  setSubtitles,
  setObjective,
  playerRef,
  ...props
}) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Aldeana.glb");
  const { actions } = useAnimations(animations, group);
  const villagerRef = useRef();
  const bodyRef = useRef();
  const isTouchingPlayer = useRef(false);

  const dialogueLines = [
    "Estamos recolectando hierbas sagradas.",
    "Algo extraño sucede en las montañas.",
    "Debes tener cuidado con los espíritus del bosque.",
    "Busca la sabiduría de los ancestros en los templos.",
    "Dicen que los árboles susurran secretos al anochecer."
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

    if (actions["Talking1"]) {
      actions[animation]?.fadeOut(0.2);
      actions["Talking1"].reset().fadeIn(0.2).play();

      setTimeout(() => {
        actions["Talking1"]?.stop();
        if (actions[animation]) {
          actions[animation].reset().fadeIn(0.1).play();
        }
      }, 4000);
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
