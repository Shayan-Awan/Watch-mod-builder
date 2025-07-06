import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";

export interface EnvironmentalConditions {
  temperature: number; // Celsius
  humidity: number; // 0-1
  pressure: number; // hPa
  magneticField: number; // µT
  vibration: number; // g-force
  uv: number; // UV index 0-11
  altitude: number; // meters
}

export class WatchEnvironmentalSimulation {
  private conditions: EnvironmentalConditions;
  private timeAccumulator = 0;
  private condensationLevel = 0;
  private thermalExpansion = new Map<string, number>();
  private magneticInterference = 0;

  constructor() {
    this.conditions = {
      temperature: 25,
      humidity: 0.5,
      pressure: 1013.25,
      magneticField: 50,
      vibration: 0,
      uv: 3,
      altitude: 0,
    };
  }

  update(deltaTime: number): {
    condensation: number;
    thermalStress: number;
    magneticError: number;
    materialExpansion: Map<string, number>;
    fogLevel: number;
    temperatureGradient: THREE.Vector3;
  } {
    this.timeAccumulator += deltaTime;

    // Condensation simulation
    const dewPoint = this.calculateDewPoint();
    if (this.conditions.temperature <= dewPoint + 2) {
      this.condensationLevel = Math.min(
        this.condensationLevel + deltaTime * 0.1,
        this.conditions.humidity
      );
    } else {
      this.condensationLevel = Math.max(
        this.condensationLevel - deltaTime * 0.05,
        0
      );
    }

    // Thermal expansion calculations
    const baseTemp = 20; // Reference temperature
    const tempDiff = this.conditions.temperature - baseTemp;

    this.thermalExpansion.set("steel", tempDiff * 17e-6);
    this.thermalExpansion.set("titanium", tempDiff * 8.6e-6);
    this.thermalExpansion.set("gold", tempDiff * 14e-6);
    this.thermalExpansion.set("ceramic", tempDiff * 7e-6);

    // Magnetic interference
    this.magneticInterference =
      Math.max(0, this.conditions.magneticField - 50) / 1000;

    // Thermal stress
    const thermalStress = Math.abs(tempDiff) / 100;

    // Fog simulation based on humidity and temperature
    const fogLevel =
      this.conditions.humidity > 0.8 && this.conditions.temperature < 15
        ? 0.5
        : 0;

    // Temperature gradient (for realistic heat distribution)
    const gradient = new THREE.Vector3(
      Math.sin(this.timeAccumulator * 0.1) * tempDiff * 0.1,
      Math.cos(this.timeAccumulator * 0.15) * tempDiff * 0.1,
      tempDiff * 0.05
    );

    return {
      condensation: this.condensationLevel,
      thermalStress,
      magneticError: this.magneticInterference,
      materialExpansion: new Map(this.thermalExpansion),
      fogLevel,
      temperatureGradient: gradient,
    };
  }

  private calculateDewPoint(): number {
    const a = 17.27;
    const b = 237.7;
    const alpha =
      (a * this.conditions.temperature) / (b + this.conditions.temperature) +
      Math.log(this.conditions.humidity);
    return (b * alpha) / (a - alpha);
  }

  setConditions(newConditions: Partial<EnvironmentalConditions>) {
    this.conditions = { ...this.conditions, ...newConditions };
  }
}

export class AtmosphericScattering {
  private wavelengths = {
    red: 700e-9,
    green: 550e-9,
    blue: 450e-9,
  };

  private rayleighCoeff = 1e-5;
  private mieCoeff = 2e-6;

  calculateScattering(
    sunAngle: number,
    altitude: number
  ): {
    skyColor: THREE.Color;
    sunColor: THREE.Color;
    atmosphericPerspective: number;
  } {
    // Atmospheric density decreases with altitude
    const density = Math.exp(-altitude / 8400); // Scale height ~8.4km

    // Rayleigh scattering (blue sky)
    const rayleighR =
      (this.rayleighCoeff * density) / Math.pow(this.wavelengths.red, 4);
    const rayleighG =
      (this.rayleighCoeff * density) / Math.pow(this.wavelengths.green, 4);
    const rayleighB =
      (this.rayleighCoeff * density) / Math.pow(this.wavelengths.blue, 4);

    // Mie scattering (haze/pollution)
    const mieScattering = this.mieCoeff * density;

    // Sun position effects
    const airMass = 1 / Math.max(Math.sin(sunAngle), 0.1);

    // Sky color calculation
    const skyIntensity = Math.max(0.1, Math.sin(sunAngle));
    const skyColor = new THREE.Color(
      0.3 + rayleighB * skyIntensity,
      0.5 + rayleighG * skyIntensity * 0.8,
      0.8 + rayleighB * skyIntensity * 0.6
    );

    // Sun color (warmer at horizon)
    const extinction = Math.exp(-airMass * (rayleighG + mieScattering));
    const sunColor = new THREE.Color(
      1.0,
      0.9 * extinction + 0.1,
      0.7 * extinction + 0.3
    );

    const atmosphericPerspective = 1 - Math.exp(-airMass * 0.1);

    return {
      skyColor,
      sunColor,
      atmosphericPerspective,
    };
  }
}

export class WaterDropletSimulation {
  private droplets: Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    size: number;
    life: number;
  }> = [];

  update(
    deltaTime: number,
    windSpeed: THREE.Vector3,
    gravity = -9.81
  ): THREE.Vector3[] {
    // Add new droplets
    if (Math.random() < 0.1) {
      this.droplets.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          3 + Math.random(),
          (Math.random() - 0.5) * 4
        ),
        velocity: windSpeed
          .clone()
          .add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              -Math.random() * 5,
              (Math.random() - 0.5) * 2
            )
          ),
        size: 0.01 + Math.random() * 0.02,
        life: 1.0,
      });
    }

    // Update existing droplets
    this.droplets = this.droplets.filter((droplet) => {
      droplet.velocity.y += gravity * deltaTime;
      droplet.position.add(droplet.velocity.clone().multiplyScalar(deltaTime));
      droplet.life -= deltaTime * 0.5;

      return droplet.life > 0 && droplet.position.y > -2;
    });

    return this.droplets.map((d) => d.position);
  }

  getDropletData() {
    return this.droplets.map((d) => ({
      position: d.position.clone(),
      size: d.size,
      opacity: d.life,
    }));
  }
}

export function useEnvironmentalSimulation() {
  const envSimRef = useRef(new WatchEnvironmentalSimulation());
  const scatteringRef = useRef(new AtmosphericScattering());
  const dropletsRef = useRef(new WaterDropletSimulation());

  const [environmentalState, setEnvironmentalState] = useState({
    condensation: 0,
    thermalStress: 0,
    magneticError: 0,
    materialExpansion: new Map<string, number>(),
    fogLevel: 0,
    temperatureGradient: new THREE.Vector3(),
    skyColor: new THREE.Color(0.5, 0.7, 1.0),
    sunColor: new THREE.Color(1.0, 0.9, 0.8),
    atmosphericPerspective: 0.1,
    rainDroplets: [] as THREE.Vector3[],
  });

  const [conditions, setConditions] = useState<EnvironmentalConditions>({
    temperature: 25,
    humidity: 0.5,
    pressure: 1013.25,
    magneticField: 50,
    vibration: 0,
    uv: 3,
    altitude: 0,
  });

  useFrame((state, delta) => {
    // Update environmental simulation
    envSimRef.current.setConditions(conditions);
    const envData = envSimRef.current.update(delta);

    // Calculate atmospheric effects
    const sunAngle = Math.max(0.1, Math.sin(state.clock.elapsedTime * 0.1));
    const scattering = scatteringRef.current.calculateScattering(
      sunAngle,
      conditions.altitude
    );

    // Update rain simulation if humid
    const windSpeed = new THREE.Vector3(
      Math.sin(state.clock.elapsedTime * 0.3) * 2,
      0,
      Math.cos(state.clock.elapsedTime * 0.2) * 1.5
    );

    let rainDroplets: THREE.Vector3[] = [];
    if (conditions.humidity > 0.8) {
      rainDroplets = dropletsRef.current.update(delta, windSpeed);
    }

    setEnvironmentalState({
      ...envData,
      ...scattering,
      rainDroplets,
    });
  });

  return {
    environmental: environmentalState,
    setConditions,
    conditions,
  };
}

export class LuminousSimulation {
  private luminousIntensity = 1.0;
  private chargeLevel = 1.0;
  private decayRate = 0.001; // per second

  update(
    deltaTime: number,
    uvExposure: number
  ): {
    intensity: number;
    color: THREE.Color;
    chargeLevel: number;
  } {
    // Charge from UV exposure
    this.chargeLevel = Math.min(
      1.0,
      this.chargeLevel + uvExposure * deltaTime * 0.1
    );

    // Natural decay
    this.chargeLevel = Math.max(
      0.0,
      this.chargeLevel - this.decayRate * deltaTime
    );

    // Intensity based on charge
    this.luminousIntensity = this.chargeLevel * this.chargeLevel; // Exponential decay

    // Color shifts from green to blue as it fades
    const color = new THREE.Color();
    color.setHSL(
      0.33 - (1 - this.chargeLevel) * 0.1, // Green to cyan
      1.0,
      0.5 * this.luminousIntensity
    );

    return {
      intensity: this.luminousIntensity,
      color,
      chargeLevel: this.chargeLevel,
    };
  }

  expose(uvIntensity: number, duration: number) {
    this.chargeLevel = Math.min(
      1.0,
      this.chargeLevel + uvIntensity * duration * 0.01
    );
  }
}

export function useLuminousSimulation(uvExposure = 0.3) {
  const luminousRef = useRef(new LuminousSimulation());
  const [luminousState, setLuminousState] = useState({
    intensity: 1.0,
    color: new THREE.Color(0, 1, 0),
    chargeLevel: 1.0,
  });

  useFrame((state, delta) => {
    const newState = luminousRef.current.update(delta, uvExposure);
    setLuminousState(newState);
  });

  return {
    luminous: luminousState,
    expose: luminousRef.current.expose.bind(luminousRef.current),
  };
}
