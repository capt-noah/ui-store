import React from 'react';

/**
 * UIStore Skeleton Components
 * Features: Versatile loading states for cards, text, and avatars.
 */

const SkeletonBase = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200 rounded ${className}`} />
);

export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <SkeletonBase 
        key={i} 
        className={`h-4 ${i === lines - 1 ? 'w-[70%]' : 'w-full'}`} 
      />
    ))}
  </div>
);

export const AvatarSkeleton = ({ size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };
  return <SkeletonBase className={`${sizes[size]} rounded-full`} />;
};

export const CardSkeleton = () => (
  <div className="border border-zinc-200 rounded-xl p-4 space-y-4 w-full">
    <SkeletonBase className="aspect-video w-full rounded-lg" />
    <div className="space-y-2">
      <SkeletonBase className="h-5 w-2/3" />
      <SkeletonBase className="h-4 w-full" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <SkeletonBase className="h-8 w-24 rounded-lg" />
      <SkeletonBase className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 4 }) => (
  <div className="flex items-center space-x-4 py-4 px-2 border-b border-zinc-100">
    {[...Array(cols)].map((_, i) => (
      <SkeletonBase key={i} className={`h-4 flex-1 ${i === 0 ? 'min-w-[150px]' : ''}`} />
    ))}
  </div>
);

const Skeletons = {
  Text: TextSkeleton,
  Avatar: AvatarSkeleton,
  Card: CardSkeleton,
  Row: TableRowSkeleton
};

export default Skeletons;
