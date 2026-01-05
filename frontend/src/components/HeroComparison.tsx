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
  // Use refs for animation values to prevent re-renders
  const sliderPosRef = useRef(50);
  const directionRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const clippedDivRef = useRef<HTMLDivElement>(null);
  const handleDivRef = useRef<HTMLDivElement>(null);
  const innerImageRef = useRef<HTMLImageElement>(null);

  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);

  // Direct DOM update helper
  const updateSliderDOM = useCallback((percentage: number) => {
    sliderPosRef.current = percentage;

    // Direct DOM manipulation avoids React render cycle overhead
    if (clippedDivRef.current) {
      clippedDivRef.current.style.width = `${percentage}%`;
    }
    if (handleDivRef.current) {
      handleDivRef.current.style.left = `${percentage}%`;
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

    updateSliderDOM(percentage);
  }, [updateSliderDOM]);

  // Handle Resize - Update inner image width to match container
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current && innerImageRef.current) {
        innerImageRef.current.style.width = `${containerRef.current.offsetWidth}px`;
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Auto-sweep animation using requestAnimationFrame
  useEffect(() => {
    if (isHovering) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
       const delta = time - lastTime;
       lastTime = time;

       // Original speed: 0.5% every 50ms => 0.01% per ms
       // Cap delta to prevent large jumps if tab was inactive
       const safeDelta = Math.min(delta, 100);

       let next = sliderPosRef.current + (0.01 * safeDelta * directionRef.current);

       if (next > 70) {
           next = 70;
           directionRef.current = -1;
       } else if (next < 30) {
           next = 30;
           directionRef.current = 1;
       }

       updateSliderDOM(next);
       animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering, updateSliderDOM]);

  // Restore DOM state after any re-render (e.g., activeMode change)
  useLayoutEffect(() => {
      updateSliderDOM(sliderPosRef.current);
      if (containerRef.current && innerImageRef.current) {
        innerImageRef.current.style.width = `${containerRef.current.offsetWidth}px`;
      }
  });

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

        {/* Layer 2: Pet Vision (Left side, clipped) */}
        <div 
            ref={clippedDivRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            style={{ width: '50%' }} // Initial state
        >
             <img 
                ref={innerImageRef}
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                alt="Pet Vision"
             />
             
             <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                 {activeMode === 'dog' ? 'DOG VISION' : 'CAT VISION'}
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            ref={handleDivRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
            style={{ left: '50%' }} // Initial state
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
