import { Canvas } from "@react-three/fiber";
import ThreeDWatch from "./ThreeDWatch";
import { Suspense, useState } from "react";
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Html,
  useProgress
} from "@react-three/drei";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { Button } from "@/components/ui/button";
import { 
  ZoomIn,
  ZoomOut,
  RotateCw, 
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-[#14213D] font-medium">
        Loading {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function WatchViewer() {
  const { zoom, setZoom, rotating, setRotating } = useWatchStore();
  const [dragMode, setDragMode] = useState(false);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.5, 10));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.5, 2));
  };

  const toggleRotation = () => {
    setRotating(!rotating);
  };

  return (
    <div className="relative w-full h-[60vh] lg:h-[90vh]">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera makeDefault position={[0, 0, zoom]} fov={40} />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <ThreeDWatch rotating={rotating} />
          <Environment preset="studio" />
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={rotating}
            autoRotateSpeed={1}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomOut}
          className="h-8 w-8 rounded-full"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomIn}
          className="h-8 w-8 rounded-full"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </Button>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleRotation}
          className={cn(
            "h-8 w-8 rounded-full",
            rotating ? "text-[#FCA311]" : "text-gray-500"
          )}
          aria-label={rotating ? "Pause rotation" : "Start rotation"}
        >
          {rotating ? <Pause size={16} /> : <RotateCw size={16} />}
        </Button>
      </div>

      {/* Drag instruction */}
      {!dragMode && (
        <div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none"
          onAnimationEnd={() => setDragMode(true)}
        >
          Click and drag to rotate
        </div>
      )}
    </div>
  );
}
