import { notFound } from "next/navigation";
import { ProjectDetailClient } from "./client";

// Sample projects
const projects: Record<string, {
    title: string;
    description: string;
    image: string;
    techStack: string[];
    problem: string;
    solution: string;
    reflection: string;
    githubUrl?: string;
    liveUrl?: string;
}> = {
    "portfolio-2026": {
        title: "Next-Gen Portfolio Platform",
        description: "A corporate-grade portfolio with Spatial Minimalism design, WebGPU graphics, and Passkey authentication.",
        image: "/images/projects/portfolio.svg",
        techStack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "Three.js", "WebAuthn", "Supabase"],
        problem: "Traditional portfolios fail to demonstrate technical competence and design sensibility simultaneously.",
        solution: "Built a platform leveraging cutting-edge technologies while adhering to rigorous UI/UX standards.",
        reflection: "This project reinforced the importance of balancing innovation with accessibility.",
        githubUrl: "https://github.com/choiyoongeon/portfolio",
        liveUrl: "https://choiyoongeon.github.io",
    },
    "ai-dashboard": {
        title: "AI Analytics Dashboard",
        description: "Real-time analytics platform with ML-powered insights and interactive data visualizations.",
        image: "/images/projects/dashboard.svg",
        techStack: ["React", "Python", "TensorFlow", "D3.js", "FastAPI", "PostgreSQL"],
        problem: "Enterprise clients needed to visualize complex ML model outputs without data science expertise.",
        solution: "Developed a dashboard that transforms raw model outputs into intuitive visualizations.",
        reflection: "The biggest challenge was making technical information accessible to non-technical stakeholders.",
        githubUrl: "https://github.com/choiyoongeon/ai-dashboard",
    },
    "mobile-app": {
        title: "Cross-Platform Mobile App",
        description: "Native-quality mobile experience built with React Native and modern design principles.",
        image: "/images/projects/mobile.svg",
        techStack: ["React Native", "Expo", "TypeScript", "Reanimated", "Zustand"],
        problem: "Client needed a single codebase delivering native experiences on iOS and Android.",
        solution: "Used React Native with Reanimated 3 for 60fps animations and platform-specific adaptations.",
        reflection: "React Native has matured significantly for native-quality experiences.",
    },
    "design-system": {
        title: "Enterprise Design System",
        description: "Comprehensive component library with accessibility-first approach and documentation.",
        image: "/images/projects/design-system.svg",
        techStack: ["React", "Storybook", "Figma", "CSS Variables", "Radix UI"],
        problem: "Growing company with multiple product teams had inconsistent UIs and duplicated components.",
        solution: "Created a unified design system with tokens, components, and comprehensive documentation.",
        reflection: "Design systems are more about people than technology.",
    },
};

export function generateStaticParams() {
    return Object.keys(projects).map((slug) => ({ slug }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const project = projects[slug];

    if (!project) {
        notFound();
    }

    return <ProjectDetailClient project={project} />;
}
