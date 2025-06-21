
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simplified 3D character component
const SimpleCharacter = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Simple animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(time * 2) * 0.2;
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshPhongMaterial color="#FFD700" />
      </mesh>
      
      {/* Hard hat */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.35, 0.32, 0.2]} />
        <meshPhongMaterial color="#FF6B35" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshPhongMaterial color="#4A90E2" />
      </mesh>
      
      {/* Left arm */}
      <mesh position={[-0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshPhongMaterial color="#FFD700" />
      </mesh>
      
      {/* Right arm */}
      <mesh position={[0.4, 0.8, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshPhongMaterial color="#FFD700" />
      </mesh>
      
      {/* Left leg */}
      <mesh position={[-0.2, 0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.7]} />
        <meshPhongMaterial color="#2C3E50" />
      </mesh>
      
      {/* Right leg */}
      <mesh position={[0.2, 0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.7]} />
        <meshPhongMaterial color="#2C3E50" />
      </mesh>
      
      {/* Briefcase */}
      <mesh position={[0.6, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshPhongMaterial color="#8B4513" />
      </mesh>
    </group>
  );
};

// Main character component with error boundary
export const ZurboCharacter = () => {
  return (
    <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
      <Canvas 
        camera={{ position: [3, 2, 5], fov: 60 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent background
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />
        
        <SimpleCharacter />
      </Canvas>
    </div>
  );
};
