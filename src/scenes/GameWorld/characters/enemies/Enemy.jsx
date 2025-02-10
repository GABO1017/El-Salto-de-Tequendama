import React from "react";
import { RigidBody } from "@react-three/rapier";

const Enemy = ({ position, onPlayerCollide }) => {
  return (
    <RigidBody
      colliders="cuboid"
      type="fixed"
      gravityScale={1.5}
      position={position}
      onCollisionEnter={({ other }) => {
        if (onPlayerCollide) {
          onPlayerCollide(other);
        }
      }}
    >
      <mesh>
        <boxGeometry args={[2, 2, 2]} /> {/* Cubo de 2x2x2 */}
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
};

export default Enemy;
