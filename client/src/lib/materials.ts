import * as THREE from 'three';

// Enhanced material system for photorealistic watch rendering
export class WatchMaterialLibrary {
        private textureLoader: THREE.TextureLoader;
          private cubeTextureLoader: THREE.CubeTextureLoader;
            private environmentMap: THREE.CubeTexture | null = null;

              constructor() {
                      this.textureLoader = new THREE.TextureLoader();
                          this.cubeTextureLoader = new THREE.CubeTextureLoader();
                              this.loadEnvironmentMap();
              }

                private async loadEnvironmentMap() {
                          // Load HDRI environment map for realistic reflections
                              const urls = [
                                          '/textures/env/px.jpg', '/textures/env/nx.jpg',
                                                '/textures/env/py.jpg', '/textures/env/ny.jpg',
                                                      '/textures/env/pz.jpg', '/textures/env/nz.jpg'
                              ];
                                  
                                  this.environmentMap = this.cubeTextureLoader.load(urls);
                                      this.environmentMap.format = THREE.RGBFormat;
                                          this.environmentMap.mapping = THREE.CubeReflectionMapping;
                        }

                          // Stainless Steel Materials
                            createPolishedSteel(): THREE.MeshPhysicalMaterial {
                                  return new THREE.MeshPhysicalMaterial({
                                          color: 0xC8C8C8,
                                                metalness: 0.95,
                                                      roughness: 0.05,
                                                            envMap: this.environmentMap,
                                                                  envMapIntensity: 1.5,
                                                                        clearcoat: 0.8,
                                                                              clearcoatRoughness: 0.1,
                                                                                    reflectivity: 0.9,
                                  });
                              }

                                createBrushedSteel(): THREE.MeshPhysicalMaterial {
                                        const roughnessMap = this.textureLoader.load('/textures/brushed_steel_roughness.jpg');
                                            const normalMap = this.textureLoader.load('/textures/brushed_steel_normal.jpg');
                                                
                                                return new THREE.MeshPhysicalMaterial({
                                                            color: 0xB8B8B8,
                                                                  metalness: 0.9,
                                                                        roughness: 0.3,
                                                                              roughnessMap: roughnessMap,
                                                                                    normalMap: normalMap,
                                                                                          normalScale: new THREE.Vector2(0.5, 0.5),
                                                                                                envMap: this.environmentMap,
                                                                                                      envMapIntensity: 1.2,
                                                });
                                          }

                                            createSatinFinishSteel(): THREE.MeshPhysicalMaterial {
                                                    return new THREE.MeshPhysicalMaterial({
                                                            color: 0xA8A8A8,
                                                                  metalness: 0.85,
                                                                        roughness: 0.4,
                                                                              envMap: this.environmentMap,
                                                                                    envMapIntensity: 1.0,
                                                                                          clearcoat: 0.3,
                                                                                                clearcoatRoughness: 0.6,
                                                    });
                                                }

                                                  // Gold Materials
                                                    createPolishedGold(): THREE.MeshPhysicalMaterial {
                                                          return new THREE.MeshPhysicalMaterial({
                                                                  color: 0xFFD700,
                                                                        metalness: 0.98,
                                                                              roughness: 0.02,
                                                                                    envMap: this.environmentMap,
                                                                                          envMapIntensity: 2.0,
                                                                                                clearcoat: 0.9,
                                                                                                      clearcoatRoughness: 0.05,
                                                                                                            reflectivity: 0.95,
                                                          });
                                                      }

                                                        createRoseGold(): THREE.MeshPhysicalMaterial {
                                                                return new THREE.MeshPhysicalMaterial({
                                                                        color: 0xE8B4A0,
                                                                              metalness: 0.95,
                                                                                    roughness: 0.08,
                                                                                          envMap: this.environmentMap,
                                                                                                envMapIntensity: 1.8,
                                                                                                      clearcoat: 0.7,
                                                                                                            clearcoatRoughness: 0.1,
                                                                });
                                                            }

                                                              createYellowGold(): THREE.MeshPhysicalMaterial {
                                                                      return new THREE.MeshPhysicalMaterial({
                                                                              color: 0xFFD200,
                                                                                    metalness: 0.96,
                                                                                          roughness: 0.05,
                                                                                                envMap: this.environmentMap,
                                                                                                      envMapIntensity: 1.9,
                                                                                                            clearcoat: 0.8,
                                                                                                                  clearcoatRoughness: 0.08,
                                                                      });
                                                                  }

                                                                    // Titanium Materials
                                                                      createBrushedTitanium(): THREE.MeshPhysicalMaterial {
                                                                            const roughnessMap = this.textureLoader.load('/textures/titanium_roughness.jpg');
                                                                                
                                                                                return new THREE.MeshPhysicalMaterial({
                                                                                          color: 0x8C8C8C,
                                                                                                metalness: 0.8,
                                                                                                      roughness: 0.5,
                                                                                                            roughnessMap: roughnessMap,
                                                                                                                  envMap: this.environmentMap,
                                                                                                                        envMapIntensity: 0.8,
                                                                                });
                                                                              }

                                                                                createPolishedTitanium(): THREE.MeshPhysicalMaterial {
                                                                                        return new THREE.MeshPhysicalMaterial({
                                                                                                color: 0x9A9A9A,
                                                                                                      metalness: 0.85,
                                                                                                            roughness: 0.15,
                                                                                                                  envMap: this.environmentMap,
                                                                                                                        envMapIntensity: 1.0,
                                                                                                                              clearcoat: 0.5,
                                                                                                                                    clearcoatRoughness: 0.2,
                                                                                        });
                                                                                    }

                                                                                      // PVD Coated Materials
                                                                                        createBlackPVD(): THREE.MeshPhysicalMaterial {
                                                                                              return new THREE.MeshPhysicalMaterial({
                                                                                                      color: 0x1A1A1A,
                                                                                                            metalness: 0.9,
                                                                                                                  roughness: 0.2,
                                                                                                                        envMap: this.environmentMap,
                                                                                                                              envMapIntensity: 0.6,
                                                                                                                                    clearcoat: 0.4,
                                                                                                                                          clearcoatRoughness: 0.3,
                                                                                              });
                                                                                          }

                                                                                            createGunmetalPVD(): THREE.MeshPhysicalMaterial {
                                                                                                    return new THREE.MeshPhysicalMaterial({
                                                                                                            color: 0x2C3539,
                                                                                                                  metalness: 0.88,
                                                                                                                        roughness: 0.25,
                                                                                                                              envMap: this.environmentMap,
                                                                                                                                    envMapIntensity: 0.7,
                                                                                                    });
                                                                                                }

                                                                                                  // Ceramic Materials
                                                                                                    createBlackCeramic(): THREE.MeshPhysicalMaterial {
                                                                                                          return new THREE.MeshPhysicalMaterial({
                                                                                                                  color: 0x0A0A0A,
                                                                                                                        metalness: 0.0,
                                                                                                                              roughness: 0.1,
                                                                                                                                    envMap: this.environmentMap,
                                                                                                                                          envMapIntensity: 0.3,
                                                                                                                                                clearcoat: 0.9,
                                                                                                                                                      clearcoatRoughness: 0.05,
                                                                                                                                                            ior: 1.5,
                                                                                                          });
                                                                                                      }

                                                                                                        createWhiteCeramic(): THREE.MeshPhysicalMaterial {
                                                                                                                return new THREE.MeshPhysicalMaterial({
                                                                                                                        color: 0xFAFAFA,
                                                                                                                              metalness: 0.0,
                                                                                                                                    roughness: 0.08,
                                                                                                                                          envMap: this.environmentMap,
                                                                                                                                                envMapIntensity: 0.4,
                                                                                                                                                      clearcoat: 0.95,
                                                                                                                                                            clearcoatRoughness: 0.03,
                                                                                                                                                                  ior: 1.5,
                                                                                                                });
                                                                                                            }

                                                                                                              // Dial Materials
                                                                                                                createSunburstDial(baseColor: number): THREE.MeshPhysicalMaterial {
                                                                                                                      const gradientTexture = this.createSunburstTexture(baseColor);
                                                                                                                          
                                                                                                                          return new THREE.MeshPhysicalMaterial({
                                                                                                                                    map: gradientTexture,
                                                                                                                                          metalness: 0.1,
                                                                                                                                                roughness: 0.8,
                                                                                                                                                      envMap: this.environmentMap,
                                                                                                                                                            envMapIntensity: 0.2,
                                                                                                                          });
                                                                                                                        }

                                                                                                                          createGuillocheDial(baseColor: number): THREE.MeshPhysicalMaterial {
                                                                                                                                  const guillochemap = this.textureLoader.load('/textures/guilloche_pattern.jpg');
                                                                                                                                      const normalMap = this.textureLoader.load('/textures/guilloche_normal.jpg');
                                                                                                                                          
                                                                                                                                          return new THREE.MeshPhysicalMaterial({
                                                                                                                                                      color: baseColor,
                                                                                                                                                            map: guillochemap,
                                                                                                                                                                  normalMap: normalMap,
                                                                                                                                                                        normalScale: new THREE.Vector2(0.3, 0.3),
                                                                                                                                                                              metalness: 0.05,
                                                                                                                                                                                    roughness: 0.9,
                                                                                                                                                                                          envMap: this.environmentMap,
                                                                                                                                                                                                envMapIntensity: 0.15,
                                                                                                                                          });
                                                                                                                                    }

                                                                                                                                      createMotherOfPearlDial(): THREE.MeshPhysicalMaterial {
                                                                                                                                              const iridescenceMap = this.textureLoader.load('/textures/mother_of_pearl.jpg');
                                                                                                                                                  
                                                                                                                                                  return new THREE.MeshPhysicalMaterial({
                                                                                                                                                            color: 0xF8F8FF,
                                                                                                                                                                  map: iridescenceMap,
                                                                                                                                                                        metalness: 0.0,
                                                                                                                                                                              roughness: 0.1,
                                                                                                                                                                                    envMap: this.environmentMap,
                                                                                                                                                                                          envMapIntensity: 0.8,
                                                                                                                                                                                                clearcoat: 0.9,
                                                                                                                                                                                                      clearcoatRoughness: 0.05,
                                                                                                                                                                                                            iridescence: 1.0,
                                                                                                                                                                                                                  iridescenceIOR: 1.3,
                                                                                                                                                                                                                        iridescenceThicknessRange: [100, 400],
                                                                                                                                                  });
                                                                                                                                                }

                                                                                                                                                  // Crystal Materials
                                                                                                                                                    createSapphireCrystal(): THREE.MeshPhysicalMaterial {
                                                                                                                                                          return new THREE.MeshPhysicalMaterial({
                                                                                                                                                                  color: 0xFFFFFF,
                                                                                                                                                                        metalness: 0.0,
                                                                                                                                                                              roughness: 0.0,
                                                                                                                                                                                    transmission: 0.95,
                                                                                                                                                                                          thickness: 2.0,
                                                                                                                                                                                                ior: 1.77,
                                                                                                                                                                                                      envMap: this.environmentMap,
                                                                                                                                                                                                            envMapIntensity: 1.0,
                                                                                                                                                                                                                  clearcoat: 1.0,
                                                                                                                                                                                                                        clearcoatRoughness: 0.0,
                                                                                                                                                          });
                                                                                                                                                      }

                                                                                                                                                        createMineralCrystal(): THREE.MeshPhysicalMaterial {
                                                                                                                                                                return new THREE.MeshPhysicalMaterial({
                                                                                                                                                                        color: 0xFFFFFF,
                                                                                                                                                                              metalness: 0.0,
                                                                                                                                                                                    roughness: 0.02,
                                                                                                                                                                                          transmission: 0.9,
                                                                                                                                                                                                thickness: 1.5,
                                                                                                                                                                                                      ior: 1.52,
                                                                                                                                                                                                            envMap: this.environmentMap,
                                                                                                                                                                                                                  envMapIntensity: 0.8,
                                                                                                                                                                                                                        clearcoat: 0.9,
                                                                                                                                                                                                                              clearcoatRoughness: 0.02,
                                                                                                                                                                });
                                                                                                                                                            }

                                                                                                                                                              // Luminous Materials
                                                                                                                                                                createLuminousMaterial(baseColor: number): THREE.MeshPhysicalMaterial {
                                                                                                                                                                      return new THREE.MeshPhysicalMaterial({
                                                                                                                                                                              color: baseColor,
                                                                                                                                                                                    emissive: new THREE.Color(baseColor).multiplyScalar(0.3),
                                                                                                                                                                                          metalness: 0.0,
                                                                                                                                                                                                roughness: 0.8,
                                                                                                                                                                                                      envMap: this.environmentMap,
                                                                                                                                                                                                            envMapIntensity: 0.1,
                                                                                                                                                                      });
                                                                                                                                                                  }

                                                                                                                                                                    // Texture Generation Utilities
                                                                                                                                                                      private createSunburstTexture(baseColor: number): THREE.Texture {
                                                                                                                                                                            const size = 512;
                                                                                                                                                                                const canvas = document.createElement('canvas');
                                                                                                                                                                                    canvas.width = size;
                                                                                                                                                                                        canvas.height = size;
                                                                                                                                                                                            const context = canvas.getContext('2d')!;

                                                                                                                                                                                                const centerX = size / 2;
                                                                                                                                                                                                    const centerY = size / 2;
                                                                                                                                                                                                        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);

                                                                                                                                                                                                            const color = new THREE.Color(baseColor);
                                                                                                                                                                                                                gradient.addColorStop(0, `hsl(${color.getHSL({h:0,s:0,l:0}).h * 360}, 80%, 60%)`);
                                                                                                                                                                                                                    gradient.addColorStop(0.7, `hsl(${color.getHSL({h:0,s:0,l:0}).h * 360}, 70%, 40%)`);
                                                                                                                                                                                                                        gradient.addColorStop(1, `hsl(${color.getHSL({h:0,s:0,l:0}).h * 360}, 60%, 20%)`);

                                                                                                                                                                                                                            context.fillStyle = gradient;
                                                                                                                                                                                                                                context.fillRect(0, 0, size, size);

                                                                                                                                                                                                                                    // Add radial lines for sunburst effect
                                                                                                                                                                                                                                        const lines = 120;
                                                                                                                                                                                                                                            for (let i = 0; i < lines; i++) {
                                                                                                                                                                                                                                                      const angle = (i / lines) * Math.PI * 2;
                                                                                                                                                                                                                                                            const x1 = centerX + Math.cos(angle) * 50;
                                                                                                                                                                                                                                                                  const y1 = centerY + Math.sin(angle) * 50;
                                                                                                                                                                                                                                                                        const x2 = centerX + Math.cos(angle) * (size / 2);
                                                                                                                                                                                                                                                                              const y2 = centerY + Math.sin(angle) * (size / 2);

                                                                                                                                                                                                                                                                                    context.beginPath();
                                                                                                                                                                                                                                                                                          context.moveTo(x1, y1);
                                                                                                                                                                                                                                                                                                context.lineTo(x2, y2);
                                                                                                                                                                                                                                                                                                      context.strokeStyle = `rgba(0, 0, 0, ${0.1 + (i % 2) * 0.05})`;
                                                                                                                                                                                                                                                                                                            context.lineWidth = 0.5;
                                                                                                                                                                                                                                                                                                                  context.stroke();
                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                const texture = new THREE.CanvasTexture(canvas);
                                                                                                                                                                                                                                                    texture.wrapS = THREE.RepeatWrapping;
                                                                                                                                                                                                                                                        texture.wrapT = THREE.RepeatWrapping;
                                                                                                                                                                                                                                                            return texture;
                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                            // Material presets by watch component type
                                                                                                                                                                                                                                              getCaseMaterial(materialType: string, finish: string): THREE.MeshPhysicalMaterial {
                                                                                                                                                                                                                                                    switch (materialType.toLowerCase()) {
                                                                                                                                                                                                                                                            case 'stainless_steel':
                                                                                                                                                                                                                                                                          return finish === 'polished' ? this.createPolishedSteel() : 
                                                                                                                                                                                                                                                                                         finish === 'brushed' ? this.createBrushedSteel() : 
                                                                                                                                                                                                                                                                                                        this.createSatinFinishSteel();
                                                                                                                                                                                                                                                                                                              case 'titanium':
                                                                                                                                                                                                                                                                                                                          return finish === 'polished' ? this.createPolishedTitanium() : this.createBrushedTitanium();
                                                                                                                                                                                                                                                                                                                                case 'gold':
                                                                                                                                                                                                                                                                                                                                            return finish === 'rose' ? this.createRoseGold() : this.createYellowGold();
                                                                                                                                                                                                                                                                                                                                                  case 'pvd_black':
                                                                                                                                                                                                                                                                                                                                                              return this.createBlackPVD();
                                                                                                                                                                                                                                                                                                                                                                    case 'ceramic':
                                                                                                                                                                                                                                                                                                                                                                                return finish === 'white' ? this.createWhiteCeramic() : this.createBlackCeramic();
                                                                                                                                                                                                                                                                                                                                                                                      default:
                                                                                                                                                                                                                                                                                                                                                                                                  return this.createPolishedSteel();
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                  getDialMaterial(dialType: string, color: number): THREE.MeshPhysicalMaterial {
                                                                                                                                                                                                                                                          switch (dialType.toLowerCase()) {
                                                                                                                                                                                                                                                                  case 'sunburst':
                                                                                                                                                                                                                                                                                return this.createSunburstDial(color);
                                                                                                                                                                                                                                                                                      case 'guilloche':
                                                                                                                                                                                                                                                                                                  return this.createGuillocheDial(color);
                                                                                                                                                                                                                                                                                                        case 'mother_of_pearl':
                                                                                                                                                                                                                                                                                                                    return this.createMotherOfPearlDial();
                                                                                                                                                                                                                                                                                                                          default:
                                                                                                                                                                                                                                                                                                                                      return new THREE.MeshPhysicalMaterial({
                                                                                                                                                                                                                                                                                                                                                    color: color,
                                                                                                                                                                                                                                                                                                                                                              metalness: 0.05,
                                                                                                                                                                                                                                                                                                                                                                        roughness: 0.9,
                                                                                                                                                                                                                                                                                                                                                                                  envMap: this.environmentMap,
                                                                                                                                                                                                                                                                                                                                                                                            envMapIntensity: 0.1,
                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                                                                                getCrystalMaterial(crystalType: string): THREE.MeshPhysicalMaterial {
                                                                                                                                                                                                                                                                                                                                        switch (crystalType.toLowerCase()) {
                                                                                                                                                                                                                                                                                                                                                case 'sapphire':
                                                                                                                                                                                                                                                                                                                                                              return this.createSapphireCrystal();
                                                                                                                                                                                                                                                                                                                                                                    case 'mineral':
                                                                                                                                                                                                                                                                                                                                                                                return this.createMineralCrystal();
                                                                                                                                                                                                                                                                                                                                                                                      default:
                                                                                                                                                                                                                                                                                                                                                                                                  return this.createMineralCrystal();
                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                      // Dynamic material updates
                                                                                                                                                                                                                                                                                                                                        updateEnvironmentIntensity(intensity: number) {
                                                                                                                                                                                                                                                                                                                                              // Update all materials with new environment intensity
                                                                                                                                                                                                                                                                                                                                                  // This method would iterate through all active materials
                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                          dispose() {
                                                                                                                                                                                                                                                                                                                                                    if (this.environmentMap) {
                                                                                                                                                                                                                                                                                                                                                            this.environmentMap.dispose();
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                                                          export const materialLibrary = new WatchMaterialLibrary();
                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                      })
                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                            }
                                                                                                                                                                      }
                                                                                                                                                                      })
                                                                                                                                                                }
                                                                                                                                                                })
                                                                                                                                                        }
                                                                                                                                                          })
                                                                                                                                                    }
                                                                                                                                                  })
                                                                                                                                      }
                                                                                                                                          })
                                                                                                                          }
                                                                                                                          })
                                                                                                                }
                                                                                                                })
                                                                                                        }
                                                                                                          })
                                                                                                    }
                                                                                                    })
                                                                                            }
                                                                                              })
                                                                                        }
                                                                                        })
                                                                                }
                                                                                })
                                                                      }
                                                                      })
                                                              }
                                                                })
                                                        }
                                                          })
                                                    }
                                                    })
                                            }
                                                })
                                }
                                  })
                            }
                              ]
                       
                }
              }
}