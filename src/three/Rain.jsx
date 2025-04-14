// Rain.jsx
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const Rain = ({ count = 20000, areaSize = 1000, fallSpeed = 10 }) => {
  const rainRef = useRef();
  // Genera posiciones aleatorias para cada gota
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * areaSize;
      pos[i * 3 + 1] = Math.random() * areaSize;
      pos[i * 3 + 2] = (Math.random() - 0.5) * areaSize;
    }
    return pos;
  }, [count, areaSize]);

  useFrame((state, delta) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= delta * fallSpeed;
        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = areaSize;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="lightblue"
        size={0.2}  // Puedes ajustar este valor para ver mejor las gotas
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
};

export default Rain;
