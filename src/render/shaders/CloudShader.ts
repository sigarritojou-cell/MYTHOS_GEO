import * as THREE from 'three';

export const CloudShader = {
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      float bands = 0.5 + 0.5 * sin(vUv.y * 20.0 + uTime * 0.1);
      float alpha = smoothstep(0.55, 0.8, bands) * 0.15;
      gl_FragColor = vec4(vec3(1.0), alpha);
    }
  `,
} satisfies THREE.ShaderMaterialParameters;
