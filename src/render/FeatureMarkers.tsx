import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useWorldStore } from '../store/useWorldStore';

const TYPE_COLORS: Record<string, string> = {
  mountain_peak:  '#b0b0c8',
  natural_harbor: '#3090e0',
  fertile_plain:  '#40c040',
  oasis:          '#e0c030',
  river_valley:   '#30b0b0',
};

export const FeatureMarkers: React.FC = () => {
  const { worldData, activeLayers, setSelectedFeature } = useWorldStore();
  const { gl } = useThree();

  // Reset cursor when component unmounts (e.g. layer toggled off while hovering)
  useEffect(() => {
    return () => { gl.domElement.style.cursor = 'auto'; };
  }, [gl]);

  if (!activeLayers.features || !worldData?.features?.length) return null;

  return (
    <group>
      {worldData.features.map((feature) => {
        const color = TYPE_COLORS[feature.type] ?? '#888888';
        const [px, py, pz] = feature.position;
        const norm = Math.sqrt(px * px + py * py + pz * pz) || 1;
        const pos: [number, number, number] = [
          (px / norm) * 1.035,
          (py / norm) * 1.035,
          (pz / norm) * 1.035,
        ];
        return (
          <mesh
            key={feature.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFeature(feature);
            }}
            onPointerOver={() => { gl.domElement.style.cursor = 'pointer'; }}
            onPointerOut={() => { gl.domElement.style.cursor = 'auto'; }}
          >
            <octahedronGeometry args={[0.009, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};
