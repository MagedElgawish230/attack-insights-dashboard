import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { BlackHole } from "./BlackHole";

interface Attack {
  id: number;
  type: string;
  severity: string;
  ip: string;
  time: string;
  status: string;
  payload: string;
}

interface Scene3DProps {
  attacks: Attack[];
}

export const Scene3D = ({ attacks }: Scene3DProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-primary/30 bg-background/50 relative">
      {/* Darker background for space effect */}
      <div className="absolute inset-0 bg-[#000000] -z-10" />
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 4, 12]} />
        {/* We don't need much ambient light, space is dark */}
        <ambientLight intensity={0.1} />
        <BlackHole attacks={attacks} />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.2}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};
