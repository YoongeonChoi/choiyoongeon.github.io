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
    onHover: (day: ContributionDay | null, event?: THREE.Event) => void;
}

function ContributionBar({ day, position, onHover }: ContributionBarProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const height = LEVEL_HEIGHTS[day.contributionLevel];
    const color = LEVEL_COLORS[day.contributionLevel];

    useFrame(() => {
        if (meshRef.current) {
            const targetScale = hovered ? 1.3 : 1;
            meshRef.current.scale.y +=
                (targetScale - meshRef.current.scale.y) * 0.1;
        }
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
                color={hovered ? "#818cf8" : color}
                emissive={hovered ? "#6366f1" : "#000000"}
                emissiveIntensity={hovered ? 0.3 : 0}
                roughness={0.4}
                metalness={0.1}
            />
        </mesh>
    );
}

interface SceneProps {
    weeks: Array<{ contributionDays: ContributionDay[] }>;
    onHover: (day: ContributionDay | null) => void;
}

function Scene({ weeks, onHover }: SceneProps) {
    const bars = useMemo(() => {
        const items: Array<{
            day: ContributionDay;
            position: [number, number, number];
        }> = [];

        const totalWeeks = weeks.length;
        const offsetX = -totalWeeks / 2;

        weeks.forEach((week, weekIdx) => {
            week.contributionDays.forEach((day, dayIdx) => {
                items.push({
                    day,
                    position: [(weekIdx + offsetX) * 1, 0, dayIdx * 1],
                });
            });
        });

        return items;
    }, [weeks]);

    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y =
                Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Base plane */}
            <mesh position={[0, -0.05, 3]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[weeks.length + 2, 10]} />
                <meshStandardMaterial
                    color="#0a0a1a"
                    roughness={0.8}
                    metalness={0.2}
                    transparent
                    opacity={0.5}
                />
            </mesh>

            {/* Contribution bars */}
            {bars.map((bar, i) => (
                <ContributionBar
                    key={i}
                    day={bar.day}
                    position={bar.position}
                    onHover={onHover}
                />
            ))}
        </group>
    );
}

interface Grass3DViewProps {
    weeks: Array<{ contributionDays: ContributionDay[] }>;
}

/**
 * Three.js / React Three Fiber 3D elevation view of GitHub contributions.
 * Each day is a 3D bar whose height = contribution level.
 * Orbit controls for rotation, hover for details.
 */
export function Grass3DView({ weeks }: Grass3DViewProps) {
    const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative rounded-xl overflow-hidden"
            style={{ height: 300 }}
            onPointerMove={handlePointerMove}
        >
            <GrassTooltip
                day={hoveredDay}
                position={tooltipPos}
                visible={hoveredDay !== null}
            />
            <Canvas
                camera={{ position: [0, 15, 20], fov: 45 }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 20, 10]} intensity={0.8} />
                <pointLight position={[-10, 10, -10]} intensity={0.3} color="#6366f1" />
                <Scene weeks={weeks} onHover={setHoveredDay} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={10}
                    maxDistance={40}
                    maxPolarAngle={Math.PI / 2.2}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
