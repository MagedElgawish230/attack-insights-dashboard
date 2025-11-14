import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

export const CyberGlobe = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#00d9ff"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.4}
          metalness={0.8}
          emissive="#00d9ff"
          emissiveIntensity={0.5}
        />
      </Sphere>
      <pointLight position={[2, 2, 2]} intensity={1} color="#00d9ff" />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color="#ff0055" />
    </Float>
  );
};
