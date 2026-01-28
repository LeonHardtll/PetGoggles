import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Dog, Cat, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroComparisonProps {
  realitySrc: string; // Default/Dog reality
  catRealitySrc: string; // Cat reality
  dogSrc: string;
  catSrc: string;
}

export const HeroComparison: React.FC<HeroComparisonProps> = ({ realitySrc, catRealitySrc, dogSrc, catSrc }) => {
  // Optimization: Use ref for slider position to avoid re-renders on every frame
  const sliderPositionRef = useRef(50);
  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const clippedImageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Helper to update DOM directly
  const updateSlider = useCallback((percentage: number) => {
    sliderPositionRef.current = percentage;

    if (clippedImageRef.current) {
      clippedImageRef.current.style.width = `${percentage}%`;
    }

    if (handleRef.current) {
      handleRef.current.style.left = `${percentage}%`;
    }

    // Update ARIA for accessibility (if container was the slider, currently it's just a div with handlers)
    // We could add role="slider" to the container or handle, but preserving existing behavior for now.
    // However, memory suggests: "High-frequency animations... should rely on direct DOM manipulation"
    if (containerRef.current) {
        containerRef.current.setAttribute('aria-valuenow', percentage.toFixed(0));
    }
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

    updateSlider(percentage);
  }, [updateSlider]);

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

  // Sync DOM with Ref after render (e.g. when mode changes)
  useLayoutEffect(() => {
    updateSlider(sliderPositionRef.current);
  }, [updateSlider, activeMode]); // activeMode dependency ensures it re-applies if DOM was reset (though React usually preserves DOM for same type)

  // Auto-sweep animation when not hovering
  useEffect(() => {
    if (isHovering) return;
    
    let direction = 1;
    // We need to keep track of direction across frames.
    // Since we are using rAF, we can't easily store state in a closure variable if we re-create the loop.
    // But here we create the loop once when isHovering changes.

    // To match original speed: 0.5% per 50ms = 10% per second.
    // At 60fps (16.6ms), step should be 0.5 * (16.6 / 50) ~= 0.166

    let lastTime = performance.now();
    let animationFrameId: number;

    // We also need to know the current slider position to continue from where we left off.
    // sliderPositionRef.current has it.

    // Direction logic:
    // Original:
    // const next = prev + (0.5 * direction);
    // if (next > 70) direction = -1;
    // if (next < 30) direction = 1;

    // We need to store direction in a ref if we want it to persist?
    // No, effect re-runs when isHovering changes. So it resets direction to 1?
    // The original code reset direction to 1 every time isHovering became false.
    // "let direction = 1;" inside useEffect. Yes.

    const animate = (time: number) => {
      const delta = time - lastTime;
      if (delta >= 16) { // Cap at ~60fps
          // Original speed: 0.5 unit per 50ms => 0.01 unit per ms.
          const step = 0.01 * delta;

          let next = sliderPositionRef.current + (step * direction);

          if (next > 70) {
              next = 70;
              direction = -1;
          } else if (next < 30) {
              next = 30;
              direction = 1;
          }

          updateSlider(next);
          lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering, updateSlider]);

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
        aria-valuenow={50} // Initial value, updated via JS
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        aria-label="Comparison Slider"
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
            ref={clippedImageRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            style={{ width: `50%` }} // Initial value
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={{ 
                    // This is the critical part: ensure this image is exactly the same size as the container
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
            style={{ left: `50%` }} // Initial value
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
