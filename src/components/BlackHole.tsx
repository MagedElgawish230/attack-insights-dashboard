import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Torus, Stars, Html } from "@react-three/drei";
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

interface BlackHoleProps {
    attacks: Attack[];
    isPaused?: boolean;
}

const PARTICLE_COUNT = 100;

interface ParticleData {
    id: number;
    angle: number;
    radius: number;
    speed: number;
    yOffset: number;
    color: string;
    size: number;
    attack?: Attack; // Link to actual attack data
}

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'critical': return '#ef4444'; // Red
        case 'high': return '#f97316'; // Orange
        case 'medium': return '#eab308'; // Yellow
        default: return '#3b82f6'; // Blue
    }
};

export const BlackHole = ({ attacks, isPaused = false }: BlackHoleProps) => {
    const diskRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Group>(null);
    const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);

    // Initialize particles
    const particles = useMemo(() => {
        const temp: ParticleData[] = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Map to an attack if available, cycling through if fewer attacks than particles
            const attack = attacks.length > 0 ? attacks[i % attacks.length] : undefined;

            temp.push({
                id: i,
                angle: Math.random() * Math.PI * 2,
                radius: 3 + Math.random() * 5, // Start between radius 3 and 8
                speed: 0.2 + Math.random() * 0.5,
                yOffset: (Math.random() - 0.5) * 0.5, // Thin disk
                color: attack ? getSeverityColor(attack.severity) : '#64748b',
                size: Math.random() * 0.05 + 0.02,
                attack: attack
            });
        }
        return temp;
    }, [attacks]); // Re-run if attacks change to update colors

    // ... (existing code)

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Rotate accretion disk
        if (diskRef.current) {
            diskRef.current.rotation.z = time * 0.1;
        }

        // Update particles
        if (particlesRef.current) {
            // If the scene is paused via prop (parent hover) or local hover, do not update positions
            const shouldPause = isPaused || hoveredParticle !== null;

            particlesRef.current.children.forEach((child, i) => {
                const particle = particles[i];

                // We always update scale so they stay visible
                const userData = child.userData as { radius: number; angle: number; speed: number; initialRadius: number };

                // Initialize if needed
                if (!userData.radius) {
                    userData.radius = particle.radius;
                    userData.angle = particle.angle;
                    userData.speed = particle.speed;
                    userData.initialRadius = particle.radius;
                }

                // Only move if not paused
                if (!shouldPause) {
                    // Move inwards
                    userData.radius -= userData.speed * 0.01;
                    // Spiral rotation
                    userData.angle += (userData.speed * 0.02) * (5 / userData.radius);

                    // Reset if hit event horizon
                    if (userData.radius < 1.2) {
                        userData.radius = userData.initialRadius;
                    }

                    // Update Mesh position
                    child.position.x = userData.radius * Math.cos(userData.angle);
                    child.position.z = userData.radius * Math.sin(userData.angle);
                    child.position.y = particle.yOffset + Math.sin(time + particle.id) * 0.1;
                }

                // Update visual scale (always do this so they don't pop/disappear)
                child.scale.x = (5 / userData.radius) * particle.size;
                child.scale.y = particle.size;
                child.scale.z = particle.size;

                child.lookAt(0, 0, 0);
            });
        }
    });

    return (
        <group rotation={[0.4, 0, 0]}> {/* Tilt the whole system to see the disk better */}
            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />

            {/* Event Horizon (Black Hole) */}
            <Sphere args={[1, 32, 32]}>
                <meshStandardMaterial color="#000000" roughness={0} metalness={0} />
            </Sphere>

            {/* Event Horizon Glow (Rim) */}
            <Sphere args={[1.05, 32, 32]}>
                <meshBasicMaterial color="#fcd34d" transparent opacity={0.1} side={THREE.BackSide} />
            </Sphere>

            {/* Accretion Disk - Visual Ring */}
            <group ref={diskRef}>
                <Torus args={[2.5, 0.5, 16, 100]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.1]}>
                    <meshStandardMaterial
                        color="#f59e0b"
                        emissive="#f59e0b"
                        emissiveIntensity={0.5}
                        roughness={0.4}
                        transparent
                        opacity={0.6}
                    />
                </Torus>
            </group>
            {/* Particles (Attacks) */}
            <group ref={particlesRef}>
                {particles.map((p, i) => (
                    <mesh
                        key={i}
                        position={[p.radius * Math.cos(p.angle), p.yOffset, p.radius * Math.sin(p.angle)]}
                        onPointerOver={(e) => { e.stopPropagation(); setHoveredParticle(i); }}
                        onPointerOut={() => setHoveredParticle(null)}
                    >
                        {/* Larger geometry for better hit detection, visual size controlled by scale */}
                        <sphereGeometry args={[2, 8, 8]} />
                        <meshBasicMaterial color={p.color} toneMapped={false} />
                        {hoveredParticle === i && p.attack && (
                            <Html distanceFactor={10}>
                                <div className="bg-slate-900/90 text-white p-2 rounded-md border border-slate-700 text-xs w-32 backdrop-blur-sm pointer-events-none select-none">
                                    <div className="font-bold text-amber-500 mb-1">{p.attack.type}</div>
                                    <div className="text-gray-300">IP: {p.attack.ip}</div>
                                    <div className={`mt-1 capitalize ${p.attack.severity === 'critical' ? 'text-red-400' :
                                        p.attack.severity === 'high' ? 'text-orange-400' :
                                            'text-blue-400'
                                        }`}>
                                        {p.attack.severity} Severity
                                    </div>
                                </div>
                            </Html>
                        )}
                    </mesh>
                ))}
            </group>

            {/* Strong Light from Center */}
            <pointLight position={[0, 0, 0]} intensity={2} color="#f59e0b" distance={10} />
            <ambientLight intensity={0.2} />
        </group >
    );
};
