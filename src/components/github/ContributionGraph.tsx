"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, springs } from "@/lib/motion/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ContributionDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
    data?: ContributionDay[];
    username?: string;
}

// Color scale matching the design system
const levelColors = {
    0: "oklch(0.20 0.01 270)", // Empty
    1: "oklch(0.40 0.08 250)", // Low
    2: "oklch(0.55 0.12 250)", // Medium-low
    3: "oklch(0.65 0.14 250)", // Medium-high
    4: "oklch(0.75 0.15 250)", // High
};

// Static placeholder data to avoid new Date() during SSR/prerender
// Date range: 2025-02-05 to 2026-02-04
const staticPlaceholderData: ContributionDay[] = (() => {
    const data: ContributionDay[] = [];
    // Seeded random generator for consistent builds
    const seed = 42;
    let random = seed;
    const nextRandom = () => {
        random = (random * 1103515245 + 12345) % 2147483648;
        return random / 2147483648;
    };

    // Start from a fixed date: 2025-02-05
    const year = 2025;
    const startMonth = 2; // February (0-indexed = 1)
    const startDay = 5;

    for (let i = 0; i < 365; i++) {
        // Calculate date (simplified - assumes no leap year edge cases for demo)
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let dayOffset = startDay + i;
        let monthOffset = startMonth - 1;
        let yearOffset = year;

        while (dayOffset > daysInMonth[monthOffset]) {
            dayOffset -= daysInMonth[monthOffset];
            monthOffset++;
            if (monthOffset >= 12) {
                monthOffset = 0;
                yearOffset++;
            }
        }

        const dateStr = `${yearOffset}-${String(monthOffset + 1).padStart(2, "0")}-${String(dayOffset).padStart(2, "0")}`;

        // Generate deterministic contribution level
        const r = nextRandom();
        let level: 0 | 1 | 2 | 3 | 4;
        let count: number;

        if (r < 0.3) {
            level = 0;
            count = 0;
        } else if (r < 0.5) {
            level = 1;
            count = Math.floor(nextRandom() * 3) + 1;
        } else if (r < 0.7) {
            level = 2;
            count = Math.floor(nextRandom() * 5) + 4;
        } else if (r < 0.9) {
            level = 3;
            count = Math.floor(nextRandom() * 5) + 9;
        } else {
            level = 4;
            count = Math.floor(nextRandom() * 10) + 14;
        }

        data.push({ date: dateStr, count, level });
    }

    return data;
})();

export function ContributionGraph({
    data,
    username = "choiyoongeon",
}: ContributionGraphProps) {
    const prefersReducedMotion = useReducedMotion();
    const contributionData = data || staticPlaceholderData;

    // Organize data into weeks
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Parse first date statically
    const firstDateParts = contributionData[0]?.date.split("-").map(Number) || [2025, 2, 5];
    // Wednesday = 3 (2025-02-05 is a Wednesday)
    const startPadding = 3;

    // Add empty cells for padding 
    for (let i = 0; i < startPadding; i++) {
        currentWeek.push({ date: "", count: 0, level: 0 });
    }

    contributionData.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get month from date string
    const getMonthFromDate = (dateStr: string): number => {
        if (!dateStr) return -1;
        const parts = dateStr.split("-");
        return parseInt(parts[1], 10) - 1;
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-text-primary">
                    Contribution Activity
                </h3>
                <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-primary hover:underline"
                >
                    @{username}
                </a>
            </div>

            {/* Graph Container */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="overflow-x-auto pb-2"
            >
                <div className="inline-flex flex-col gap-1">
                    {/* Month Labels */}
                    <div className="flex gap-[3px] text-xs text-text-muted pl-8 mb-1">
                        {weeks.map((week, weekIndex) => {
                            if (weekIndex % 4 === 0 && weekIndex < weeks.length - 2) {
                                const month = getMonthFromDate(week[0]?.date);
                                if (month >= 0) {
                                    return (
                                        <span key={weekIndex} className="w-[52px]">
                                            {monthLabels[month]}
                                        </span>
                                    );
                                }
                            }
                            return null;
                        })}
                    </div>

                    {/* Graph Grid */}
                    <div className="flex gap-[3px]">
                        {/* Day Labels */}
                        <div className="flex flex-col gap-[3px] text-xs text-text-muted pr-2">
                            <span className="h-[13px]"></span>
                            <span className="h-[13px]">Mon</span>
                            <span className="h-[13px]"></span>
                            <span className="h-[13px]">Wed</span>
                            <span className="h-[13px]"></span>
                            <span className="h-[13px]">Fri</span>
                            <span className="h-[13px]"></span>
                        </div>

                        {/* Weeks */}
                        {weeks.map((week, weekIndex) => (
                            <motion.div
                                key={weekIndex}
                                variants={staggerItem}
                                className="flex flex-col gap-[3px]"
                            >
                                {week.map((day, dayIndex) => (
                                    <ContributionCell
                                        key={`${weekIndex}-${dayIndex}`}
                                        day={day}
                                        prefersReducedMotion={prefersReducedMotion}
                                        delay={weekIndex * 0.01 + dayIndex * 0.002}
                                    />
                                ))}
                            </motion.div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-4 text-xs text-text-muted">
                        <span>Less</span>
                        {[0, 1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className="w-[13px] h-[13px] rounded-[3px]"
                                style={{ backgroundColor: levelColors[level as 0 | 1 | 2 | 3 | 4] }}
                            />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

interface ContributionCellProps {
    day: ContributionDay;
    prefersReducedMotion: boolean;
    delay: number;
}

function ContributionCell({ day, prefersReducedMotion, delay }: ContributionCellProps) {
    if (!day.date) {
        return <div className="w-[13px] h-[13px]" />;
    }

    // Format date from string instead of creating Date object
    const parts = day.date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${monthNames[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;

    return (
        <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...springs.snappy, delay }}
            whileHover={{ scale: 1.3 }}
            className="relative w-[13px] h-[13px] rounded-[3px] cursor-pointer group"
            style={{ backgroundColor: levelColors[day.level] }}
            title={`${day.count} contributions on ${formattedDate}`}
        >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-surface-elevated text-xs text-text-primary whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                <span className="font-semibold">{day.count} contributions</span>
                <br />
                <span className="text-text-muted">{formattedDate}</span>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-elevated" />
            </div>
        </motion.div>
    );
}
