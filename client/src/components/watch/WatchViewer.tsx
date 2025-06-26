import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Html,
  useProgress
} from "@react-three/drei";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ZoomIn,
  ZoomOut,
  RotateCw, 
  Pause,
  Settings,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdvancedWatchRenderer from "./AdvancedWatchRenderer";
import { WatchPostProcessing, RenderingPerformanceMonitor } from "@/lib/postProcessing";
import * as THREE from 'three';

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
  const [renderQuality, setRenderQuality] = useState<'medium' | 'high' | 'ultra'>('high');
  const [showPerformance, setShowPerformance] = useState(false);
  const [fps, setFps] = useState(60);
  const performanceMonitor = useRef<RenderingPerformanceMonitor | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    performanceMonitor.current = new RenderingPerformanceMonitor();
    
    const updatePerformance = () => {
      if (performanceMonitor.current) {
        const currentFPS = performanceMonitor.current.update();
        setFps(currentFPS);
        
        // Auto-adjust quality based on performance
        const grade = performanceMonitor.current.getPerformanceGrade();
        if (grade === 'poor' && renderQuality !== 'medium') {
          setRenderQuality('medium');
        } else if (grade === 'excellent' && renderQuality === 'medium') {
          setRenderQuality('high');
        }
      }
      requestAnimationFrame(updatePerformance);
    };
    
    updatePerformance();
  }, [renderQuality]);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.5, 10));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.5, 2));
  };

  const toggleRotation = () => {
    setRotating(!rotating);
  };

  const cycleQuality = () => {
    const qualities: ('medium' | 'high' | 'ultra')[] = ['medium', 'high', 'ultra'];
    const currentIndex = qualities.indexOf(renderQuality);
    const nextIndex = (currentIndex + 1) % qualities.length;
    setRenderQuality(qualities[nextIndex]);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-green-600';
      case 'ultra': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 40) return 'text-yellow-600';
    if (fps >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="relative w-full h-[60vh] lg:h-[90vh]">
      <Canvas 
        ref={canvasRef}
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          antialias: renderQuality !== 'medium',
          powerPreference: 'high-performance',
          alpha: false,
          preserveDrawingBuffer: true,
          stencil: false,
          depth: true
        }}
      >
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera makeDefault position={[0, 2, zoom]} fov={45} />
          
          {/* Enhanced lighting setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={2.5}
            castShadow
            shadow-mapSize-width={renderQuality === 'ultra' ? 4096 : 2048}
            shadow-mapSize-height={renderQuality === 'ultra' ? 4096 : 2048}
            shadow-camera-near={0.1}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0001}
          />
          <directionalLight
            position={[-8, 5, -5]}
            intensity={1.2}
            color="#4A90E2"
          />
          <directionalLight
            position={[0, 0, -10]}
            intensity={0.8}
            color="#FFE4B5"
          />
          
          {/* Use advanced renderer */}
          <AdvancedWatchRenderer rotating={rotating} />
          
          {/* Enhanced environment */}
          <Environment 
            preset="studio"
            background={false}
            resolution={renderQuality === 'ultra' ? 1024 : 512}
          />
          
          {/* Enhanced orbit controls */}
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={rotating}
            autoRotateSpeed={0.8}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.4}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.6}
            panSpeed={0.8}
          />
          
          {/* Subtle fog for depth */}
          <fog attach="fog" args={['#f8f8f8', 15, 40]} />
        </Suspense>
      </Canvas>

      {/* Enhanced Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomOut}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomIn}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleRotation}
          className={cn(
            "h-8 w-8 rounded-full hover:bg-gray-100",
            rotating ? "text-blue-600" : "text-gray-500"
          )}
          aria-label={rotating ? "Pause rotation" : "Start rotation"}
        >
          {rotating ? <Pause size={16} /> : <RotateCw size={16} />}
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={cycleQuality}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          aria-label="Change render quality"
        >
          <Settings size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowPerformance(!showPerformance)}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          aria-label="Toggle performance info"
        >
          <Eye size={16} />
        </Button>
      </div>

      {/* Performance and Quality Info */}
      {showPerformance && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span>Quality:</span>
            <Badge variant="outline" className={cn("text-xs", getQualityColor(renderQuality))}>
              {renderQuality.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>FPS:</span>
            <Badge variant="outline" className={cn("text-xs", getPerformanceColor(fps))}>
              {Math.round(fps)}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Grade:</span>
            <Badge variant="outline" className="text-xs text-gray-300">
              {performanceMonitor.current?.getPerformanceGrade().toUpperCase() || 'GOOD'}
            </Badge>
          </div>
        </div>
      )}

      {/* Enhanced Instructions */}
      {!dragMode && (
        <div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg pointer-events-none border border-white/20"
          onAnimationEnd={() => setDragMode(true)}
        >
          <div className="flex items-center gap-2">
            <RotateCw size={16} />
            <span>Drag to rotate • Scroll to zoom</span>
          </div>
        </div>
      )}
    </div>
  );
}
