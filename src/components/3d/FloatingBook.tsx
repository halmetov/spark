import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

function Book({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#4F7DF3' }: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + rotation[1];
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} rotation={rotation as unknown as THREE.Euler}>
        <mesh ref={meshRef}>
          {/* Book cover */}
          <RoundedBox args={[1.2, 1.6, 0.15]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
          </RoundedBox>
          {/* Book spine highlight */}
          <mesh position={[-0.55, 0, 0]}>
            <boxGeometry args={[0.1, 1.55, 0.14]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Pages */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[1, 1.5, 0.12]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.9} />
          </mesh>
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#fff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#c4d4ff" />
      
      <Book position={[-2, 0.5, 0]} rotation={[0.2, 0.5, 0.1]} color="#4F7DF3" />
      <Book position={[2, -0.5, -1]} rotation={[-0.1, -0.3, -0.1]} color="#8B5CF6" />
      <Book position={[0, 1, -2]} rotation={[0.1, 0.8, 0]} color="#06B6D4" />
    </>
  );
}

export function FloatingBooks() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
