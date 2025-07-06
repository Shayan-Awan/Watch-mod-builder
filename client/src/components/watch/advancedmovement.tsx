import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useMaterialAging,
  useLightingSimulation,
  MATERIAL_DATABASE,
} from "@/lib/simulation/MaterialSimulation";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { watchComponents } from "@/data/watchComponents";
import AdvancedMovement from "./AdvancedMovement";

interface EnhancedWatchRendererProps {
  enableAging?: boolean;
  enableRealtimeLighting?: boolean;
  qualityLevel?: "medium" | "high" | "ultra";
}

export default function EnhancedWatchRenderer({
  enableAging = true,
  enableRealtimeLighting = true,
  qualityLevel = "high",
}: EnhancedWatchRendererProps) {
  const { config } = useWatchStore();
  const groupRef = useRef<THREE.Group>(null);
  const caseRef = useRef<THREE.Group>(null);
  const dialRef = useRef<THREE.Group>(null);
  const bezelRef = useRef<THREE.Group>(null);

  const [environment, setEnvironment] = useState({
    uv: 0.3,
    humidity: 0.5,
    temperature: 25,
    saltwater: 0,
  });

  // Material aging simulations
  const { materialState: caseAging, setEnvironment: setCaseEnv } =
    useMaterialAging("stainlessSteel");
  const { materialState: dialAging } = useMaterialAging("ceramic");
  const { materialState: bezelAging } = useMaterialAging("stainlessSteel");

  // Lighting simulation
  const { lighting, setTimeOfDay, setCloudCover, setIndoor } =
    useLightingSimulation();

  // Get selected components
  const selectedCase = watchComponents.case.find((c) => c.id === config.case);
  const selectedDial = watchComponents.dial.find((d) => d.id === config.dial);
  const selectedBezel = watchComponents.bezel.find(
    (b) => b.id === config.bezel
  );

  // Dynamic material creation based on aging
  const caseMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().copy(caseAging.colorShift).multiplyScalar(0.9),
      metalness: 0.95 - caseAging.corrosion * 0.3,
      roughness: 0.1 + caseAging.roughnessChange,
      clearcoat: 1.0 - caseAging.scratches * 0.5,
      clearcoatRoughness: caseAging.scratches * 0.3,
    });

    if (caseAging.wearTexture) {
      material.normalMap = caseAging.wearTexture;
      material.normalScale = new THREE.Vector2(0.5, 0.5);
    }

    return material;
  }, [caseAging]);

  const dialMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: selectedDial?.color || "#ffffff",
      metalness: 0.1,
      roughness: 0.3 + dialAging.roughnessChange,
      transmission: selectedDial?.name.includes("Transparent") ? 0.9 : 0,
      thickness: 0.5,
      ior: 1.5,
    });
  }, [selectedDial, dialAging]);

  const bezelMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().copy(bezelAging.colorShift).multiplyScalar(0.8),
      metalness: 0.9 - bezelAging.corrosion * 0.2,
      roughness: 0.15 + bezelAging.roughnessChange,
      clearcoat: 0.8 - bezelAging.scratches * 0.4,
    });
  }, [bezelAging]);

  // Crystal with realistic optical properties
  const crystalMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.0,
      roughness: 0.02 + caseAging.scratches * 0.1,
      transmission: 0.95,
      thickness: 0.8,
      ior: 1.77, // Sapphire crystal
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
    });
  }, [caseAging.scratches]);

  useFrame((state, delta) => {
    if (enableRealtimeLighting && groupRef.current) {
      // Update lighting environment
      const time = new Date().getHours() + new Date().getMinutes() / 60;
      setTimeOfDay(time);

      // Simulate cloud movement
      setCloudCover(0.3 + Math.sin(state.clock.elapsedTime * 0.1) * 0.2);
    }

    // Rotate watch slightly for dynamic reflections
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Directional Light with realistic sun simulation */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={lighting.intensity * 2}
        color={lighting.color}
        castShadow={qualityLevel !== "medium"}
        shadow-mapSize-width={qualityLevel === "ultra" ? 4096 : 2048}
        shadow-mapSize-height={qualityLevel === "ultra" ? 4096 : 2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Ambient lighting with color temperature */}
      <ambientLight
        intensity={lighting.intensity * 0.3}
        color={lighting.color}
      />

      {/* Point lights for studio-style illumination */}
      <pointLight
        position={[-5, 5, 5]}
        intensity={lighting.intensity * 0.8}
        color={lighting.color}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[5, -5, 5]}
        intensity={lighting.intensity * 0.6}
        color={lighting.color}
        distance={15}
        decay={2}
      />

      {/* Watch Case */}
      <group ref={caseRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.6, 32, 1]} />
          <primitive object={caseMaterial} />
        </mesh>

        {/* Case side detail */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1.85, 1.75, 0.65, 32, 1]} />
          <primitive object={caseMaterial} />
        </mesh>

        {/* Crown */}
        <mesh castShadow position={[1.9, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
          <primitive object={caseMaterial} />
        </mesh>

        {/* Lugs */}
        {[0, Math.PI].map((angle, i) => (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh castShadow position={[0, 2.2, 0]}>
              <boxGeometry args={[0.3, 0.6, 0.4]} />
              <primitive object={caseMaterial} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Watch Dial */}
      <group ref={dialRef}>
        <mesh receiveShadow position={[0, 0, 0.31]}>
          <cylinderGeometry args={[1.6, 1.6, 0.02, 64]} />
          <primitive object={dialMaterial} />
        </mesh>

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const isMainHour = i % 3 === 0;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0.32]}
              rotation={[0, 0, -angle]}
              castShadow
            >
              <boxGeometry
                args={isMainHour ? [0.12, 0.04, 0.02] : [0.08, 0.02, 0.015]}
              />
              <meshPhysicalMaterial
                color="#333333"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}

        {/* Brand logo area */}
        <mesh position={[0, 0.6, 0.32]}>
          <planeGeometry args={[0.8, 0.2]} />
          <meshPhysicalMaterial
            color="#222222"
            metalness={0.1}
            roughness={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Watch Bezel */}
      <group ref={bezelRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0.35]}>
          <cylinderGeometry args={[1.9, 1.9, 0.1, 64]} />
          <primitive object={bezelMaterial} />
        </mesh>

        {/* Bezel markings */}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) {
            const angle = (i / 60) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 1.85,
                  Math.sin(angle) * 1.85,
                  0.35,
                ]}
                rotation={[0, 0, -angle]}
                castShadow
              >
                <boxGeometry args={[0.06, 0.02, 0.08]} />
                <meshPhysicalMaterial
                  color="#111111"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            );
          }
          return null;
        })}
      </group>

      {/* Crystal */}
      <mesh position={[0, 0, 0.4]} receiveShadow>
        <cylinderGeometry args={[1.75, 1.75, 0.08, 64]} />
        <primitive object={crystalMaterial} />
      </mesh>

      {/* Advanced Movement Component */}
      <AdvancedMovement
        movementType="mechanical"
        isRunning={true}
        powerReserve={42}
      />

      {/* Reflection probe for realistic reflections */}
      <mesh visible={false} position={[0, 0, 0]}>
        <sphereGeometry args={[10]} />
        <meshBasicMaterial side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
