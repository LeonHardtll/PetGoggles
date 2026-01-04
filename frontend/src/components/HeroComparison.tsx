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
  // ⚡ Performance: Use refs for high-frequency updates to avoid React re-renders
  const sliderPosRef = useRef(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const clipperRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const innerImageRef = useRef<HTMLImageElement>(null);
  const animationFrameRef = useRef<number>();

  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);

  // Helper to directly update DOM without triggering React render cycles
  const updateSliderUI = (percentage: number) => {
    if (clipperRef.current) {
      clipperRef.current.style.width = `${percentage}%`;
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${percentage}%`;
    }
    sliderPosRef.current = percentage;
  };

  const updateInnerImageWidth = useCallback(() => {
    if (containerRef.current && innerImageRef.current) {
      const width = containerRef.current.offsetWidth;
      innerImageRef.current.style.width = `${width}px`;
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

    // Direct DOM update instead of setState
    updateSliderUI(percentage);
  }, []);

  // Handle resize efficiently
  useEffect(() => {
    updateInnerImageWidth();
    
    // Use ResizeObserver if available for more robust resizing
    const resizeObserver = new ResizeObserver(() => {
        updateInnerImageWidth();
    });

    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateInnerImageWidth);
    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateInnerImageWidth);
    };
  }, [updateInnerImageWidth]);

  // Initial setup ensuring correct state
  useLayoutEffect(() => {
      updateSliderUI(sliderPosRef.current);
      updateInnerImageWidth();
  });

  // Optimized Auto-sweep animation using requestAnimationFrame
  useEffect(() => {
    if (isHovering) {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        return;
    }
    
    let direction = 1;
    let lastTime = performance.now();

    // We need to sync direction with current position to avoid jumping
    if (sliderPosRef.current > 70) direction = -1;
    if (sliderPosRef.current < 30) direction = 1;

    const animate = (time: number) => {
      const delta = time - lastTime;

      // Target ~60fps logic, but purely time based would be better.
      // Original logic: 0.5% every 50ms => 10% per second.
      // New logic: 10% per second = 0.01% per ms.

      if (delta >= 16) { // Update approx every frame
        const moveAmount = (0.01 * delta) * direction;
        let next = sliderPosRef.current + moveAmount;

        if (next > 70) {
            next = 70;
            direction = -1;
        } else if (next < 30) {
            next = 30;
            direction = 1;
        }

        updateSliderUI(next);
        lastTime = time;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
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
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100 cursor-col-resize touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="slider"
        aria-valuenow={Math.round(sliderPosRef.current)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
            // Basic keyboard support for accessibility
            if (e.key === 'ArrowLeft') {
                updateSliderUI(Math.max(0, sliderPosRef.current - 5));
            } else if (e.key === 'ArrowRight') {
                updateSliderUI(Math.min(100, sliderPosRef.current + 5));
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
            ref={clipperRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10 will-change-[width]"
            style={{ width: '50%' }} // Initial value, updated by ref
        >
             <img 
                ref={innerImageRef}
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                alt="Pet Vision"
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={{ width: '100%' }} // Initial placeholder, updated by JS
             />
             
             <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                 {activeMode === 'dog' ? 'DOG VISION' : 'CAT VISION'}
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            ref={handleRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] will-change-[left]"
            style={{ left: '50%' }} // Initial value, updated by ref
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
