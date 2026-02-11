/**
 * Skeleton loading components with Frosted Neumorphism styling.
 * Used as fallbacks while data is loading.
 */

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
                        style={{ opacity: 0.3 + Math.random() * 0.5 }}
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
                    style={{ width: `${60 + Math.random() * 40}%` }}
                />
            ))}
        </div>
    );
}
