
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// Componente do personagem construtor
const ConstructorCharacter = () => {
  const groupRef = useRef<THREE.Group>(null);
  const briefcaseRef = useRef<THREE.Group>(null);

  // Animação de corrida
  useFrame((state) => {
    if (groupRef.current && briefcaseRef.current) {
      // Movimento de corrida
      const time = state.clock.getElapsedTime();
      groupRef.current.position.x = Math.sin(time * 2) * 0.1;
      groupRef.current.position.y = Math.abs(Math.sin(time * 4)) * 0.1;
      
      // Balançar a maleta
      briefcaseRef.current.rotation.z = Math.sin(time * 3) * 0.3;
      
      // Rotação suave do personagem
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Cabeça */}
      <Sphere args={[0.3]} position={[0, 1.5, 0]}>
        <meshPhongMaterial color="#FFD700" />
      </Sphere>
      
      {/* Capacete */}
      <Cylinder args={[0.35, 0.32, 0.2]} position={[0, 1.7, 0]}>
        <meshPhongMaterial color="#FF6B35" />
      </Cylinder>
      
      {/* Corpo */}
      <Box args={[0.6, 0.8, 0.3]} position={[0, 0.8, 0]}>
        <meshPhongMaterial color="#4A90E2" />
      </Box>
      
      {/* Braços */}
      <Cylinder args={[0.1, 0.1, 0.6]} position={[-0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshPhongMaterial color="#FFD700" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.6]} position={[0.4, 0.8, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <meshPhongMaterial color="#FFD700" />
      </Cylinder>
      
      {/* Pernas */}
      <Cylinder args={[0.12, 0.12, 0.7]} position={[-0.2, 0.1, 0]}>
        <meshPhongMaterial color="#2C3E50" />
      </Cylinder>
      <Cylinder args={[0.12, 0.12, 0.7]} position={[0.2, 0.1, 0]}>
        <meshPhongMaterial color="#2C3E50" />
      </Cylinder>
      
      {/* Pés */}
      <Box args={[0.2, 0.1, 0.3]} position={[-0.2, -0.25, 0.1]}>
        <meshPhongMaterial color="#8B4513" />
      </Box>
      <Box args={[0.2, 0.1, 0.3]} position={[0.2, -0.25, 0.1]}>
        <meshPhongMaterial color="#8B4513" />
      </Box>
      
      {/* Maleta */}
      <group ref={briefcaseRef} position={[0.6, 0.5, 0]}>
        <Box args={[0.3, 0.2, 0.1]}>
          <meshPhongMaterial color="#8B4513" />
        </Box>
        {/* Alça da maleta */}
        <Cylinder args={[0.02, 0.02, 0.2]} position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhongMaterial color="#654321" />
        </Cylinder>
      </group>
    </group>
  );
};

// Componente principal do personagem
export const ZurboCharacter = () => {
  return (
    <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
      <Canvas camera={{ position: [3, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />
        
        <ConstructorCharacter />
        
        {/* Controles desabilitados para não interferir na navegação */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};
