import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 rounded-lg ${className}`}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-[#151e38] border border-slate-800/80 rounded-xl"
        >
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-1/2 h-3" />
          </div>
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
};
