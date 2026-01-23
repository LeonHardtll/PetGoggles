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
  // State: Only for logic that changes rendering source
  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);

  // Refs: For performance (direct DOM manipulation)
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const sliderPosRef = useRef(50);
  const animationRef = useRef<number>();
  const directionRef = useRef(1);

  // Optimized update function
  const updateVisuals = useCallback((percentage: number) => {
    sliderPosRef.current = percentage;
    if (layerRef.current) layerRef.current.style.width = `${percentage}%`;
    if (handleRef.current) handleRef.current.style.left = `${percentage}%`;
    if (containerRef.current) containerRef.current.setAttribute('aria-valuenow', Math.round(percentage).toString());
  }, []);

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

    updateVisuals(percentage);
  }, [updateVisuals]);

  // Efficient resize handling
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current && imageRef.current) {
        // Ensure inner image matches container width exactly
        imageRef.current.style.width = `${containerRef.current.offsetWidth}px`;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateWidth);
    });

    resizeObserver.observe(containerRef.current);
    updateWidth(); // Initial sync
    
    return () => resizeObserver.disconnect();
  }, []);

  // Optimized Auto-sweep animation using requestAnimationFrame
  useEffect(() => {
    if (isHovering) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        return;
    }

    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      // Cap delta to prevent huge jumps after tab switch (max 100ms equivalent)
      const safeDelta = Math.min(delta, 100);

      // Speed: 0.5 unit per 50ms = 0.01 unit per ms
      const step = 0.01 * safeDelta * directionRef.current;

      let next = sliderPosRef.current + step;

      // Bounds check and bounce
      if (next > 70) {
          next = 70;
          directionRef.current = -1;
      } else if (next < 30) {
          next = 30;
          directionRef.current = 1;
      }

      updateVisuals(next);
      lastTime = time;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovering, updateVisuals]);

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
        role="slider"
        aria-valuenow={Math.round(sliderPosRef.current)} // Note: ARIA value won't update in real-time without re-render, which is a trade-off for perf.
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Comparison Slider"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') updateVisuals(Math.max(0, sliderPosRef.current - 5));
            if (e.key === 'ArrowRight') updateVisuals(Math.min(100, sliderPosRef.current + 5));
        }}
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
         <div 
            ref={layerRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            style={{ width: '50%' }} // Default start
        >
             <img 
                ref={imageRef}
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={{ width: '100%' }} // Initial fallback
             />
             
             <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                 {activeMode === 'dog' ? 'DOG VISION' : 'CAT VISION'}
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            ref={handleRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] group-focus:ring-2 group-focus:ring-white"
            style={{ left: '50%' }} // Default start
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
