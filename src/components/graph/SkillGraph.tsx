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
        "text-max-width": "90px",
        color: "#8a9bb0",
        "font-size": "9px",
        "font-family": "'Space Grotesk', sans-serif",
        "font-weight": 500,
        "min-zoomed-font-size": 0,
        "overlay-opacity": 0,
        "transition-property":
          "border-width, border-color, background-color, width, height, opacity",
        "transition-duration": "0.25s" as unknown as number,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='center']",
      style: {
        width: 110,
        height: 110,
        shape: "ellipse",
        "background-color": "#d4552d",
        "background-opacity": 0.95,
        "border-width": 3,
        "border-color": "rgba(239, 123, 82, 0.5)",
        "font-size": "14px",
        "font-weight": 700,
        color: "#ffffff",
        "text-outline-color": "rgba(0,0,0,0.35)",
        "text-outline-width": 1.5,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='project']",
      style: {
        width: 76,
        height: 76,
        shape: "ellipse",
        "background-color": "rgba(18, 25, 35, 0.92)",
        "border-width": 1.5,
        "border-color": "rgba(212, 85, 45, 0.35)",
        "font-size": "10px",
        color: "#ef7b52",
        "font-weight": 600,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='skill']",
      style: {
        width: 44,
        height: 44,
        shape: "ellipse",
        "background-color": "rgba(18, 25, 35, 0.75)",
        "border-width": 1,
        "border-color": "rgba(255,255,255,0.08)",
        "font-size": "7.5px",
        color: "#6b7d8e",
      } as cytoscape.Css.Node,
    },
    {
      selector: "edge",
      style: {
        width: 0.8,
        "line-color": "rgba(212, 85, 45, 0.12)",
        "curve-style": "unbundled-bezier",
        opacity: 0.5,
        "line-style": "solid",
      },
    },
    {
      selector: "edge[type='primary']",
      style: {
        width: 1.5,
        "line-color": "rgba(212, 85, 45, 0.3)",
        opacity: 0.7,
      },
    },
    {
      selector: "node:active",
      style: { "overlay-opacity": 0 } as cytoscape.Css.Node,
    },
    {
      selector: "node:grabbed",
      style: {
        "border-color": "rgba(239, 123, 82, 0.8)",
        "border-width": 3,
      } as cytoscape.Css.Node,
    },
  ];
}

/**
 * Obsidian-style continuously floating force-directed graph.
 * After the initial cose layout settles, nodes drift gently.
 */
export function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const rafRef = useRef<number>(0);

  const handleTap = useCallback((evt: cytoscape.EventObject) => {
    const node = evt.target;
    const href = node.data("href");
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: buildElements(),
      style: getStyles(),
      layout: { name: "preset" },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: false,
    });

    cyRef.current = cy;

    const layout = cy.layout({
      name: "cose",
      animate: true,
      animationDuration: 1200,
      nodeRepulsion: () => 6000,
      idealEdgeLength: () => 120,
      edgeElasticity: () => 80,
      gravity: 0.6,
      numIter: 300,
      randomize: true,
      fit: true,
      padding: 50,
    } as cytoscape.CoseLayoutOptions);

    layout.run();

    cy.on("tap", "node[type='center'], node[type='project']", handleTap);

    cy.on("mouseover", "node[type='center'], node[type='project']", (evt) => {
      containerRef.current!.style.cursor = "pointer";
      const n = evt.target;
      n.animate(
        {
          style: {
            "border-width": n.data("type") === "center" ? 5 : 3,
            "border-color": "rgba(239,123,82,0.9)",
          },
        },
        { duration: 200 }
      );
      n.connectedEdges().animate(
        { style: { opacity: 1, width: 2 } },
        { duration: 200 }
      );
    });

    cy.on("mouseout", "node[type='center'], node[type='project']", (evt) => {
      containerRef.current!.style.cursor = "default";
      const n = evt.target;
      const isCenter = n.data("type") === "center";
      n.animate(
        {
          style: {
            "border-width": isCenter ? 3 : 1.5,
            "border-color": isCenter
              ? "rgba(239,123,82,0.5)"
              : "rgba(212,85,45,0.35)",
          },
        },
        { duration: 300 }
      );
      n.connectedEdges().animate(
        {
          style: {
            opacity: n.connectedEdges().first().data("type") === "primary" ? 0.7 : 0.5,
            width: n.connectedEdges().first().data("type") === "primary" ? 1.5 : 0.8,
          },
        },
        { duration: 300 }
      );
    });

    /* Obsidian-style continuous floating drift */
    const driftStrength = 0.35;
    const driftVelocities = new Map<string, { vx: number; vy: number }>();

    cy.nodes().forEach((node) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.3;
      driftVelocities.set(node.id(), {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    });

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;

      const centerNode = cy.getElementById("center");
      const cx = centerNode.position("x");
      const cy2 = centerNode.position("y");
      const bb = cy.extent();
      const midX = (bb.x1 + bb.x2) / 2;
      const midY = (bb.y1 + bb.y2) / 2;

      cy.nodes().forEach((node) => {
        if (node.grabbed()) return;

        const vel = driftVelocities.get(node.id());
        if (!vel) return;

        const pos = node.position();

        /* Gravity toward center node */
        const dx = cx - pos.x;
        const dy = cy2 - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const gravityForce = 0.003 * dist;
        vel.vx += (dx / dist) * gravityForce * dt;
        vel.vy += (dy / dist) * gravityForce * dt;

        /* Repulsion from other nearby nodes */
        node.neighborhood("node").forEach((other: cytoscape.NodeSingular) => {
          const ox = other.position("x") - pos.x;
          const oy = other.position("y") - pos.y;
          const od = Math.sqrt(ox * ox + oy * oy);
          if (od < 120 && od > 1) {
            const repel = 0.5 / (od * od);
            vel.vx -= (ox / od) * repel * dt;
            vel.vy -= (oy / od) * repel * dt;
          }
        });

        /* Boundary soft-bounce */
        const margin = 60;
        if (pos.x < bb.x1 + margin) vel.vx += 0.05 * dt;
        if (pos.x > bb.x2 - margin) vel.vx -= 0.05 * dt;
        if (pos.y < bb.y1 + margin) vel.vy += 0.05 * dt;
        if (pos.y > bb.y2 - margin) vel.vy -= 0.05 * dt;

        /* Random jitter */
        vel.vx += (Math.random() - 0.5) * 0.04 * dt;
        vel.vy += (Math.random() - 0.5) * 0.04 * dt;

        /* Damping */
        vel.vx *= 0.97;
        vel.vy *= 0.97;

        node.position({
          x: pos.x + vel.vx * driftStrength * dt,
          y: pos.y + vel.vy * driftStrength * dt,
        });
      });

      /* Keep center node gently pulled to graph center */
      if (!centerNode.grabbed()) {
        const pull = 0.005;
        centerNode.position({
          x: cx + (midX - cx) * pull * dt,
          y: cy2 + (midY - cy2) * pull * dt,
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    layout.one("layoutstop", () => {
      cy.fit(undefined, 50);
      rafRef.current = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cy.destroy();
    };
  }, [handleTap]);

  return <div ref={containerRef} className="skill-graph-canvas" />;
}
