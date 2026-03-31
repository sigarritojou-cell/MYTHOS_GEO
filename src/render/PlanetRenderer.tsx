import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useWorldStore } from '../store/useWorldStore';
import { AtmosphereShader } from './shaders/AtmosphereShader';
import { CloudShader } from './shaders/CloudShader';
import { OceanShader } from './shaders/OceanShader';
import { SettlementMarkers } from './SettlementMarkers';
import { FeatureMarkers } from './FeatureMarkers';
import { TradeRouteLines } from './TradeRouteLines';

/** Temperature gradient: cold blue → temperate green → hot red */
function tempToColor(t: number): [number, number, number] {
  if (t < 0.25) {
    const f = t / 0.25;
    return [f * 0.1, 0.2 + f * 0.4, 0.9 - f * 0.1];
  } else if (t < 0.5) {
    const f = (t - 0.25) / 0.25;
    return [0.1 + f * 0.2, 0.6 + f * 0.2, 0.8 - f * 0.5];
  } else if (t < 0.75) {
    const f = (t - 0.5) / 0.25;
    return [0.3 + f * 0.5, 0.8 - f * 0.1, 0.3 - f * 0.2];
  } else {
    const f = (t - 0.75) / 0.25;
    return [0.8 + f * 0.1, 0.7 - f * 0.5, 0.1 - f * 0.1];
  }
}

const BIOME_PALETTE: Record<string, [number, number, number]> = {
  Ocean:        [0.05, 0.18, 0.60],
  Snow:         [0.95, 0.98, 1.00],
  Mountain:     [0.55, 0.50, 0.48],
  Highlands:    [0.60, 0.45, 0.28],
  Desert:       [0.90, 0.75, 0.38],
  'Dry Plains': [0.72, 0.65, 0.22],
  Forest:       [0.08, 0.36, 0.12],
  Plains:       [0.28, 0.62, 0.20],
};

export const PlanetRenderer: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const oceanRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const { worldData, activeLayers } = useWorldStore();

  const terrainGeometry = useMemo(() => {
    if (!worldData?.planetData) return null;

    const { vertices, colors, indices, elevations, temperatures, biomes } = worldData.planetData;
    // mountainHeight 0–1 → elevation scale 0–0.6 (default 0.5 → 0.3, same as before)
    const elevScale = worldData.parameters.mountainHeight * 0.6;

    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(vertices.length);
    const colorArray = new Float32Array(colors.length);

    for (let i = 0; i < vertices.length / 3; i++) {
      const elevation = elevations[i];
      const scale = 1.0 + Math.max(0, elevation - 0.5) * elevScale;
      positionArray[i * 3]     = vertices[i * 3]     * scale;
      positionArray[i * 3 + 1] = vertices[i * 3 + 1] * scale;
      positionArray[i * 3 + 2] = vertices[i * 3 + 2] * scale;

      let r: number, g: number, b: number;
      if (activeLayers.climate) {
        [r, g, b] = tempToColor(temperatures[i]);
      } else if (activeLayers.biomes) {
        [r, g, b] = BIOME_PALETTE[biomes[i]] ?? [0.5, 0.5, 0.5];
      } else {
        r = colors[i * 3];
        g = colors[i * 3 + 1];
        b = colors[i * 3 + 2];
      }

      colorArray[i * 3]     = r;
      colorArray[i * 3 + 1] = g;
      colorArray[i * 3 + 2] = b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return mergeVertices(geometry);
  }, [worldData, activeLayers.climate, activeLayers.biomes]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (oceanRef.current?.material instanceof THREE.ShaderMaterial) {
      oceanRef.current.material.uniforms.uTime.value = t;
    }
    if (cloudRef.current?.material instanceof THREE.ShaderMaterial) {
      cloudRef.current.material.uniforms.uTime.value = t;
    }
    if (atmosphereRef.current?.material instanceof THREE.ShaderMaterial) {
      atmosphereRef.current.material.uniforms.uTime.value = t;
    }
  });

  if (!terrainGeometry) return null;

  return (
    <group>
      {/* Terrain — visibility toggled by layer */}
      <mesh ref={meshRef} geometry={terrainGeometry} visible={activeLayers.terrain}>
        <meshStandardMaterial vertexColors metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Ocean */}
      <mesh ref={oceanRef}>
        <sphereGeometry args={[1.01, 128, 128]} />
        <shaderMaterial args={[OceanShader]} transparent />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef} scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial args={[CloudShader]} transparent depthWrite={false} />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef} scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial args={[AtmosphereShader]} transparent side={THREE.BackSide} />
      </mesh>

      {/* Interactive overlay layers */}
      <TradeRouteLines />
      <SettlementMarkers />
      <FeatureMarkers />
    </group>
  );
};
