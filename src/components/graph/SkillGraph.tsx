"use client";

import { useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";

const GITHUB_URL = "https://github.com/YoongeonChoi";

interface ProjectNode {
  id: string;
  label: string;
  repo: string;
  skills: string[];
}

const PROJECTS: ProjectNode[] = [
  {
    id: "trust-center",
    label: "Zero-Trust\nTrust Center",
    repo: `${GITHUB_URL}/YoongeonChoi.github.io`,
    skills: ["Next.js", "TypeScript", "GitHub Actions", "Cloudflare"],
  },
  {
    id: "portfolio-motion",
    label: "Portfolio\nMotion System",
    repo: `${GITHUB_URL}/YoongeonChoi.github.io`,
    skills: ["CSS", "Web Animations", "Lighthouse", "Framer Motion"],
  },
  {
    id: "blog-engine",
    label: "Writer-First\nBlog Engine",
    repo: `${GITHUB_URL}/YoongeonChoi.github.io`,
    skills: ["Markdown", "Rehype", "Zod", "RSS"],
  },
];

function buildElements(): cytoscape.ElementDefinition[] {
  const elements: cytoscape.ElementDefinition[] = [];

  elements.push({
    data: {
      id: "center",
      label: "Yoongeon\nChoi",
      type: "center",
      href: GITHUB_URL,
    },
  });

  const addedSkills = new Set<string>();

  for (const proj of PROJECTS) {
    elements.push({
      data: {
        id: proj.id,
        label: proj.label,
        type: "project",
        href: proj.repo,
      },
    });
    elements.push({
      data: { source: "center", target: proj.id, type: "primary" },
    });

    for (const skill of proj.skills) {
      const skillId = `skill-${skill.replace(/\s+/g, "-").toLowerCase()}`;
      if (!addedSkills.has(skillId)) {
        addedSkills.add(skillId);
        elements.push({
          data: { id: skillId, label: skill, type: "skill" },
        });
      }
      elements.push({
        data: { source: proj.id, target: skillId, type: "secondary" },
      });
    }
  }

  return elements;
}

function getStyles(): cytoscape.StylesheetStyle[] {
  return [
    {
      selector: "node",
      style: {
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "text-wrap": "wrap",
        "text-max-width": "100px",
        color: "#a0b4c8",
        "font-size": "10px",
        "font-family": "'Space Grotesk', system-ui, sans-serif",
        "font-weight": 500,
        "min-zoomed-font-size": 0,
        "overlay-opacity": 0,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='center']",
      style: {
        width: 130,
        height: 130,
        shape: "ellipse",
        "background-color": "#ff6b3d",
        "background-opacity": 1,
        "border-width": 4,
        "border-color": "rgba(255, 140, 90, 0.6)",
        "font-size": "15px",
        "font-weight": 700,
        color: "#ffffff",
        "text-outline-color": "rgba(0,0,0,0.5)",
        "text-outline-width": 2,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='project']",
      style: {
        width: 90,
        height: 90,
        shape: "ellipse",
        "background-color": "#1a2536",
        "background-opacity": 1,
        "border-width": 2,
        "border-color": "rgba(255, 107, 61, 0.5)",
        "font-size": "11px",
        color: "#ff8c5a",
        "font-weight": 600,
        "text-outline-color": "rgba(0,0,0,0.4)",
        "text-outline-width": 1,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='skill']",
      style: {
        width: 56,
        height: 56,
        shape: "ellipse",
        "background-color": "#141e2e",
        "background-opacity": 0.95,
        "border-width": 1,
        "border-color": "rgba(160, 180, 200, 0.15)",
        "font-size": "8.5px",
        color: "#7a8fa3",
        "text-outline-color": "rgba(0,0,0,0.3)",
        "text-outline-width": 0.5,
      } as cytoscape.Css.Node,
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "rgba(160, 180, 200, 0.1)",
        "curve-style": "unbundled-bezier",
        opacity: 0.6,
      },
    },
    {
      selector: "edge[type='primary']",
      style: {
        width: 2,
        "line-color": "rgba(255, 107, 61, 0.25)",
        opacity: 0.8,
      },
    },
    {
      selector: "node:active",
      style: { "overlay-opacity": 0 } as cytoscape.Css.Node,
    },
    {
      selector: "node:grabbed",
      style: {
        "border-color": "rgba(255, 140, 90, 1)",
        "border-width": 4,
      } as cytoscape.Css.Node,
    },
  ];
}

export function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const rafRef = useRef<number>(0);

  const handleTap = useCallback((evt: cytoscape.EventObject) => {
    const href = evt.target.data("href");
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: buildElements(),
      style: getStyles(),
      layout: {
        name: "concentric",
        concentric: (node: cytoscape.NodeSingular) => {
          const t = node.data("type");
          if (t === "center") return 3;
          if (t === "project") return 2;
          return 1;
        },
        levelWidth: () => 1,
        minNodeSpacing: 80,
        animate: false,
        fit: true,
        padding: 60,
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: false,
    });

    cyRef.current = cy;

    cy.on("tap", "node[type='center'], node[type='project']", handleTap);

    cy.on("mouseover", "node[type='center'], node[type='project']", (evt) => {
      containerRef.current!.style.cursor = "pointer";
      const n = evt.target;
      const isCenter = n.data("type") === "center";
      n.stop().animate(
        {
          style: {
            "border-width": isCenter ? 6 : 4,
            "border-color": "rgba(255, 140, 90, 1)",
            width: isCenter ? 140 : 98,
            height: isCenter ? 140 : 98,
          },
        },
        { duration: 250 }
      );
      n.connectedEdges().stop().animate(
        { style: { opacity: 1, width: 3, "line-color": "rgba(255,107,61,0.5)" } },
        { duration: 250 }
      );
      n.neighborhood("node").stop().animate(
        { style: { "border-color": "rgba(255,140,90,0.4)" } },
        { duration: 250 }
      );
    });

    cy.on("mouseout", "node[type='center'], node[type='project']", (evt) => {
      containerRef.current!.style.cursor = "default";
      const n = evt.target;
      const isCenter = n.data("type") === "center";
      n.stop().animate(
        {
          style: {
            "border-width": isCenter ? 4 : 2,
            "border-color": isCenter
              ? "rgba(255,140,90,0.6)"
              : "rgba(255,107,61,0.5)",
            width: isCenter ? 130 : 90,
            height: isCenter ? 130 : 90,
          },
        },
        { duration: 350 }
      );
      n.connectedEdges().stop().animate(
        {
          style: {
            opacity: n.connectedEdges().first().data("type") === "primary" ? 0.8 : 0.6,
            width: n.connectedEdges().first().data("type") === "primary" ? 2 : 1,
            "line-color":
              n.connectedEdges().first().data("type") === "primary"
                ? "rgba(255,107,61,0.25)"
                : "rgba(160,180,200,0.1)",
          },
        },
        { duration: 350 }
      );
      n.neighborhood("node").stop().animate(
        {
          style: {
            "border-color": n.neighborhood("node").first().data("type") === "project"
              ? "rgba(255,107,61,0.5)"
              : "rgba(160,180,200,0.15)",
          },
        },
        { duration: 350 }
      );
    });

    /* Gentle drift after initial concentric layout */
    const driftVelocities = new Map<string, { vx: number; vy: number }>();
    cy.nodes().forEach((node) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.1 + Math.random() * 0.2;
      driftVelocities.set(node.id(), {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    });

    let lastTime = performance.now();
    const originPositions = new Map<string, { x: number; y: number }>();
    cy.nodes().forEach((node) => {
      originPositions.set(node.id(), { ...node.position() });
    });

    const drift = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;

      cy.nodes().forEach((node) => {
        if (node.grabbed()) return;
        const vel = driftVelocities.get(node.id());
        const origin = originPositions.get(node.id());
        if (!vel || !origin) return;

        const pos = node.position();

        /* Spring back toward original concentric position */
        const dx = origin.x - pos.x;
        const dy = origin.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const spring = 0.0015 * dist;
        if (dist > 1) {
          vel.vx += (dx / dist) * spring * dt;
          vel.vy += (dy / dist) * spring * dt;
        }

        /* Repulsion from nearby nodes */
        node.neighborhood("node").forEach((other: cytoscape.NodeSingular) => {
          const ox = other.position("x") - pos.x;
          const oy = other.position("y") - pos.y;
          const od = Math.sqrt(ox * ox + oy * oy);
          if (od < 150 && od > 1) {
            const push = 0.15 / (od * od);
            vel.vx -= (ox / od) * push * dt;
            vel.vy -= (oy / od) * push * dt;
          }
        });

        /* Random jitter for organic feel */
        vel.vx += (Math.random() - 0.5) * 0.025 * dt;
        vel.vy += (Math.random() - 0.5) * 0.025 * dt;

        /* Damping */
        vel.vx *= 0.965;
        vel.vy *= 0.965;

        node.position({
          x: pos.x + vel.vx * 0.5 * dt,
          y: pos.y + vel.vy * 0.5 * dt,
        });
      });

      rafRef.current = requestAnimationFrame(drift);
    };

    cy.ready(() => {
      cy.fit(undefined, 60);
      rafRef.current = requestAnimationFrame(drift);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cy.destroy();
    };
  }, [handleTap]);

  return <div ref={containerRef} className="skill-graph-canvas" />;
}
