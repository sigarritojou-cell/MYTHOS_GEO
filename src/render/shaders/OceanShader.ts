import * as THREE from 'three';

export const OceanShader = {
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    uniform float uTime;
    void main() {
      float shimmer = 0.03 * sin(uTime * 1.5 + vNormal.x * 12.0 + vNormal.y * 8.0);
      vec3 base = vec3(0.05, 0.22, 0.55) + shimmer;
      gl_FragColor = vec4(base, 0.55);
    }
  `,
} satisfies THREE.ShaderMaterialParameters;
