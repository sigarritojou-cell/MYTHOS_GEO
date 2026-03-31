import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useWorldStore } from '../store/useWorldStore';
import { AtmosphereShader } from './shaders/AtmosphereShader';
import { OceanShader } from './shaders/OceanShader';

export const PlanetRenderer: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const oceanRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const { worldData } = useWorldStore();

  const terrainGeometry = useMemo(() => {
    if (!worldData?.planetData) return null;

    const { vertices, colors, indices, elevations } = worldData.planetData;
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(vertices.length);
    const colorArray = new Float32Array(colors.length);

    for (let i = 0; i < vertices.length / 3; i++) {
      const elevation = elevations[i];
      const scale = 1.0 + Math.max(0, elevation - 0.5) * 0.3;
      positionArray[i * 3] = vertices[i * 3] * scale;
      positionArray[i * 3 + 1] = vertices[i * 3 + 1] * scale;
      positionArray[i * 3 + 2] = vertices[i * 3 + 2] * scale;
      colorArray[i * 3] = colors[i * 3];
      colorArray[i * 3 + 1] = colors[i * 3 + 1];
      colorArray[i * 3 + 2] = colors[i * 3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return mergeVertices(geometry);
  }, [worldData]);

  useFrame(({ clock }) => {
    if (oceanRef.current?.material instanceof THREE.ShaderMaterial) {
      oceanRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (atmosphereRef.current?.material instanceof THREE.ShaderMaterial) {
      atmosphereRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  if (!terrainGeometry) return null;

  return (
    <group>
      <mesh ref={meshRef} geometry={terrainGeometry}>
        <meshStandardMaterial vertexColors metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh ref={oceanRef}>
        <sphereGeometry args={[1.01, 128, 128]} />
        <shaderMaterial args={[OceanShader]} transparent />
      </mesh>
      <mesh ref={atmosphereRef} scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial args={[AtmosphereShader]} transparent side={THREE.BackSide} />
      </mesh>
    </group>
  );
};
