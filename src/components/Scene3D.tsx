import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CyberGlobe } from "./CyberGlobe";

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
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-primary/30 bg-background/50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.3} />
        <CyberGlobe attacks={attacks} />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};
