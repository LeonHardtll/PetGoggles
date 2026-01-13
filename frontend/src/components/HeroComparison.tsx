import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dog, Cat, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroComparisonProps {
  realitySrc: string; // Default/Dog reality
  catRealitySrc: string; // Cat reality
  dogSrc: string;
  catSrc: string;
}

export const HeroComparison: React.FC<HeroComparisonProps> = ({ realitySrc, catRealitySrc, dogSrc, catSrc }) => {
  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const clippedRef = useRef<HTMLDivElement>(null);

  // Use a ref for position to avoid re-renders during animation
  const positionRef = useRef(50);

  const updatePosition = (percentage: number) => {
    positionRef.current = percentage;
    if (handleRef.current) {
      handleRef.current.style.left = `${percentage}%`;
    }
    if (clippedRef.current) {
      clippedRef.current.style.width = `${percentage}%`;
    }
  };

  // Ensure DOM is in sync with ref after any render (e.g. window resize or mode change)
  // This prevents React from overwriting our manual DOM updates if we were to use style props
  React.useLayoutEffect(() => {
     updatePosition(positionRef.current);
  });

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientX;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;

    updatePosition(percentage);
  }, []);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Auto-sweep animation when not hovering
  useEffect(() => {
    if (isHovering) return;
    
    let direction = 1;
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      // Limit updates to ~60fps if needed, but rAF is usually enough.
      // We use time delta to ensure consistent speed regardless of frame rate.
      const delta = Math.min(time - lastTime, 100); // Cap delta to avoid jumps
      lastTime = time;

      // Move 30% per second (approx same speed as before: 0.5% per 50ms = 10% per sec? No. 0.5/50ms = 10%/sec.
      // 0.5 unit per 50ms -> 10 units per 1000ms.
      // So speed is 10 units / second.
      // current position change = (speed * delta) / 1000
      const speed = 0.01; // 10% per second / 1000ms = 0.01 per ms

      let next = positionRef.current + (direction * speed * delta);

      if (next > 70) {
        next = 70;
        direction = -1;
      }
      if (next < 30) {
        next = 30;
        direction = 1;
      }

      updatePosition(next);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering]);

  return (
    <div className="relative w-full max-w-[500px] mx-auto lg:mx-0 select-none group">
      {/* Floating Mode Toggle */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white/90 backdrop-blur shadow-sm border border-slate-200 rounded-full p-1 mb-4">
        <button
          onClick={() => setActiveMode('dog')}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all",
            activeMode === 'dog' 
              ? "bg-orange-100 text-orange-700 shadow-inner" 
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <Dog className="w-4 h-4" /> Dog
        </button>
        <button
          onClick={() => setActiveMode('cat')}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all",
            activeMode === 'cat' 
              ? "bg-purple-100 text-purple-700 shadow-inner" 
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <Cat className="w-4 h-4" /> Cat
        </button>
      </div>

      {/* Main Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100 cursor-col-resize"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Layer 1: Reality (Right side visible primarily) */}
        <img 
          src={activeMode === 'dog' ? realitySrc : catRealitySrc} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Reality" 
        />
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md transition-all">
          HUMAN ({activeMode === 'dog' ? 'DOG OWNER' : 'CAT SERVANT'})
        </div>

        {/* Layer 2: Pet Vision (Left side, clipped) */}
        {/* This is the clipped layer that reveals the pet vision */}
        <div 
            ref={clippedRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            // We set initial style here to prevent FOUC, but we DO NOT bind it to state.
            // React will only apply this on mount/update.
            // Since we don't change this prop, React won't overwrite our ref updates unless it re-renders and sees a diff?
            // Actually, if we leave it static, React will reconcile it to '50%' on every render.
            // We must NOT put the dynamic property in the React style prop if we are managing it manually.
            // But we need an initial value.
            // Solution: Use style={{}} in JSX (or static styles only) and let useLayoutEffect set the initial width.
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                alt="Pet Vision"
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={{ 
                    // Ensure this image is exactly the same size as the container to maintain alignment
                    width: containerWidth || '100%',
                }}
             />
             
             <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                 {activeMode === 'dog' ? 'DOG VISION' : 'CAT VISION'}
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            ref={handleRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
                <ArrowLeftRight className="w-4 h-4 text-slate-400" />
            </div>
        </div>

      </div>
      
      <p className="text-center text-slate-400 text-sm mt-4 animate-pulse">
        Drag slider to compare • Toggle species above
      </p>
    </div>
  );
};
