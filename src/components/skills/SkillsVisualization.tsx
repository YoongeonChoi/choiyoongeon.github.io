"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { springs } from "@/lib/motion/config";

interface Skill {
    name: string;
    category: "frontend" | "backend" | "tools" | "design";
    level: number; // 0-100
}

const skills: Skill[] = [
    // Frontend
    { name: "React", category: "frontend", level: 95 },
    { name: "Next.js", category: "frontend", level: 92 },
    { name: "TypeScript", category: "frontend", level: 90 },
    { name: "Tailwind", category: "frontend", level: 88 },
    { name: "Three.js", category: "frontend", level: 75 },
    // Backend
    { name: "Node.js", category: "backend", level: 85 },
    { name: "Python", category: "backend", level: 80 },
    { name: "PostgreSQL", category: "backend", level: 78 },
    { name: "GraphQL", category: "backend", level: 75 },
    // Tools
    { name: "Git", category: "tools", level: 90 },
    { name: "Docker", category: "tools", level: 72 },
    { name: "AWS", category: "tools", level: 68 },
    // Design
    { name: "Figma", category: "design", level: 85 },
    { name: "UI/UX", category: "design", level: 82 },
];

const categoryColors = {
    frontend: new THREE.Color(0x6366f1), // Indigo
    backend: new THREE.Color(0x10b981), // Emerald
    tools: new THREE.Color(0xf59e0b), // Amber
    design: new THREE.Color(0xec4899), // Pink
};

export function SkillsVisualization() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const frameRef = useRef<number>(0);
    const nodesRef = useRef<THREE.Mesh[]>([]);
    const linesRef = useRef<THREE.Line[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    const prefersReducedMotion = useReducedMotion();
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isWebGPU, setIsWebGPU] = useState(false);

    // Check WebGPU availability
    useEffect(() => {
        if (typeof navigator !== "undefined" && "gpu" in navigator) {
            setIsWebGPU(true);
        }
    }, []);

    // Initialize Three.js scene
    useEffect(() => {
        if (!containerRef.current || prefersReducedMotion) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0a0a0f, 5, 25);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 12;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x6366f1, 1.5, 30);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x10b981, 1, 25);
        pointLight2.position.set(-5, -3, 3);
        scene.add(pointLight2);

        // Create skill nodes in a 3D spiral/orbital layout
        const nodes: THREE.Mesh[] = [];
        const nodePositions: THREE.Vector3[] = [];

        skills.forEach((skill, index) => {
            const angle = (index / skills.length) * Math.PI * 4; // Two full rotations
            const radius = 3 + (skill.level / 100) * 2;
            const height = ((index / skills.length) - 0.5) * 6;

            const x = Math.cos(angle) * radius;
            const y = height;
            const z = Math.sin(angle) * radius;

            // Node geometry - size based on skill level
            const size = 0.15 + (skill.level / 100) * 0.25;
            const geometry = new THREE.IcosahedronGeometry(size, 1);
            const material = new THREE.MeshPhongMaterial({
                color: categoryColors[skill.category],
                emissive: categoryColors[skill.category],
                emissiveIntensity: 0.3,
                shininess: 100,
                transparent: true,
                opacity: 0.9,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.userData = { skill, originalPosition: new THREE.Vector3(x, y, z) };
            scene.add(mesh);
            nodes.push(mesh);
            nodePositions.push(new THREE.Vector3(x, y, z));
        });

        nodesRef.current = nodes;

        // Create connection lines between related skills
        const lines: THREE.Line[] = [];
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.15,
        });

        // Connect nodes in same category
        for (let i = 0; i < skills.length; i++) {
            for (let j = i + 1; j < skills.length; j++) {
                if (skills[i].category === skills[j].category) {
                    const points = [nodePositions[i], nodePositions[j]];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial.clone());
                    scene.add(line);
                    lines.push(line);
                }
            }
        }

        linesRef.current = lines;

        // Add floating particles
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 0.03,
            transparent: true,
            opacity: 0.5,
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Animation loop
        let time = 0;
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            time += 0.005;

            // Rotate scene slowly
            scene.rotation.y = time * 0.1 + mouseRef.current.x * 0.3;
            scene.rotation.x = mouseRef.current.y * 0.2;

            // Animate nodes
            nodes.forEach((node, index) => {
                const skill = node.userData.skill as Skill;
                const original = node.userData.originalPosition as THREE.Vector3;

                // Floating motion
                node.position.y = original.y + Math.sin(time * 2 + index) * 0.1;

                // Pulse based on skill level
                const scale = 1 + Math.sin(time * 3 + index * 0.5) * 0.05;
                node.scale.setScalar(scale);

                // Highlight selected category
                const material = node.material as THREE.MeshPhongMaterial;
                if (selectedCategory && skill.category !== selectedCategory) {
                    material.opacity = 0.3;
                    material.emissiveIntensity = 0.1;
                } else {
                    material.opacity = 0.9;
                    material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
                }
            });

            // Rotate particles
            particles.rotation.y = time * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener("resize", handleResize);

        // Handle mouse movement
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        container.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("mousemove", handleMouseMove);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [prefersReducedMotion, selectedCategory]);

    const categories = ["frontend", "backend", "tools", "design"];

    return (
        <div className="relative w-full">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === null
                            ? "bg-accent-primary text-white"
                            : "bg-surface-secondary text-text-secondary hover:bg-surface-elevated"
                        }`}
                >
                    All Skills
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${selectedCategory === cat
                                ? "bg-accent-primary text-white"
                                : "bg-surface-secondary text-text-secondary hover:bg-surface-elevated"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 3D Visualization Container */}
            <div
                ref={containerRef}
                className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-surface-secondary to-surface-primary"
            >
                {prefersReducedMotion && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-text-muted">3D visualization disabled for reduced motion</p>
                    </div>
                )}

                {/* WebGPU Badge */}
                {isWebGPU && !prefersReducedMotion && (
                    <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-medium">
                        WebGPU Ready
                    </div>
                )}
            </div>

            {/* Skills Legend */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.smooth}
                className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {skills
                    .filter((s) => !selectedCategory || s.category === selectedCategory)
                    .map((skill) => (
                        <div
                            key={skill.name}
                            className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary/50"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor:
                                        skill.category === "frontend"
                                            ? "#6366f1"
                                            : skill.category === "backend"
                                                ? "#10b981"
                                                : skill.category === "tools"
                                                    ? "#f59e0b"
                                                    : "#ec4899",
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {skill.name}
                                </p>
                                <div className="mt-1 h-1 rounded-full bg-surface-elevated overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor:
                                                skill.category === "frontend"
                                                    ? "#6366f1"
                                                    : skill.category === "backend"
                                                        ? "#10b981"
                                                        : skill.category === "tools"
                                                            ? "#f59e0b"
                                                            : "#ec4899",
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="text-xs text-text-muted">{skill.level}%</span>
                        </div>
                    ))}
            </motion.div>
        </div>
    );
}
