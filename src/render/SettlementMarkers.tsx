import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useWorldStore } from '../store/useWorldStore';
import { Settlement } from '../data/worldModel';

const TYPE_CONFIG: Record<Settlement['type'], { size: number; color: string }> = {
  capital: { size: 0.028, color: '#ffd700' },
  city:    { size: 0.018, color: '#e0e0ff' },
  town:    { size: 0.013, color: '#a0a0c0' },
  village: { size: 0.010, color: '#707090' },
  hamlet:  { size: 0.008, color: '#505070' },
};

export const SettlementMarkers: React.FC = () => {
  const { worldData, activeLayers, setSelectedSettlement } = useWorldStore();
  const { gl } = useThree();

  // Reset cursor when component unmounts (e.g. layer toggled off while hovering)
  useEffect(() => {
    return () => { gl.domElement.style.cursor = 'auto'; };
  }, [gl]);

  if (!activeLayers.settlements || !worldData?.settlements?.length) return null;

  return (
    <group>
      {worldData.settlements.map((settlement) => {
        const { size, color } = TYPE_CONFIG[settlement.type] ?? TYPE_CONFIG.hamlet;
        const [px, py, pz] = settlement.position;
        const norm = Math.sqrt(px * px + py * py + pz * pz) || 1;
        const pos: [number, number, number] = [
          (px / norm) * 1.03,
          (py / norm) * 1.03,
          (pz / norm) * 1.03,
        ];
        return (
          <mesh
            key={settlement.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSettlement(settlement);
            }}
            onPointerOver={() => { gl.domElement.style.cursor = 'pointer'; }}
            onPointerOut={() => { gl.domElement.style.cursor = 'auto'; }}
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};
