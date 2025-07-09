import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { ComponentType } from "@/data/watchComponents";
//colors
// Define material colors based on component selections
const materials = {
  cases: {
    case_skx007: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.7,
      roughness: 0.2,
    }),
    case_sarb033: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.8,
      roughness: 0.1,
    }),
    case_turtle: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.6,
      roughness: 0.3,
    }),
    case_presage: new THREE.MeshStandardMaterial({
      color: "#DDCCA3",
      metalness: 0.8,
      roughness: 0.1,
    }),
  },
  dials: {
    dial_black: new THREE.MeshStandardMaterial({
      color: "#000000",
      metalness: 0.3,
      roughness: 0.7,
    }),
    dial_blue: new THREE.MeshStandardMaterial({
      color: "#14213D",
      metalness: 0.4,
      roughness: 0.6,
    }),
    dial_green: new THREE.MeshStandardMaterial({
      color: "#285943",
      metalness: 0.4,
      roughness: 0.6,
    }),
    dial_white: new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      metalness: 0.2,
      roughness: 0.8,
    }),
    dial_cream: new THREE.MeshStandardMaterial({
      color: "#F5EFE0",
      metalness: 0.2,
      roughness: 0.8,
    }),
    dial_orange: new THREE.MeshStandardMaterial({
      color: "#FCA311",
      metalness: 0.3,
      roughness: 0.7,
    }),
  },
  hands: {
    hands_standard: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.9,
      roughness: 0.1,
    }),
    hands_sword: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.8,
      roughness: 0.2,
    }),
    hands_cathedral: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.9,
      roughness: 0.1,
    }),
    hands_gold: new THREE.MeshStandardMaterial({
      color: "#DDCCA3",
      metalness: 0.9,
      roughness: 0.1,
    }),
    hands_snowflake: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.8,
      roughness: 0.2,
    }),
  },
  bezels: {
    bezel_steel: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.9,
      roughness: 0.1,
    }),
    bezel_dive: new THREE.MeshStandardMaterial({
      color: "#444444",
      metalness: 0.6,
      roughness: 0.4,
    }),
    bezel_gmt: new THREE.MeshStandardMaterial({
      color: "#14213D",
      metalness: 0.5,
      roughness: 0.4,
    }),
    bezel_fluted: new THREE.MeshStandardMaterial({
      color: "#C0C0C0",
      metalness: 0.9,
      roughness: 0.1,
    }),
    bezel_gold: new THREE.MeshStandardMaterial({
      color: "#DDCCA3",
      metalness: 0.9,
      roughness: 0.1,
    }),
  },
};

// Watch component meshes
interface WatchMeshes {
  case: THREE.Group;
  dial: THREE.Group;
  hands: THREE.Group;
  bezel: THREE.Group;
}

interface ThreeDWatchProps {
  rotating: boolean;
}

export default function ThreeDWatch({ rotating }: ThreeDWatchProps) {
  const watchGroup = useRef<THREE.Group>(null);
  const { config } = useWatchStore();
  const { camera } = useThree();

  //  its still dummy but serves its purpose for the app
  const createWatchComponent = (type: ComponentType, selectedId: string) => {
    const group = new THREE.Group();

    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;
    let mesh: THREE.Mesh;

    switch (type) {
      case "case":
        // Watch case (cylinder) this might need to be worked on more
        geometry = new THREE.CylinderGeometry(1, 1, 0.3, 32);
        material =
          materials.cases[selectedId as keyof typeof materials.cases] ||
          new THREE.MeshStandardMaterial({
            color: "#C0C0C0",
            metalness: 0.7,
            roughness: 0.2,
          });
        mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);

        // Case back
        const backGeometry = new THREE.CylinderGeometry(0.95, 0.95, 0.1, 32);
        const backMaterial = new THREE.MeshStandardMaterial({
          color: "#A0A0A0",
          metalness: 0.6,
          roughness: 0.3,
        });
        const back = new THREE.Mesh(backGeometry, backMaterial);
        back.position.y = -0.2;
        group.add(back);

        // Crown
        const crownGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const crownMaterial = new THREE.MeshStandardMaterial({
          color: "#C0C0C0",
          metalness: 0.8,
          roughness: 0.1,
        });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.rotation.x = Math.PI / 2;
        crown.position.set(1.1, 0, 0);
        group.add(crown);
        break;

      case "dial":
        // Watch dial, this required some costumization
        geometry = new THREE.CircleGeometry(0.9, 32);
        material =
          materials.dials[selectedId as keyof typeof materials.dials] ||
          new THREE.MeshStandardMaterial({
            color: "#000000",
            metalness: 0.3,
            roughness: 0.7,
          });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.151;
        mesh.rotation.x = -Math.PI / 2;

        // Hour markers
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const markerGeometry =
            i % 3 === 0
              ? new THREE.BoxGeometry(0.08, 0.02, 0.1)
              : new THREE.BoxGeometry(0.05, 0.02, 0.06);
          const markerMaterial = new THREE.MeshStandardMaterial({
            color: "#FFFFFF",
            metalness: 0.5,
          });
          const marker = new THREE.Mesh(markerGeometry, markerMaterial);

          marker.position.x = Math.sin(angle) * 0.75;
          marker.position.z = Math.cos(angle) * 0.75;
          marker.position.y = 0.16;
          marker.rotation.y = -angle;

          group.add(marker);
        }

        group.add(mesh);
        break;

      case "hands":
        // Hour hand (pointing to 10 o'clock) - centered with pivot at one end, the time doesnt tick, the hands are stationary, considered adding the moving hands but loading/buffer time would also greatly increase
        const hourHandGeometry = new THREE.BoxGeometry(0.5, 0.01, 0.08);
        const hourHandMaterial =
          materials.hands[selectedId as keyof typeof materials.hands] ||
          new THREE.MeshStandardMaterial({
            color: "#C0C0C0",
            metalness: 0.9,
            roughness: 0.1,
          });
        const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
        hourHand.geometry.translate(0.25, 0, 0); // Move pivot to one end
        hourHand.position.set(0, 0.17, 0); // Center at origin
        hourHand.rotation.y = Math.PI / 6; // 30 degrees clockwise
        group.add(hourHand);

        // Minute hand (pointing to 2 o'clock) - centered with pivot at one end
        const minuteHandGeometry = new THREE.BoxGeometry(0.7, 0.01, 0.05);
        const minuteHand = new THREE.Mesh(minuteHandGeometry, hourHandMaterial);
        minuteHand.geometry.translate(0.35, 0, 0); // Move pivot to one end
        minuteHand.position.set(0, 0.18, 0); // Center at origin
        minuteHand.rotation.y = -Math.PI / 3; // 60 degrees counter-clockwise
        group.add(minuteHand);

        // Second hand (pointing to 6 o'clock) - centered with pivot at one end
        const secondHandGeometry = new THREE.BoxGeometry(0.8, 0.01, 0.02);
        const secondHandMaterial = new THREE.MeshStandardMaterial({
          color: "#FCA311",
          metalness: 0.8,
          roughness: 0.2,
        });
        const secondHand = new THREE.Mesh(
          secondHandGeometry,
          secondHandMaterial
        );
        secondHand.geometry.translate(0.4, 0, 0); // Move pivot to one end
        secondHand.position.set(0, 0.19, 0); // Center at origin
        secondHand.rotation.y = Math.PI; // 180 degrees
        group.add(secondHand);

        // Center cap
        const centerCapGeometry = new THREE.CylinderGeometry(
          0.05,
          0.05,
          0.02,
          16
        );
        const centerCap = new THREE.Mesh(centerCapGeometry, hourHandMaterial);
        centerCap.position.y = 0.19;
        group.add(centerCap);
        break;

      case "bezel":
        // Bezel
        geometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
        material =
          materials.bezels[selectedId as keyof typeof materials.bezels] ||
          new THREE.MeshStandardMaterial({
            color: "#C0C0C0",
            metalness: 0.9,
            roughness: 0.1,
          });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.15;
        mesh.rotation.x = Math.PI / 2;

        // Add bezel markers for dive bezels the GMT stuff
        if (selectedId === "bezel_dive" || selectedId === "bezel_gmt") {
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const markerGeometry = new THREE.BoxGeometry(0.03, 0.03, 0.03);
            const markerMaterial = new THREE.MeshStandardMaterial({
              color: "#FFFFFF",
            });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);

            marker.position.x = Math.sin(angle) * 1;
            marker.position.z = Math.cos(angle) * 1;
            marker.position.y = 0.2;

            group.add(marker);
          }
        }

        group.add(mesh);
        break;
    }

    return group;
  };

  // Set up watch components
  useEffect(() => {
    if (watchGroup.current) {
      // Clear existing meshes
      while (watchGroup.current.children.length > 0) {
        watchGroup.current.remove(watchGroup.current.children[0]);
      }

      // Create new components based on configuration
      const components: WatchMeshes = {
        case: createWatchComponent("case", config.case),
        dial: createWatchComponent("dial", config.dial),
        hands: createWatchComponent("hands", config.hands),
        bezel: createWatchComponent("bezel", config.bezel),
      };

      // Add components to the watch group
      Object.values(components).forEach((component) => {
        watchGroup.current?.add(component);
      });
    }
  }, [config]);

  // Animation
  useFrame((state, delta) => {
    if (watchGroup.current && rotating) {
      watchGroup.current.rotation.y += delta * 0.3;
    }

    // Set initial camera position
    if (camera.position.z === 0) {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={watchGroup} position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
      {/* Watch components will be added dynamically */}
    </group>
  );
}


//i actually reprogrammed everything since i was having trouble finding and fixing stuff, what i mean by reprogramming is deleting this all and pasting it into a text document and then re-typing it out and making changes as i go