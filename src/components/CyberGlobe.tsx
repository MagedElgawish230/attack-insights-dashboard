import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

interface Attack {
  id: number;
  type: string;
  severity: string;
  ip: string;
  time: string;
  status: string;
  payload: string;
}

interface CyberGlobeProps {
  attacks: Attack[];
}

const AttackMarker = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
};

// Helper to generate random position on sphere surface
const getPosition = (ip: string, radius: number): [number, number, number] => {
  // Simple hash of IP to get deterministic angles
  const hash = ip.split('.').reduce((acc, part) => acc + parseInt(part), 0);
  const phi = Math.acos(-1 + (2 * (hash % 100)) / 100);
  const theta = Math.sqrt(Math.PI * (hash % 100)) * phi;

  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi),
  ];
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return '#ef4444'; // red-500
    case 'high': return '#f97316'; // orange-500
    case 'medium': return '#3b82f6'; // blue-500
    default: return '#22c55e'; // green-500
  }
};

export const CyberGlobe = ({ attacks }: CyberGlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
    if (groupRef.current) {
      // Rotate markers with the globe
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group>
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
        <group ref={groupRef}>
          {attacks.map((attack) => (
            <AttackMarker
              key={attack.id}
              position={getPosition(attack.ip, 1.5)}
              color={getSeverityColor(attack.severity)}
            />
          ))}
        </group>
        <pointLight position={[2, 2, 2]} intensity={1.2} color="#f5d547" />
        <pointLight position={[-2, -2, -2]} intensity={0.6} color="#d4a044" />
      </Float>
    </group>
  );
};

