import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";

export interface ManufacturingProcess {
  processType: "machining" | "additive" | "casting" | "forging" | "etching";
  tolerances: number[];
  surfaceFinish: number;
  materialStress: THREE.Vector3;
  temperature: number;
  duration: number;
}

export class DigitalTwinManufacturing {
  private machineParameters: Map<
    string,
    {
      precision: number;
      speed: number;
      powerConsumption: number;
      wearRate: number;
      operatingTemp: number;
    }
  > = new Map();

  private qualityMetrics: {
    dimensionalAccuracy: number;
    surfaceRoughness: number;
    materialProperties: number;
    defectRate: number;
  };

  constructor() {
    this.initializeMachines();
    this.qualityMetrics = {
      dimensionalAccuracy: 0.95,
      surfaceRoughness: 0.1, // Ra in micrometers
      materialProperties: 0.98,
      defectRate: 0.02,
    };
  }

  private initializeMachines() {
    // CNC Machining Center
    this.machineParameters.set("cnc_mill", {
      precision: 0.002, // ±2 micrometers
      speed: 10000, // RPM
      powerConsumption: 15, // kW
      wearRate: 0.001, // mm per hour
      operatingTemp: 25,
    });

    // 3D Printer (SLA)
    this.machineParameters.set("sla_printer", {
      precision: 0.025, // ±25 micrometers
      speed: 0.05, // mm/s layer speed
      powerConsumption: 0.4, // kW
      wearRate: 0.0001, // virtually no wear
      operatingTemp: 30,
    });

    // EDM Machine
    this.machineParameters.set("edm", {
      precision: 0.001, // ±1 micrometer
      speed: 2, // mm/min
      powerConsumption: 8, // kW
      wearRate: 0.0001, // electrode wear
      operatingTemp: 25,
    });

    // Investment Casting
    this.machineParameters.set("investment_casting", {
      precision: 0.1, // ±100 micrometers
      speed: 0.001, // Very slow process
      powerConsumption: 50, // kW for furnace
      wearRate: 0.01, // Mold degradation
      operatingTemp: 1200, // Casting temperature
    });
  }

  simulateManufacturing(
    process: ManufacturingProcess,
    geometry: {
      vertices: THREE.Vector3[];
      faces: number[][];
      volume: number;
      surfaceArea: number;
    },
    material: {
      hardness: number;
      density: number;
      thermalConductivity: number;
      yieldStrength: number;
    }
  ): {
    manufacturingTime: number;
    cost: number;
    qualityPrediction: {
      dimensionalAccuracy: number;
      surfaceFinish: number;
      defectProbability: number;
    };
    processParameters: {
      toolpath: THREE.Vector3[];
      forces: THREE.Vector3[];
      temperatures: number[];
      vibrations: number[];
    };
    materialRemoval: number;
  } {
    const machine = this.machineParameters.get(
      this.getOptimalMachine(process, material)
    );
    if (!machine) throw new Error("No suitable machine found");

    // Calculate manufacturing time
    let manufacturingTime = 0;
    const processParameters = {
      toolpath: [] as THREE.Vector3[],
      forces: [] as THREE.Vector3[],
      temperatures: [] as number[],
      vibrations: [] as number[],
    };

    switch (process.processType) {
      case "machining":
        manufacturingTime = this.simulateMachining(
          geometry,
          material,
          machine,
          processParameters
        );
        break;
      case "additive":
        manufacturingTime = this.simulateAdditive(
          geometry,
          material,
          machine,
          processParameters
        );
        break;
      case "casting":
        manufacturingTime = this.simulateCasting(
          geometry,
          material,
          machine,
          processParameters
        );
        break;
      case "forging":
        manufacturingTime = this.simulateForging(
          geometry,
          material,
          machine,
          processParameters
        );
        break;
      case "etching":
        manufacturingTime = this.simulateEtching(
          geometry,
          material,
          machine,
          processParameters
        );
        break;
    }

    // Calculate costs
    const materialCost = geometry.volume * material.density * 0.001 * 50; // $50/kg estimate
    const machineCost = manufacturingTime * machine.powerConsumption * 0.15; // $0.15/kWh
    const laborCost = manufacturingTime * 75; // $75/hour
    const totalCost = materialCost + machineCost + laborCost;

    // Predict quality
    const qualityPrediction = this.predictQuality(
      process,
      material,
      machine,
      manufacturingTime
    );

    // Calculate material removal for subtractive processes
    const materialRemoval =
      process.processType === "machining" ? geometry.volume * 0.3 : 0; // 30% material removal typical for machining

    return {
      manufacturingTime,
      cost: totalCost,
      qualityPrediction,
      processParameters,
      materialRemoval,
    };
  }

  private getOptimalMachine(
    process: ManufacturingProcess,
    material: any
  ): string {
    switch (process.processType) {
      case "machining":
        return material.hardness > 500 ? "edm" : "cnc_mill";
      case "additive":
        return "sla_printer";
      case "casting":
        return "investment_casting";
      default:
        return "cnc_mill";
    }
  }

  private simulateMachining(
    geometry: any,
    material: any,
    machine: any,
    processParams: any
  ): number {
    const complexityFactor = geometry.faces.length / 1000;
    const materialFactor = material.hardness / 200;
    const baseTime = geometry.volume * 1000; // Base time in minutes

    // Generate toolpath
    const toolpath: THREE.Vector3[] = [];
    for (let i = 0; i < geometry.vertices.length; i += 10) {
      toolpath.push(geometry.vertices[i].clone());
    }
    processParams.toolpath = toolpath;

    // Simulate cutting forces
    toolpath.forEach((point, index) => {
      const cuttingForce = new THREE.Vector3(
        material.hardness * 0.01,
        material.hardness * 0.008,
        material.hardness * 0.012
      );
      processParams.forces.push(cuttingForce);

      // Temperature from cutting
      const temperature = 25 + material.hardness / 10 + machine.speed / 1000;
      processParams.temperatures.push(temperature);

      // Vibration analysis
      const vibration = (machine.speed / 10000) * (1 + Math.random() * 0.1);
      processParams.vibrations.push(vibration);
    });

    return (baseTime * complexityFactor * materialFactor) / machine.precision;
  }

  private simulateAdditive(
    geometry: any,
    material: any,
    machine: any,
    processParams: any
  ): number {
    const layerHeight = 0.025; // 25 micrometers
    const layers = Math.ceil((geometry.volume * 1000) / layerHeight);

    // Generate layer-by-layer path
    for (let layer = 0; layer < layers; layer += 10) {
      const z = layer * layerHeight;
      processParams.toolpath.push(new THREE.Vector3(0, 0, z));
      processParams.forces.push(new THREE.Vector3(0, 0, 0.1)); // Minimal forces
      processParams.temperatures.push(machine.operatingTemp);
      processParams.vibrations.push(0.001); // Very low vibration
    }

    return layers * 2; // 2 seconds per layer
  }

  private simulateCasting(
    geometry: any,
    material: any,
    machine: any,
    processParams: any
  ): number {
    // Simplified casting simulation
    const moldingTime = 120; // 2 hours for mold preparation
    const pouringTime = 5; // 5 minutes for pouring
    const coolingTime = geometry.volume * 10000; // Cooling time based on volume

    processParams.toolpath.push(new THREE.Vector3(0, 0, 0)); // Single pour point
    processParams.forces.push(new THREE.Vector3(0, 0, material.density * 9.81));
    processParams.temperatures.push(machine.operatingTemp);
    processParams.vibrations.push(0.01);

    return moldingTime + pouringTime + coolingTime;
  }

  private simulateForging(
    geometry: any,
    material: any,
    machine: any,
    processParams: any
  ): number {
    const forgingSteps = Math.ceil(geometry.volume * 100);

    for (let step = 0; step < forgingSteps; step++) {
      const force = new THREE.Vector3(0, 0, material.yieldStrength * 2);
      processParams.forces.push(force);
      processParams.temperatures.push(800 + step * 10); // Heating during forging
      processParams.vibrations.push(0.1 + Math.random() * 0.05);
    }

    return forgingSteps * 0.5; // 30 seconds per step
  }

  private simulateEtching(
    geometry: any,
    material: any,
    machine: any,
    processParams: any
  ): number {
    const etchDepth = 0.1; // 100 micrometers
    const etchRate = 0.001; // 1 micrometer per minute

    processParams.temperatures.push(25); // Room temperature
    processParams.vibrations.push(0.0001); // Minimal vibration

    return (etchDepth / etchRate) * geometry.surfaceArea;
  }

  private predictQuality(
    process: ManufacturingProcess,
    material: any,
    machine: any,
    time: number
  ): {
    dimensionalAccuracy: number;
    surfaceFinish: number;
    defectProbability: number;
  } {
    // Machine precision affects accuracy
    const accuracyFromPrecision = 1 - machine.precision / 0.1;

    // Material hardness affects surface finish
    const surfaceFinishFactor = Math.exp(-material.hardness / 1000);

    // Time affects defect probability (longer = more chance for issues)
    const defectProbability = Math.min(0.1, time / 10000);

    return {
      dimensionalAccuracy: Math.max(0.8, accuracyFromPrecision * 0.98),
      surfaceFinish: surfaceFinishFactor * process.surfaceFinish,
      defectProbability,
    };
  }
}

export class QualityControlSystem {
  private inspectionMethods: Map<
    string,
    {
      accuracy: number;
      speed: number;
      cost: number;
      capability: string[];
    }
  > = new Map();

  private statisticalData: Array<{
    timestamp: number;
    measurements: number[];
    processParameters: any;
    defects: string[];
  }> = [];

  constructor() {
    this.initializeInspectionMethods();
  }

  private initializeInspectionMethods() {
    this.inspectionMethods.set("cmm", {
      accuracy: 0.001, // 1 micrometer
      speed: 100, // points per minute
      cost: 2, // $ per minute
      capability: ["dimensional", "geometric", "surface"],
    });

    this.inspectionMethods.set("optical_scanner", {
      accuracy: 0.01, // 10 micrometers
      speed: 10000, // points per second
      cost: 0.5,
      capability: ["dimensional", "surface", "visual"],
    });

    this.inspectionMethods.set("xray_ct", {
      accuracy: 0.005, // 5 micrometers
      speed: 1, // scans per minute
      cost: 10,
      capability: ["internal", "density", "voids"],
    });

    this.inspectionMethods.set("surface_profilometer", {
      accuracy: 0.0001, // 100 nanometers
      speed: 1000, // points per minute
      cost: 1,
      capability: ["surface", "roughness", "texture"],
    });
  }

  performInspection(
    part: {
      geometry: any;
      specifications: {
        dimensions: { value: number; tolerance: number }[];
        surfaceRoughness: number;
        materialProperties: any;
      };
    },
    inspectionLevel: "basic" | "comprehensive" | "critical"
  ): {
    measurements: Array<{
      parameter: string;
      measured: number;
      nominal: number;
      tolerance: number;
      deviation: number;
      status: "pass" | "fail" | "warning";
    }>;
    overallStatus: "pass" | "fail";
    confidence: number;
    inspectionTime: number;
    cost: number;
    recommendations: string[];
  } {
    const measurements: Array<{
      parameter: string;
      measured: number;
      nominal: number;
      tolerance: number;
      deviation: number;
      status: "pass" | "fail" | "warning";
    }> = [];

    let totalTime = 0;
    let totalCost = 0;
    let passCount = 0;

    // Select inspection methods based on level
    const methods = this.selectInspectionMethods(inspectionLevel);

    // Perform dimensional inspection
    part.specifications.dimensions.forEach((dim, index) => {
      const method = this.inspectionMethods.get("cmm")!;

      // Simulate measurement with noise
      const measurementNoise = (Math.random() - 0.5) * method.accuracy;
      const measured = dim.value + measurementNoise;
      const deviation = Math.abs(measured - dim.value);

      let status: "pass" | "fail" | "warning" = "pass";
      if (deviation > dim.tolerance) {
        status = "fail";
      } else if (deviation > dim.tolerance * 0.7) {
        status = "warning";
      } else {
        passCount++;
      }

      measurements.push({
        parameter: `Dimension_${index + 1}`,
        measured,
        nominal: dim.value,
        tolerance: dim.tolerance,
        deviation,
        status,
      });

      totalTime += 1 / method.speed; // minutes
      totalCost += method.cost / method.speed;
    });

    // Surface roughness inspection
    if (methods.includes("surface_profilometer")) {
      const method = this.inspectionMethods.get("surface_profilometer")!;
      const nominalRoughness = part.specifications.surfaceRoughness;
      const measuredRoughness =
        nominalRoughness + (Math.random() - 0.5) * method.accuracy;
      const deviation = Math.abs(measuredRoughness - nominalRoughness);

      let status: "pass" | "fail" | "warning" = "pass";
      const tolerance = nominalRoughness * 0.2; // 20% tolerance

      if (deviation > tolerance) {
        status = "fail";
      } else if (deviation > tolerance * 0.7) {
        status = "warning";
      } else {
        passCount++;
      }

      measurements.push({
        parameter: "Surface_Roughness",
        measured: measuredRoughness,
        nominal: nominalRoughness,
        tolerance,
        deviation,
        status,
      });

      totalTime += 5; // 5 minutes for surface scan
      totalCost += method.cost * 5;
    }

    // Internal inspection for critical parts
    if (inspectionLevel === "critical" && methods.includes("xray_ct")) {
      const method = this.inspectionMethods.get("xray_ct")!;

      // Simulate internal void detection
      const voidPercentage = Math.random() * 0.1; // 0-0.1%
      const acceptableVoids = 0.05; // 0.05%

      let status: "pass" | "fail" | "warning" = "pass";
      if (voidPercentage > acceptableVoids) {
        status = "fail";
      } else if (voidPercentage > acceptableVoids * 0.7) {
        status = "warning";
      } else {
        passCount++;
      }

      measurements.push({
        parameter: "Internal_Voids",
        measured: voidPercentage,
        nominal: 0,
        tolerance: acceptableVoids,
        deviation: voidPercentage,
        status,
      });

      totalTime += 30; // 30 minutes for CT scan
      totalCost += method.cost * 30;
    }

    // Calculate overall results
    const overallStatus = measurements.every((m) => m.status !== "fail")
      ? "pass"
      : "fail";
    const confidence = passCount / measurements.length;

    // Generate recommendations
    const recommendations: string[] = [];
    if (confidence < 0.8) {
      recommendations.push("Consider process optimization to improve quality");
    }
    if (measurements.some((m) => m.status === "warning")) {
      recommendations.push("Monitor closely - measurements approaching limits");
    }
    if (overallStatus === "fail") {
      recommendations.push("Part requires rework or rejection");
    }

    // Store data for statistical analysis
    this.statisticalData.push({
      timestamp: Date.now(),
      measurements: measurements.map((m) => m.measured),
      processParameters: { inspectionLevel, methods },
      defects: measurements
        .filter((m) => m.status === "fail")
        .map((m) => m.parameter),
    });

    return {
      measurements,
      overallStatus,
      confidence,
      inspectionTime: totalTime,
      cost: totalCost,
      recommendations,
    };
  }

  private selectInspectionMethods(
    level: "basic" | "comprehensive" | "critical"
  ): string[] {
    switch (level) {
      case "basic":
        return ["optical_scanner"];
      case "comprehensive":
        return ["cmm", "optical_scanner", "surface_profilometer"];
      case "critical":
        return ["cmm", "optical_scanner", "surface_profilometer", "xray_ct"];
      default:
        return ["optical_scanner"];
    }
  }

  performStatisticalAnalysis(): {
    cpk: number; // Process capability
    trends: Array<{
      parameter: string;
      trend: "improving" | "degrading" | "stable";
    }>;
    controlLimits: { upper: number; lower: number };
    recommendations: string[];
  } {
    if (this.statisticalData.length < 10) {
      return {
        cpk: 1.0,
        trends: [],
        controlLimits: { upper: 0, lower: 0 },
        recommendations: ["Insufficient data for statistical analysis"],
      };
    }

    // Calculate process capability (simplified)
    const recentData = this.statisticalData.slice(-30);
    const allMeasurements = recentData.flatMap((d) => d.measurements);

    const mean =
      allMeasurements.reduce((a, b) => a + b) / allMeasurements.length;
    const variance =
      allMeasurements.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      allMeasurements.length;
    const standardDeviation = Math.sqrt(variance);

    // Cpk calculation (assuming specification limits)
    const upperSpec = mean + 3 * standardDeviation;
    const lowerSpec = mean - 3 * standardDeviation;
    const cpk = Math.min(
      (upperSpec - mean) / (3 * standardDeviation),
      (mean - lowerSpec) / (3 * standardDeviation)
    );

    // Control limits (±3σ)
    const controlLimits = {
      upper: mean + 3 * standardDeviation,
      lower: mean - 3 * standardDeviation,
    };

    // Trend analysis
    const trends: Array<{
      parameter: string;
      trend: "improving" | "degrading" | "stable";
    }> = [];
    // Simplified trend analysis
    const firstHalf = recentData.slice(0, 15);
    const secondHalf = recentData.slice(15);

    const firstHalfMean =
      firstHalf.flatMap((d) => d.measurements).reduce((a, b) => a + b) /
      firstHalf.flatMap((d) => d.measurements).length;
    const secondHalfMean =
      secondHalf.flatMap((d) => d.measurements).reduce((a, b) => a + b) /
      secondHalf.flatMap((d) => d.measurements).length;

    const trendDirection =
      secondHalfMean > firstHalfMean ? "degrading" : "improving";
    trends.push({ parameter: "Overall_Quality", trend: trendDirection });

    // Recommendations based on analysis
    const recommendations: string[] = [];
    if (cpk < 1.33) {
      recommendations.push(
        "Process capability is below acceptable levels - investigate root causes"
      );
    }
    if (trendDirection === "degrading") {
      recommendations.push(
        "Quality trend is degrading - implement corrective actions"
      );
    }
    if (standardDeviation > mean * 0.1) {
      recommendations.push(
        "High variation detected - review process stability"
      );
    }

    return {
      cpk,
      trends,
      controlLimits,
      recommendations,
    };
  }
}

export function useAdvancedManufacturing() {
  const manufacturingRef = useRef(new DigitalTwinManufacturing());
  const qualityControlRef = useRef(new QualityControlSystem());

  const [manufacturingState, setManufacturingState] = useState({
    currentProcess: {
      manufacturingTime: 0,
      cost: 0,
      qualityPrediction: {
        dimensionalAccuracy: 0,
        surfaceFinish: 0,
        defectProbability: 0,
      },
      processParameters: {
        toolpath: [] as THREE.Vector3[],
        forces: [] as THREE.Vector3[],
        temperatures: [] as number[],
        vibrations: [] as number[],
      },
      materialRemoval: 0,
    },
    qualityControl: {
      measurements: [] as Array<{
        parameter: string;
        measured: number;
        nominal: number;
        tolerance: number;
        deviation: number;
        status: "pass" | "fail" | "warning";
      }>,
      overallStatus: "pass" as "pass" | "fail",
      confidence: 0,
      inspectionTime: 0,
      cost: 0,
      recommendations: [] as string[],
    },
    statistics: {
      cpk: 1.0,
      trends: [] as Array<{
        parameter: string;
        trend: "improving" | "degrading" | "stable";
      }>,
      controlLimits: { upper: 0, lower: 0 },
      recommendations: [] as string[],
    },
  });

  useFrame((state, delta) => {
    // Simulate a watch case manufacturing process
    const watchCaseGeometry = {
      vertices: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.04, 0, 0),
        new THREE.Vector3(0.04, 0.04, 0),
        new THREE.Vector3(0, 0.04, 0),
        new THREE.Vector3(0, 0, 0.01),
        new THREE.Vector3(0.04, 0, 0.01),
        new THREE.Vector3(0.04, 0.04, 0.01),
        new THREE.Vector3(0, 0.04, 0.01),
      ],
      faces: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [0, 1, 5, 4],
        [2, 3, 7, 6],
        [1, 2, 6, 5],
        [3, 0, 4, 7],
      ],
      volume: 0.04 * 0.04 * 0.01, // 40mm x 40mm x 10mm
      surfaceArea: 2 * (0.04 * 0.04) + 4 * (0.04 * 0.01),
    };

    const stainlessSteel = {
      hardness: 200, // HV
      density: 7800, // kg/m³
      thermalConductivity: 16.3, // W/m·K
      yieldStrength: 300e6, // Pa
    };

    const machiningProcess: ManufacturingProcess = {
      processType: "machining",
      tolerances: [0.01, 0.01, 0.005], // ±10µm x,y and ±5µm z
      surfaceFinish: 0.8, // Ra 0.8µm
      materialStress: new THREE.Vector3(100e6, 50e6, 25e6),
      temperature: 25,
      duration: 120, // minutes
    };

    // Run manufacturing simulation
    const processResult = manufacturingRef.current.simulateManufacturing(
      machiningProcess,
      watchCaseGeometry,
      stainlessSteel
    );

    // Simulate quality inspection
    const inspectionSpecs = {
      geometry: watchCaseGeometry,
      specifications: {
        dimensions: [
          { value: 40.0, tolerance: 0.01 },
          { value: 40.0, tolerance: 0.01 },
          { value: 10.0, tolerance: 0.005 },
        ],
        surfaceRoughness: 0.8,
        materialProperties: stainlessSteel,
      },
    };

    const qualityResult = qualityControlRef.current.performInspection(
      inspectionSpecs,
      "comprehensive"
    );

    // Get statistical analysis
    const statisticalResult =
      qualityControlRef.current.performStatisticalAnalysis();

    setManufacturingState({
      currentProcess: processResult,
      qualityControl: qualityResult,
      statistics: statisticalResult,
    });
  });

  return {
    manufacturing: manufacturingState,
    simulateProcess: (
      process: ManufacturingProcess,
      geometry: any,
      material: any
    ) =>
      manufacturingRef.current.simulateManufacturing(
        process,
        geometry,
        material
      ),
    performInspection: (
      part: any,
      level: "basic" | "comprehensive" | "critical"
    ) => qualityControlRef.current.performInspection(part, level),
  };
}
