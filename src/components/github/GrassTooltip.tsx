"use client";

import { useState, useMemo, useCallback } from "react";
import type { ContributionDay } from "@/lib/validation/schemas";

interface GrassTooltipProps {
    day: ContributionDay | null;
    position: { x: number; y: number };
    visible: boolean;
}

/**
 * Floating tooltip that shows contribution details on hover.
 */
export function GrassTooltip({ day, position, visible }: GrassTooltipProps) {
    if (!visible || !day) return null;

    const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div
            className="fixed z-[9999] pointer-events-none"
            style={{
                left: position.x,
                top: position.y - 48,
                transform: "translateX(-50%)",
            }}
        >
            <div
                className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap"
                style={{
                    background: "var(--surface-raised)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--glass-border)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    color: "var(--text-primary)",
                }}
            >
                <strong>{day.contributionCount}</strong> contribution
                {day.contributionCount !== 1 ? "s" : ""} on {formattedDate}
            </div>
        </div>
    );
}

interface SVGGrassProps {
    weeks: Array<{ contributionDays: ContributionDay[] }>;
}

/**
 * SVG-based GitHub contribution heatmap — the default 2D view.
 * Interactive: hover over any cell to see count + date.
 */
export function SVGGrass({ weeks }: SVGGrassProps) {
    const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const levelColors = useMemo(
        () => ({
            NONE: "var(--grass-0)",
            FIRST_QUARTILE: "var(--grass-1)",
            SECOND_QUARTILE: "var(--grass-2)",
            THIRD_QUARTILE: "var(--grass-3)",
            FOURTH_QUARTILE: "var(--grass-4)",
        }),
        []
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent, day: ContributionDay) => {
            setHoveredDay(day);
            setTooltipPos({ x: e.clientX, y: e.clientY });
        },
        []
    );

    const cellSize = 12;
    const gap = 3;
    const svgWidth = weeks.length * (cellSize + gap);
    const svgHeight = 7 * (cellSize + gap);

    return (
        <div className="relative">
            <GrassTooltip
                day={hoveredDay}
                position={tooltipPos}
                visible={hoveredDay !== null}
            />
            <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto"
                onMouseLeave={() => setHoveredDay(null)}
            >
                {weeks.map((week, weekIdx) =>
                    week.contributionDays.map((day, dayIdx) => (
                        <rect
                            key={`${weekIdx}-${dayIdx}`}
                            x={weekIdx * (cellSize + gap)}
                            y={dayIdx * (cellSize + gap)}
                            width={cellSize}
                            height={cellSize}
                            rx={2}
                            ry={2}
                            fill={levelColors[day.contributionLevel]}
                            className="cursor-pointer transition-all duration-150"
                            style={{
                                opacity: hoveredDay?.date === day.date ? 1 : 0.9,
                                stroke:
                                    hoveredDay?.date === day.date ? "var(--accent)" : "none",
                                strokeWidth: hoveredDay?.date === day.date ? 1.5 : 0,
                            }}
                            onMouseMove={(e) => handleMouseMove(e, day)}
                            onMouseEnter={(e) => handleMouseMove(e, day)}
                        />
                    ))
                )}
            </svg>
        </div>
    );
}
