// src/components/Checkpoint.jsx
import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";

const Checkpoint = ({ position, checkpointId, onCheckpoint }) => {
  // Para evitar que se dispare varias veces el mismo checkpoint
  const triggered = useRef(false);

  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      sensor
      position={position}
      name="checkpoint"
      onIntersectionEnter ={({ other }) => {
        console.log(
          `⏩ Checkpoint ${checkpointId}: Se detectó colisión con`,
          other.rigidBodyObject?.name
        );
        // Supongamos que el jugador tiene el nombre "player"
        if (!triggered.current && other.rigidBodyObject?.name === "player") {
          triggered.current = true;
          console.log(`Checkpoint ${checkpointId} alcanzado`);
          if (onCheckpoint) {
            onCheckpoint(checkpointId);
          }
        }
      }}
    >
      {/* Puedes hacer el mesh invisible o darle algún material semitransparente para debug */}
      <mesh visible>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="red" transparent opacity={0.5} />
      </mesh>
    </RigidBody>
  );
};

export default Checkpoint;
