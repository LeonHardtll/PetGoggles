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
  // Use a ref for slider position to avoid re-renders on every frame
  const sliderPositionRef = useRef(50);
  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const clippedRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Helper to update DOM directly
  const updateSlider = useCallback((percentage: number) => {
    sliderPositionRef.current = percentage;
    if (clippedRef.current) {
      clippedRef.current.style.width = `${percentage}%`;
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${percentage}%`;
    }
    if (containerRef.current) {
      containerRef.current.setAttribute('aria-valuenow', Math.round(percentage).toString());
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

  // Sync positions after every render to prevent React from resetting styles
  useLayoutEffect(() => {
    updateSlider(sliderPositionRef.current);
  });

  // Auto-sweep animation when not hovering using requestAnimationFrame
  useEffect(() => {
    if (isHovering) return;
    
    let animationFrameId: number;
    let direction = 1;
    let lastTime = performance.now();

    const animate = (time: number) => {
      // Limit updates to ~60fps (or whatever the screen refresh rate is)
      const delta = time - lastTime;

      // We target roughly 0.5% shift every 50ms (original speed), so 0.01% per ms
      // But 50ms interval with 0.5 increment = 10% per second.
      // 60fps = 16.6ms per frame.
      // 0.5 unit per 50ms -> 10 units per 1000ms.
      // movement per ms = 0.5 / 50 = 0.01 units.

      if (delta >= 16) { // Run at ~60fps
        let current = sliderPositionRef.current;
        const step = 0.01 * delta; // speed adjusted by time delta

        let next = current + (step * direction);

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
        // Added accessibility attributes for slider role
        role="slider"
        aria-valuenow={Math.round(sliderPositionRef.current)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Comparison Slider"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
                updateSlider(Math.max(0, sliderPositionRef.current - 5));
            } else if (e.key === 'ArrowRight') {
                updateSlider(Math.min(100, sliderPositionRef.current + 5));
            }
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
            ref={clippedRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            // Initial style set via ref/effect, but we can set default here too
            style={{ width: '50%' }}
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
                alt="Pet Vision"
             />
             
             <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                 {activeMode === 'dog' ? 'DOG VISION' : 'CAT VISION'}
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            ref={handleRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] pointer-events-none"
            style={{ left: '50%' }}
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
