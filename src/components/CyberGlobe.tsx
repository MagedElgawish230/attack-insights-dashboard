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
          color="#f5d547"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.9}
          emissive="#f5d547"
          emissiveIntensity={0.6}
        />
      </Sphere>
      <pointLight position={[2, 2, 2]} intensity={1.2} color="#f5d547" />
      <pointLight position={[-2, -2, -2]} intensity={0.6} color="#d4a044" />
    </Float>
  );
};
