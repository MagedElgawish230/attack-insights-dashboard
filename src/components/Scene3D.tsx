import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CyberGlobe } from "./CyberGlobe";

export const Scene3D = () => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-primary/30 bg-background/50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.3} />
        <CyberGlobe />
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
