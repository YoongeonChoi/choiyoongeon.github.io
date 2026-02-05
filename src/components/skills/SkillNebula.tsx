"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useMotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { SiteMetadata } from "@/lib/supabase/types";

// Shader for the nebula particles
const vertexShader = `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  
  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 color;
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  
  void main() {
    gl_FragColor = vec4(color * vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
    if (gl_FragColor.a < 0.1) discard;
  }
`;

interface Skill {
    name: string;
    category: "frontend" | "backend" | "tools" | "design";
    level: number;
}

const defaultSkills: Skill[] = [
    { name: "React", category: "frontend", level: 98 },
    { name: "Next.js", category: "frontend", level: 95 },
    { name: "TypeScript", category: "frontend", level: 92 },
    { name: "Three.js", category: "frontend", level: 88 },
    { name: "WebGPU", category: "frontend", level: 85 },
    { name: "Node.js", category: "backend", level: 90 },
    { name: "PostgreSQL", category: "backend", level: 85 },
    { name: "Supabase", category: "backend", level: 88 },
    { name: "GraphQL", category: "backend", level: 82 },
    { name: "Figma", category: "design", level: 90 },
    { name: "UI/UX", category: "design", level: 92 },
    { name: "Motion", category: "design", level: 88 },
];

const categoryColors = {
    frontend: new THREE.Color(0x6366f1), // Indigo
    backend: new THREE.Color(0x10b981), // Emerald
    tools: new THREE.Color(0xf59e0b), // Amber
    design: new THREE.Color(0xec4899), // Pink
};

export default function SkillNebula() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const frameRef = useRef<number>(0);
    const particlesRef = useRef<THREE.Points | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    const prefersReducedMotion = useReducedMotion();
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    // Fetch skills from Supabase site_metadata
    const { data: metadata } = useSupabaseQuery<SiteMetadata>("site_metadata");

    // Parse skills from metadata or fallback to default
    const skills = useMemo(() => {
        if (!metadata) return defaultSkills;
        const skillsData = metadata.find(m => m.key === "skills");
        return skillsData ? (skillsData.value as unknown as Skill[]) : defaultSkills;
    }, [metadata]);

    useEffect(() => {
        if (!containerRef.current || prefersReducedMotion) return;

        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        // Add subtle fog for depth
        scene.fog = new THREE.FogExp2(0x000000, 0.002);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 2000);
        camera.position.z = 1000;
        cameraRef.current = camera;

        // Renderer (using WebGLRenderer as robust fallback/standard for now, 
        // configured for high performance to simulate WebGPU feel)
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Particle System
        const particleCount = 2000; // High density for nebula feel
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Spiral galaxy distribution
            const i3 = i * 3;
            const radius = Math.random() * 500 + 100;
            const spinAngle = radius * 0.005;
            const branchAngle = (i % 3) * ((2 * Math.PI) / 3);

            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY * 2; // Flatter disk
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            // Colors based on categories (mapped loosely to branches)
            const categoryKeys = Object.keys(categoryColors) as Array<keyof typeof categoryColors>;
            const category = categoryKeys[i % categoryKeys.length];
            color.set(categoryColors[category]);

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 5 + 1; // Varying star sizes
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Create a generated texture for the particles
        const getTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const context = canvas.getContext('2d');
            if (context) {
                const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
                gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                context.fillStyle = gradient;
                context.fillRect(0, 0, 32, 32);
            }
            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
                pointTexture: { value: getTexture() }
            },
            vertexShader,
            fragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current = particles;

        // Interactive Raycaster for 'Skills' (represented as larger glowing orbs)
        // For this visual nebula, we'll keep it purely atmospheric and use HTML overlay for text interaction
        // to ensure accessibility and performance.

        // Animation Loop
        let time = 0;
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            time += 0.002;

            // Rotate the entire galaxy slowly
            particles.rotation.y = time * 0.1;

            // Mouse interaction - tilt effect
            const targetRotationX = mouseRef.current.y * 0.5;
            const targetRotationZ = mouseRef.current.x * 0.5;

            particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.05;
            particles.rotation.z += (targetRotationZ - particles.rotation.z) * 0.05;

            // Pulse sizes
            const sizes = geometry.attributes.size.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                sizes[i] = (Math.sin(time * 5 + i) * 0.5 + 1) * (Math.random() * 5 + 1);
            }
            geometry.attributes.size.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            // Normalized coordinates -1 to 1
            mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        };

        container.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousemove', handleMouseMove);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [prefersReducedMotion, skills]);

    return (
        <div className="relative w-full h-[600px] overflow-hidden rounded-3xl bg-surface-secondary/20 backdrop-blur-sm border border-white/5">
            <div ref={containerRef} className="absolute inset-0 z-0" />

            {/* HTML Overlay for Skill Labels (Accessibility + SEO) */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 max-w-4xl w-full">
                    {Object.keys(categoryColors).map((cat) => (
                        <div key={cat} className="space-y-4">
                            <h3 className="text-sm uppercase tracking-wider text-text-muted font-bold opacity-70 border-b border-white/10 pb-2">{cat}</h3>
                            <ul className="space-y-2 pointer-events-auto">
                                {skills.filter(s => s.category === cat).map(skill => (
                                    <li
                                        key={skill.name}
                                        className="group flex items-center justify-between text-text-secondary hover:text-white transition-colors cursor-pointer"
                                        onMouseEnter={() => setHoveredSkill(skill.name)}
                                        onMouseLeave={() => setHoveredSkill(null)}
                                    >
                                        <span className="text-lg font-light">{skill.name}</span>
                                        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 px-2 py-0.5 rounded-full">
                                            {skill.level}%
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {prefersReducedMotion && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-secondary">
                    <p className="text-text-secondary">3D Visualization Disabled</p>
                </div>
            )}
        </div>
    );
}
