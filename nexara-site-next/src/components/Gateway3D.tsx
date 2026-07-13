'use client';
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type * as THREE from "three";

const { useRef } = React;

function NeoObject() {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const o = g.current; if (!o) return;
    o.rotation.x += dt * 0.06;
    o.rotation.y += dt * 0.11;
    o.rotation.z = state.pointer.x * 0.45;
    const s = 1.45 * (1 + state.pointer.y * 0.06);
    o.scale.setScalar(s);
  });
  return (
    <group ref={g} position={[0, 0.15, 0]}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial color="#c8ff00" emissive="#c8ff00" emissiveIntensity={0.55}
          wireframe distort={0.5} speed={1.0} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function NeoScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ alpha: true, antialias: false }} style={{ position: "absolute", inset: 0 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 4]} intensity={2.2} color="#c8ff00" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#5b9dff" />
      <NeoObject />
    </Canvas>
  );
}

function TrustObject() {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const o = g.current; if (!o) return;
    o.rotation.y += dt * 0.13;
    o.rotation.x += (state.pointer.y * 0.3 - o.rotation.x) * 0.04;
    o.rotation.z += dt * 0.015;
  });
  return (
    <group ref={g} position={[0, 0.1, 0]} scale={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#66a0cc" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh scale={0.62}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#185fa5" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export function TrustScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ alpha: true, antialias: false }} style={{ position: "absolute", inset: 0 }}>
      <TrustObject />
    </Canvas>
  );
}
