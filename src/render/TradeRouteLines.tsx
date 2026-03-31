import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '../store/useWorldStore';

const ROUTE_COLORS: Record<string, string> = {
  highway: '#e8a020',
  road: '#8888aa',
  river: '#3090e0',
  sea: '#20c0d0',
};

/** Build arc points along the sphere surface between two unit-sphere positions. */
function arcSegments(
  p1: [number, number, number],
  p2: [number, number, number],
  segments = 12,
  radius = 1.016,
): number[] {
  const v1 = new THREE.Vector3(...p1).normalize();
  const v2 = new THREE.Vector3(...p2).normalize();
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    pts.push(v1.clone().lerp(v2, i / segments).normalize().multiplyScalar(radius));
  }
  // Flatten into LineSegments pairs: [p0,p1, p1,p2, p2,p3 ...]
  const out: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
  }
  return out;
}

export const TradeRouteLines: React.FC = () => {
  const { worldData, activeLayers } = useWorldStore();

  const lineGroups = useMemo(() => {
    if (!worldData?.tradeRoutes?.length) return [];

    const grouped: Record<string, number[]> = {};
    for (const route of worldData.tradeRoutes) {
      if (!grouped[route.type]) grouped[route.type] = [];
      if (route.path.length < 2) continue;
      const p1 = route.path[0];
      const p2 = route.path[1];
      grouped[route.type].push(...arcSegments(p1, p2));
    }

    return Object.entries(grouped).map(([type, positions]) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
      return { type, geometry };
    });
  }, [worldData]);

  if (!activeLayers.tradeRoutes) return null;

  return (
    <group>
      {lineGroups.map(({ type, geometry }) => (
        <lineSegments key={type} geometry={geometry}>
          <lineBasicMaterial color={ROUTE_COLORS[type] ?? '#888888'} transparent opacity={0.65} />
        </lineSegments>
      ))}
    </group>
  );
};
