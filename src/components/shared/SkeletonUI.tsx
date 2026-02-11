/**
 * Skeleton loading components with Frosted Neumorphism styling.
 * Used as fallbacks while data is loading.
 *
 * All widths/opacities are deterministic (index-based) to avoid
 * hydration mismatches from Math.random() in the render cycle.
 */

// Deterministic opacity pattern for the grass skeleton cells
const GRASS_OPACITY_PATTERN = [0.3, 0.5, 0.4, 0.7, 0.35, 0.55, 0.45, 0.65, 0.38, 0.6];

// Deterministic width pattern for text skeleton lines
const TEXT_WIDTH_PATTERN = ["100%", "92%", "78%", "85%", "68%", "95%", "72%", "88%"];

export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`glass-card p-6 animate-pulse ${className}`}>
            <div className="h-4 bg-border-default rounded-lg w-3/4 mb-4" />
            <div className="h-3 bg-border-default rounded-lg w-full mb-2" />
            <div className="h-3 bg-border-default rounded-lg w-5/6 mb-2" />
            <div className="h-3 bg-border-default rounded-lg w-2/3" />
        </div>
    );
}

export function SkeletonGrass({ className = "" }: { className?: string }) {
    return (
        <div className={`glass-card p-6 animate-pulse ${className}`}>
            <div className="h-4 bg-border-default rounded-lg w-1/3 mb-4" />
            <div className="grid grid-cols-[repeat(52,1fr)] gap-[3px]">
                {Array.from({ length: 7 * 52 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square rounded-sm bg-border-default"
                        style={{ opacity: GRASS_OPACITY_PATTERN[i % GRASS_OPACITY_PATTERN.length] }}
                    />
                ))}
            </div>
        </div>
    );
}

export function SkeletonBlogCard({ className = "" }: { className?: string }) {
    return (
        <div className={`glass-card overflow-hidden animate-pulse ${className}`}>
            <div className="h-48 bg-border-default" />
            <div className="p-6">
                <div className="h-3 bg-border-default rounded-lg w-1/4 mb-3" />
                <div className="h-5 bg-border-default rounded-lg w-3/4 mb-3" />
                <div className="h-3 bg-border-default rounded-lg w-full mb-2" />
                <div className="h-3 bg-border-default rounded-lg w-5/6" />
            </div>
        </div>
    );
}

export function SkeletonText({
    lines = 3,
    className = "",
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className={`animate-pulse space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-3 bg-border-default rounded-lg"
                    style={{ width: TEXT_WIDTH_PATTERN[i % TEXT_WIDTH_PATTERN.length] }}
                />
            ))}
        </div>
    );
}
