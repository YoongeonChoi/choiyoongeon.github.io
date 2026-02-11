"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv - 0.5;

  vec2 mouse = (uMouse - 0.5) * 1.6;
  float distToMouse = length(centered - mouse * 0.3);

  float waveA = sin((uv.x * 9.0) + uTime * 0.45) * 0.02;
  float waveB = cos((uv.y * 12.0) - uTime * 0.35) * 0.018;
  float flow = noise((uv * 7.5) + vec2(uTime * 0.07, -uTime * 0.05));
  float grain = noise((uv * uResolution.xy / 280.0) + vec2(0.0, uTime * 0.04));

  float highlight = smoothstep(0.42, 0.0, distToMouse) * 0.28;
  float metal = flow * 0.38 + waveA + waveB + highlight;

  vec3 base = vec3(0.03, 0.04, 0.07);
  vec3 tint = vec3(0.39, 0.33, 1.0);

  vec3 color = base + metal * tint;
  color += (grain - 0.5) * 0.055;

  gl_FragColor = vec4(color, 0.42);
}
`;

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current) {
      return;
    }

    const shaderUniforms = materialRef.current.uniforms as {
      uTime: { value: number };
      uMouse: { value: THREE.Vector2 };
      uResolution: { value: THREE.Vector2 };
    };

    shaderUniforms.uTime.value += delta;
    shaderUniforms.uResolution.value.set(state.size.width, state.size.height);
    shaderUniforms.uMouse.value.lerp(mouseRef.current, 0.1);
  });

  return (
    <mesh
      onPointerMove={(event) => {
        mouseRef.current.set(event.uv?.x ?? 0.5, event.uv?.y ?? 0.5);
      }}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export function LiquidMetalShader() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-90"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 1], fov: 30 }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
