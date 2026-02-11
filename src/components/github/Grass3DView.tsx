"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ContributionDay } from "@/lib/validation/schemas";
import * as THREE from "three";
import { GrassTooltip } from "./GrassTooltip";

const LEVEL_COLORS: Record<string, string> = {
    NONE: "#161b22",
    FIRST_QUARTILE: "#0e4429",
    SECOND_QUARTILE: "#006d32",
    THIRD_QUARTILE: "#26a641",
    FOURTH_QUARTILE: "#39d353",
};

const LEVEL_HEIGHTS: Record<string, number> = {
    NONE: 0.1,
    FIRST_QUARTILE: 0.4,
    SECOND_QUARTILE: 0.8,
    THIRD_QUARTILE: 1.2,
    FOURTH_QUARTILE: 1.6,
};

interface ContributionBarProps {
  day: ContributionDay;
  position: [number, number, number];
  phase: number;
  scrollEnergy: number;
  onHover: (day: ContributionDay | null, event?: THREE.Event) => void;
}

function ContributionBar({
  day,
  position,
  phase,
  scrollEnergy,
  onHover,
}: ContributionBarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const height = LEVEL_HEIGHTS[day.contributionLevel];
  const color = LEVEL_COLORS[day.contributionLevel];

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const t = clock.getElapsedTime();
    const sway = Math.sin(t * 1.35 + phase) * 0.032 * (0.35 + scrollEnergy);
    const targetScale = (hovered ? 1.26 : 1) + scrollEnergy * 0.04;

    meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1;
    meshRef.current.rotation.x += (sway - meshRef.current.rotation.x) * 0.08;
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], height / 2, position[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(day, e);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial
        color={hovered ? "#988dff" : color}
        emissive={hovered ? "#6155ff" : "#000000"}
        emissiveIntensity={hovered ? 0.25 : 0}
        roughness={0.38}
        metalness={0.22}
      />
    </mesh>
  );
}

interface SceneProps {
  weeks: Array<{ contributionDays: ContributionDay[] }>;
  onHover: (day: ContributionDay | null) => void;
  scrollEnergy: number;
  pointerTilt: { x: number; y: number };
}

function Scene({ weeks, onHover, scrollEnergy, pointerTilt }: SceneProps) {
  const bars = useMemo(() => {
    const items: Array<{
      day: ContributionDay;
      position: [number, number, number];
      phase: number;
    }> = [];

    const totalWeeks = weeks.length;
    const offsetX = -totalWeeks / 2;

    weeks.forEach((week, weekIdx) => {
      week.contributionDays.forEach((day, dayIdx) => {
        items.push({
          day,
          position: [(weekIdx + offsetX) * 1, 0, dayIdx * 1],
          phase: weekIdx * 0.3 + dayIdx * 0.14,
        });
      });
    });

    return items;
  }, [weeks]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const t = clock.getElapsedTime();
    const autoRotate = Math.sin(t * (0.22 + scrollEnergy * 0.18)) * 0.08;
    const targetY = autoRotate + pointerTilt.x * 0.24 + scrollEnergy * 0.08;
    const targetX = -0.22 + pointerTilt.y * 0.15;

    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.06;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.05, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[weeks.length + 2, 10]} />
        <meshStandardMaterial
          color="#0a1020"
          roughness={0.76}
          metalness={0.28}
          transparent
          opacity={0.52}
        />
      </mesh>

      {bars.map((bar, i) => (
        <ContributionBar
          key={i}
          day={bar.day}
          position={bar.position}
          phase={bar.phase}
          scrollEnergy={scrollEnergy}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

interface Grass3DViewProps {
  weeks: Array<{ contributionDays: ContributionDay[] }>;
  scrollEnergy: number;
}

/**
 * Three.js / React Three Fiber 3D elevation view of GitHub contributions.
 * Each day is a 3D bar whose height = contribution level.
 * Orbit controls for rotation, hover for details.
 */
export function Grass3DView({ weeks, scrollEnergy }: Grass3DViewProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [pointerTilt, setPointerTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2;

    setTooltipPos({ x: e.clientX, y: e.clientY });
    setPointerTilt({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-overlay"
      style={{ height: 320 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointerTilt({ x: 0, y: 0 })}
    >
      <GrassTooltip day={hoveredDay} position={tooltipPos} visible={hoveredDay !== null} />
      <Canvas
        camera={{ position: [0, 15, 20], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        gl={{ powerPreference: "high-performance", antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.3} color="#6f63ff" />
        <Scene
          weeks={weeks}
          onHover={setHoveredDay}
          scrollEnergy={scrollEnergy}
          pointerTilt={pointerTilt}
        />
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.4 + scrollEnergy * 0.7}
        />
      </Canvas>
    </div>
  );
}
