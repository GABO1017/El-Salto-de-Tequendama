import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { PlaneGeometry, DoubleSide  } from 'three';

// Extiende las geometrías de Three.js para usarlas en R3F
extend({ PlaneGeometry });

const GameWorld = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 250, 10] }}>
        {/* Skybox */}
        <Sky sunPosition={[100, 20, 100]} />

        {/* Piso */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#4CAF50" side={DoubleSide}/>
        </mesh>

        {/* Luz ambiental y de dirección */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        {/* Controles de cámara */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default GameWorld;
