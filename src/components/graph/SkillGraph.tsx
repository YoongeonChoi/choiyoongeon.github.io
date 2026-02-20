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

  const allSkills = new Map<string, string[]>();

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
      if (!allSkills.has(skillId)) {
        allSkills.set(skillId, []);
      }
      allSkills.get(skillId)!.push(proj.id);

      if (!elements.some((el) => el.data.id === skillId)) {
        elements.push({
          data: { id: skillId, label: skill, type: "skill" },
        });
      }
      const edgeId = `${proj.id}-${skillId}`;
      if (!elements.some((el) => el.data.id === edgeId)) {
        elements.push({
          data: { id: edgeId, source: proj.id, target: skillId, type: "secondary" },
        });
      }
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
        "text-max-width": "80px",
        color: "#dce3ef",
        "font-size": "9px",
        "font-family": "'Space Grotesk', sans-serif",
        "font-weight": 500,
        "min-zoomed-font-size": 0,
      },
    },
    {
      selector: "node[type='center']",
      style: {
        width: 100,
        height: 100,
        "background-color": "#d4552d",
        "border-width": 3,
        "border-color": "rgba(239, 123, 82, 0.6)",
        "font-size": "13px",
        "font-weight": 700,
        color: "#ffffff",
        "text-outline-color": "rgba(0,0,0,0.4)",
        "text-outline-width": 1,
        "overlay-opacity": 0,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='project']",
      style: {
        width: 72,
        height: 72,
        "background-color": "rgba(20, 28, 40, 0.9)",
        "border-width": 2,
        "border-color": "rgba(212, 85, 45, 0.45)",
        "font-size": "10px",
        color: "#ef7b52",
        "font-weight": 600,
        "overlay-opacity": 0,
      } as cytoscape.Css.Node,
    },
    {
      selector: "node[type='skill']",
      style: {
        width: 46,
        height: 46,
        "background-color": "rgba(22, 32, 46, 0.85)",
        "border-width": 1,
        "border-color": "rgba(255,255,255, 0.12)",
        "font-size": "8px",
        color: "#9aabba",
        "overlay-opacity": 0,
      } as cytoscape.Css.Node,
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "rgba(212, 85, 45, 0.2)",
        "curve-style": "bezier",
        opacity: 0.6,
      },
    },
    {
      selector: "edge[type='primary']",
      style: {
        width: 2,
        "line-color": "rgba(212, 85, 45, 0.4)",
        opacity: 0.8,
      },
    },
    {
      selector: "node:active",
      style: { "overlay-opacity": 0 } as cytoscape.Css.Node,
    },
  ];
}

export function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

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
      layout: {
        name: "concentric",
        concentric: (node: cytoscape.NodeSingular) => {
          const t = node.data("type");
          if (t === "center") return 3;
          if (t === "project") return 2;
          return 1;
        },
        levelWidth: () => 1,
        minNodeSpacing: 50,
        animate: false,
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true,
    });

    cyRef.current = cy;

    cy.on("tap", "node[type='center'], node[type='project']", handleTap);

    cy.on("mouseover", "node[type='center'], node[type='project']", (evt) => {
      const node = evt.target;
      containerRef.current!.style.cursor = "pointer";
      node.animate(
        { style: { "border-width": node.data("type") === "center" ? 5 : 3 } },
        { duration: 200 }
      );
    });

    cy.on("mouseout", "node[type='center'], node[type='project']", (evt) => {
      const node = evt.target;
      containerRef.current!.style.cursor = "default";
      node.animate(
        { style: { "border-width": node.data("type") === "center" ? 3 : 2 } },
        { duration: 200 }
      );
    });

    cy.ready(() => {
      cy.fit(undefined, 40);
    });

    return () => {
      cy.destroy();
    };
  }, [handleTap]);

  return <div ref={containerRef} className="skill-graph-canvas" />;
}
