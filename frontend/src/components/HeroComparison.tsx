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
  // Optimization: Use refs for high-frequency updates (animation/drag) to avoid re-renders
  const sliderPosRef = useRef(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const clippedContainerRef = useRef<HTMLDivElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);

  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Helper to directly update DOM elements
  const updateSlider = useCallback((percentage: number) => {
    sliderPosRef.current = percentage;

    if (clippedContainerRef.current) {
      clippedContainerRef.current.style.width = `${percentage}%`;
    }

    if (sliderHandleRef.current) {
      sliderHandleRef.current.style.left = `${percentage}%`;
      sliderHandleRef.current.setAttribute('aria-valuenow', percentage.toFixed(1));
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 5;
    let newPos = sliderPosRef.current;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        newPos -= step;
        e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        newPos += step;
        e.preventDefault();
    } else if (e.key === 'Home') {
        newPos = 0;
        e.preventDefault();
    } else if (e.key === 'End') {
        newPos = 100;
        e.preventDefault();
    } else {
        return;
    }

    newPos = Math.max(0, Math.min(100, newPos));
    updateSlider(newPos);
  }, [updateSlider]);

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

  // Ensure DOM is synced after any render
  useLayoutEffect(() => {
    updateSlider(sliderPosRef.current);
  });

  // Auto-sweep animation when not hovering using requestAnimationFrame
  useEffect(() => {
    if (isHovering) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    let direction = 1;

    // Preserve direction if possible? The original code reset it on hover exit.
    // We'll stick to resetting or inferring.
    // If we are at boundaries, flip.
    if (sliderPosRef.current >= 70) direction = -1;
    if (sliderPosRef.current <= 30) direction = 1;

    const animate = (time: number) => {
      const delta = time - lastTime;

      // Original speed: 0.5% every 50ms = 10% per second
      // delta is ms. (delta / 1000) * 10

      if (delta >= 16) { // Approx 60fps cap
          const speed = 0.01; // 0.01% per ms = 10% per second
          const move = delta * speed * direction;

          let next = sliderPosRef.current + move;

          if (next > 70) {
              next = 70;
              direction = -1;
          }
          if (next < 30) {
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
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100 cursor-col-resize touch-none"
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

        {/* Layer 2: Pet Vision (Left side, clipped) - Consolidated single overlay */}
         <div 
            ref={clippedContainerRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            // Width is set via JS/ref now
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={{ 
                    // Ensure this image is exactly the same size as the container
                    width: containerWidth || '100%',
                }}
             />
             
             <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                 {activeMode === 'dog' ? 'DOG VISION' : 'CAT VISION'}
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            ref={sliderHandleRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            tabIndex={0}
            role="slider"
            aria-label="Comparison Slider"
            aria-valuemin={0}
            aria-valuemax={100}
            // aria-valuenow set via JS
            onKeyDown={handleKeyDown}
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
