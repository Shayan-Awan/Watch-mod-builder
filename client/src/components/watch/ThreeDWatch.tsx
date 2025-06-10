import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWatchStore } from '../../lib/stores/useWatchStore';
import { watchComponents, ComponentType } from '../../data/watchComponents';

interface ThreeDWatchProps {
    rotating: boolean;
}

function WatchModel() {
    const groupRef = useRef<THREE.Group>(null);
      const hourHandRef = useRef<THREE.Mesh>(null);
        const minuteHandRef = useRef<THREE.Mesh>(null);
          const secondHandRef = useRef<THREE.Mesh>(null);
            const { config } = useWatchStore();
              
              useFrame((state) => {
                    if (groupRef.current && useWatchStore.getState().rotating) {
                            groupRef.current.rotation.y += 0.008;
                    }
                        
                        // Animate watch hands to show current time
                            const time = Date.now() * 0.001;
                                if (hourHandRef.current) {
                                        hourHandRef.current.rotation.y = -time * 0.1;
                                }
                                    if (minuteHandRef.current) {
                                            minuteHandRef.current.rotation.y = -time * 0.5;
                                    }
                                        if (secondHandRef.current) {
                                                secondHandRef.current.rotation.y = -time * 2;
                                        }
                                      });

                                        const createWatchCase = (selectedId: string) => {
                                              const component = watchComponents.case.find(c => c.id === selectedId);
                                                  if (!component) return new THREE.Group();

                                                      const group = new THREE.Group();
                                                          
                                                          // Main case body
                                                              const caseGeometry = new THREE.CylinderGeometry(2.2, 2.4, 1.2, 64);
                                                                  const caseMaterial = new THREE.MeshStandardMaterial({ 
                                                                          color: component.color || '#C0C0C0',
                                                                                metalness: 0.9,
                                                                                      roughness: 0.1,
                                                                                            envMapIntensity: 1.5
                                                                  });
                                                                      const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial);
                                                                          
                                                                          // Case back
                                                                              const backGeometry = new THREE.CylinderGeometry(2.1, 2.1, 0.3, 64);
                                                                                  const backMesh = new THREE.Mesh(backGeometry, caseMaterial);
                                                                                      backMesh.position.y = -0.75;
                                                                                          
                                                                                          // Crown
                                                                                              const crownGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.4, 16);
                                                                                                  const crownMesh = new THREE.Mesh(crownGeometry, caseMaterial);
                                                                                                      crownMesh.position.set(2.3, 0.2, 0);
                                                                                                          crownMesh.rotation.z = Math.PI / 2;
                                                                                                              
                                                                                                              // Lugs
                                                                                                                  const lugGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.3);
                                                                                                                      const lug1 = new THREE.Mesh(lugGeometry, caseMaterial);
                                                                                                                          const lug2 = new THREE.Mesh(lugGeometry, caseMaterial);
                                                                                                                              const lug3 = new THREE.Mesh(lugGeometry, caseMaterial);
                                                                                                                                  const lug4 = new THREE.Mesh(lugGeometry, caseMaterial);
                                                                                                                                      
                                                                                                                                      lug1.position.set(0, 0.4, 2.4);
                                                                                                                                          lug2.position.set(0, 0.4, -2.4);
                                                                                                                                              lug3.position.set(0, -0.4, 2.4);
                                                                                                                                                  lug4.position.set(0, -0.4, -2.4);
                                                                                                                                                      
                                                                                                                                                      group.add(caseMesh, backMesh, crownMesh, lug1, lug2, lug3, lug4);
                                                                                                                                                          return group;
                                                                };

                                                                  const createWatchDial = (selectedId: string) => {
                                                                        const component = watchComponents.dial.find(c => c.id === selectedId);
                                                                            if (!component) return new THREE.Group();

                                                                                const group = new THREE.Group();
                                                                                    
                                                                                    // Main dial
                                                                                        const dialGeometry = new THREE.CylinderGeometry(1.9, 1.9, 0.05, 64);
                                                                                            const dialMaterial = new THREE.MeshStandardMaterial({ 
                                                                                                    color: component.color || '#FFFFFF',
                                                                                                          metalness: 0.1,
                                                                                                                roughness: 0.7
                                                                                            });
                                                                                                const dialMesh = new THREE.Mesh(dialGeometry, dialMaterial);
                                                                                                    dialMesh.position.y = 0.525;
                                                                                                        
                                                                                                        // Hour markers
                                                                                                            const markerMaterial = new THREE.MeshStandardMaterial({ 
                                                                                                                    color: '#333333',
                                                                                                                          metalness: 0.3,
                                                                                                                                roughness: 0.4
                                                                                                            });
                                                                                                                
                                                                                                                for (let i = 0; i < 12; i++) {
                                                                                                                        const angle = (i * Math.PI * 2) / 12;
                                                                                                                              const isMainHour = i % 3 === 0;
                                                                                                                                    
                                                                                                                                    const markerGeometry = isMainHour 
                                                                                                                                            ? new THREE.BoxGeometry(0.08, 0.3, 0.02)
                                                                                                                                                    : new THREE.BoxGeometry(0.04, 0.15, 0.02);
                                                                                                                                                            
                                                                                                                                                          const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                                                                                                                                                                const radius = isMainHour ? 1.6 : 1.7;
                                                                                                                                                                      
                                                                                                                                                                      marker.position.set(
                                                                                                                                                                                Math.sin(angle) * radius,
                                                                                                                                                                                        0.55,
                                                                                                                                                                                                Math.cos(angle) * radius      );
                                                                                                                                                                                                      marker.rotation.y = -angle;
                                                                                                                                                                                                            
                                                                                                                                                                                                            group.add(marker);
                                                                                                                                                                      }
                                                                                                                                                                          
                                                                                                                                                                          // Center dot
                                                                                                                                                                              const centerGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16);
                                                                                                                                                                                  const centerMesh = new THREE.Mesh(centerGeometry, markerMaterial);
                                                                                                                                                                                      centerMesh.position.y = 0.56;
                                                                                                                                                                                          
                                                                                                                                                                                          group.add(dialMesh, centerMesh);
                                                                                                                                                                                              return group;
                                                                                                                                                                    };

                                                                                                                                                                      const createWatchHands = (selectedId: string) => {
                                                                                                                                                                            const component = watchComponents.hands.find(c => c.id === selectedId);
                                                                                                                                                                                if (!component) return new THREE.Group();

                                                                                                                                                                                    const group = new THREE.Group();
                                                                                                                                                                                        
                                                                                                                                                                                        const handMaterial = new THREE.MeshStandardMaterial({ 
                                                                                                                                                                                                color: component.color || '#000000',
                                                                                                                                                                                                      metalness: 0.7,
                                                                                                                                                                                                            roughness: 0.2
                                                                                                                                                                                        });
                                                                                                                                                                                            
                                                                                                                                                                                            // Hour hand (flat on the dial)
                                                                                                                                                                                                const hourGeometry = new THREE.BoxGeometry(0.8, 0.015, 0.04);
                                                                                                                                                                                                    const hourHand = new THREE.Mesh(hourGeometry, handMaterial);
                                                                                                                                                                                                        hourHand.position.set(0, 0.57, 0);
                                                                                                                                                                                                            hourHandRef.current = hourHand;
                                                                                                                                                                                                                
                                                                                                                                                                                                                // Minute hand (flat on the dial)
                                                                                                                                                                                                                    const minuteGeometry = new THREE.BoxGeometry(1.2, 0.015, 0.03);
                                                                                                                                                                                                                        const minuteHand = new THREE.Mesh(minuteGeometry, handMaterial);
                                                                                                                                                                                                                            minuteHand.position.set(0, 0.575, 0);
                                                                                                                                                                                                                                minuteHandRef.current = minuteHand;
                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                    // Second hand (flat on the dial)
                                                                                                                                                                                                                                        const secondGeometry = new THREE.BoxGeometry(1.4, 0.015, 0.015);
                                                                                                                                                                                                                                            const secondMaterial = new THREE.MeshStandardMaterial({ 
                                                                                                                                                                                                                                                    color: '#FF0000',
                                                                                                                                                                                                                                                          metalness: 0.8,
                                                                                                                                                                                                                                                                roughness: 0.1
                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                const secondHand = new THREE.Mesh(secondGeometry, secondMaterial);
                                                                                                                                                                                                                                                    secondHand.position.set(0, 0.58, 0);
                                                                                                                                                                                                                                                        secondHandRef.current = secondHand;
                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                            group.add(hourHand, minuteHand, secondHand);
                                                                                                                                                                                                                                                                return group;
                                                                                                                                                                                                                                          };

                                                                                                                                                                                                                                            const createWatchBezel = (selectedId: string) => {
                                                                                                                                                                                                                                                  const component = watchComponents.bezel.find(c => c.id === selectedId);
                                                                                                                                                                                                                                                      if (!component) return new THREE.Group();

                                                                                                                                                                                                                                                          const group = new THREE.Group();
                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                              // Outer bezel ring
                                                                                                                                                                                                                                                                  const outerGeometry = new THREE.CylinderGeometry(2.3, 2.3, 0.2, 64);
                                                                                                                                                                                                                                                                      const innerGeometry = new THREE.CylinderGeometry(2.0, 2.0, 0.25, 64);
                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                          const outerMesh = new THREE.Mesh(outerGeometry, new THREE.MeshStandardMaterial({ 
                                                                                                                                                                                                                                                                                  color: component.color || '#FFD700',
                                                                                                                                                                                                                                                                                        metalness: 0.95,
                                                                                                                                                                                                                                                                                              roughness: 0.05,
                                                                                                                                                                                                                                                                                                    envMapIntensity: 2
                                                                                                                                                                                                                                                                          }));
                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                              const innerMesh = new THREE.Mesh(innerGeometry, new THREE.MeshStandardMaterial({ 
                                                                                                                                                                                                                                                                                      color: '#000000',
                                                                                                                                                                                                                                                                                            metalness: 0.1,
                                                                                                                                                                                                                                                                                                  roughness: 0.9
                                                                                                                                                                                                                                                                              }));
                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                  outerMesh.position.y = 0.6;
                                                                                                                                                                                                                                                                                      innerMesh.position.y = 0.6;
                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                          // Bezel markers
                                                                                                                                                                                                                                                                                              for (let i = 0; i < 60; i++) {
                                                                                                                                                                                                                                                                                                      if (i % 5 === 0) {
                                                                                                                                                                                                                                                                                                                const angle = (i * Math.PI * 2) / 60;
                                                                                                                                                                                                                                                                                                                        const markerGeometry = new THREE.BoxGeometry(0.03, 0.1, 0.02);
                                                                                                                                                                                                                                                                                                                                const marker = new THREE.Mesh(markerGeometry, new THREE.MeshStandardMaterial({ 
                                                                                                                                                                                                                                                                                                                                            color: '#FFFFFF',
                                                                                                                                                                                                                                                                                                                                                      metalness: 0.3,
                                                                                                                                                                                                                                                                                                                                                                roughness: 0.4
                                                                                                                                                                                                                                                                                                                                }));
                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                        marker.position.set(
                                                                                                                                                                                                                                                                                                                                                    Math.sin(angle) * 2.15,
                                                                                                                                                                                                                                                                                                                                                              0.65,
                                                                                                                                                                                                                                                                                                                                                                        Math.cos(angle) * 2.15
                                                                                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                                                                                                marker.rotation.y = -angle;
                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                        group.add(marker);
                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                        group.add(outerMesh, innerMesh);
                                                                                                                                                                                                                                                                                                                                            return group;
                                                                                                                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                                                                                                                    useEffect(() => {
                                                                                                                                                                                                                                                                                                                                          if (!groupRef.current) return;

                                                                                                                                                                                                                                                                                                                                              // Clear existing children
                                                                                                                                                                                                                                                                                                                                                  while (groupRef.current.children.length > 0) {
                                                                                                                                                                                                                                                                                                                                                          groupRef.current.remove(groupRef.current.children[0]);
                                                                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                                                                      // Add watch components
                                                                                                                                                                                                                                                                                                                                                          const caseComponent = createWatchCase(config.case);
                                                                                                                                                                                                                                                                                                                                                              const dialComponent = createWatchDial(config.dial);
                                                                                                                                                                                                                                                                                                                                                                  const handsComponent = createWatchHands(config.hands);
                                                                                                                                                                                                                                                                                                                                                                      const bezelComponent = createWatchBezel(config.bezel);

                                                                                                                                                                                                                                                                                                                                                                          groupRef.current.add(caseComponent, dialComponent, handsComponent, bezelComponent);
                                                                                                                                                                                                                                                                                                                                                }, [config]);

                                                                                                                                                                                                                                                                                                                                                  return (
                                                                                                                                                                                                                                                                                                                                                        <group ref={groupRef} position={[0, 0, 0]} castShadow receiveShadow>
                                                                                                                                                                                                                                                                                                                                                                {/* Watch components will be added dynamically */}
                                                                                                                                                                                                                                                                                                                                                                    </group>  );
}

export default function ThreeDWatch({ rotating }: ThreeDWatchProps) {
    const { setRotating } = useWatchStore();

      useEffect(() => {
            setRotating(rotating);
      }, [rotating, setRotating]);

        return (
              <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100">
                      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
                                <PerspectiveCamera makeDefault position={[0, 2, 6]} />
                                        <OrbitControls 
                                                  enablePan={true} 
                                                            enableZoom={true} 
                                                                      enableRotate={true}
                                                                                minDistance={4}
                                                                                          maxDistance={12}
                                                                                                    maxPolarAngle={Math.PI / 1.8}
                                                                                                              minPolarAngle={Math.PI / 4}
                                                                                                                      />
                                                                                                                              
                                                                                                                                      <ambientLight intensity={0.4} />
                                                                                                                                              <directionalLight 
                                                                                                                                                        position={[10, 10, 5]} 
                                                                                                                                                                  intensity={.2} 
                                                                                                                                                                          castShadow          shadow-mapSize-width={2048}
                                                                                                                                                                                  shadow-mapSize-height={2048}
                                                                                                                                                                                        />
                                                                                                                                                                                                <pointLight position={[-10, 5, -5]} intensity={0.5} color="#ffffff" />
                                                                                                                                                                                                        <spotLight          position={[0, 10, 0]}
                                                                                                                                                                                                                  angle={0.3}
                                                                                                                                                                                                                          penumbra={          intensity={0.8}
                                                                                                                                                                                                                                  castShadow
                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                              <Environment preset="studio" background={false} />
                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                    <WatchModel />
                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                          {/* Ground plane for shadows */}
                                                                                                                                                                                                                                                                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
                                                                                                                                                                                                                                                                            <planeGeometry args={[20, 20]} />
                                                                                                                                                                                                                                                                                      <shadowMaterial opacity={0.1} />
                                                                                                                                                                                                                                                                                              </mesh>      </Canvas>    </div>  );
}
                                                                                                                                                                                                                                                                </mesh>}}
                      </Canvas>
              </div>
        )
      })
}
                                                                                                                                                                                                                                                                                                                                                        </group>
                                                                                                                                                                                                                                                                                                                                                  )
                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                    })
                                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                                                }))
                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                              }))
                                                                                                                                                                                                                                                                          }))
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            })
                                                                                                                                                                                        })
                                                                                                                                                                      }
                                                                                                                                                                      )
                                                                                                                }
                                                                                                            })
                                                                                            })
                                                                  }
                                                                  })
                                        }
                                        }
                                    }
                                }
                    }
              })
}
}