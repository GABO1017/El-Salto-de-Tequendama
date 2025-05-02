// src/components/Checkpoint.jsx
import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";

const Checkpoint = ({ position, checkpointId, onCheckpoint, equippedTool }) => {
  const triggered = useRef(false);

  return (
    <RigidBody
      key={equippedTool ? "sensor" : "solid"}
      type="fixed"
      colliders="cuboid"
      sensor={!!equippedTool} // sensor solo si tiene arma
      position={position}
      rotation={[0, -0.25, 0]}
      name="checkpoint"
      onIntersectionEnter={({ other }) => {
        if (!triggered.current && other.rigidBodyObject?.name === "player") {
          triggered.current = true;

          if (onCheckpoint) {
            onCheckpoint(checkpointId);
          }
        }
      }}
    >
      <mesh visible>
        <boxGeometry args={[220, 20, 2]} />
        <meshBasicMaterial
          transparent
          opacity={0}
        />
      </mesh>
    </RigidBody>
  );
};

export default Checkpoint;
