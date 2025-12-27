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
  // BOLT OPTIMIZATION: Use refs for animation state to avoid re-renders
  const sliderPositionRef = useRef(50);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for the elements we need to animate directly
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Helper to update DOM directly without React render cycle
  const updateSliderDOM = useCallback((percentage: number) => {
    sliderPositionRef.current = percentage;
    const widthStr = `${percentage}%`;

    if (layer2Ref.current) layer2Ref.current.style.width = widthStr;
    if (layer3Ref.current) layer3Ref.current.style.width = widthStr;
    if (layer4Ref.current) layer4Ref.current.style.width = widthStr;
    if (handleRef.current) handleRef.current.style.left = widthStr;
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

    // Direct DOM update instead of setSliderPosition(percentage)
    updateSliderDOM(percentage);
  }, [updateSliderDOM]);

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

  // BOLT FIX: Ensure DOM stays synced with ref after any re-render
  // useLayoutEffect prevents FOUC by running synchronously before paint
  useLayoutEffect(() => {
      updateSliderDOM(sliderPositionRef.current);
  });

  // BOLT OPTIMIZATION: Use requestAnimationFrame for smooth 60fps animation
  useEffect(() => {
    if (isHovering) return;
    
    let animationFrameId: number;
    let direction = 1;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;

      // Cap at ~60fps (approx 16ms) to avoid running too fast,
      // though rAF usually handles this, delta scaling is safer.
      if (delta >= 16) {
        // Original speed was 0.5 per 50ms = 0.01 per ms
        let next = sliderPositionRef.current + (0.01 * delta * direction);

        // Boundaries
        if (next > 70) {
            next = 70;
            direction = -1;
        }
        if (next < 30) {
            next = 30;
            direction = 1;
        }

        updateSliderDOM(next);
        lastTime = time;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering, updateSliderDOM]);

  // Stable width style for inner images to prevent squishing
  const innerImageStyle = {
      width: containerWidth ? `${containerWidth}px` : '100%',
  };

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
        <div 
          ref={layer2Ref}
          className="absolute inset-0 overflow-hidden"
          style={{ width: '50%' }}
        >
          <img 
            src={activeMode === 'dog' ? dogSrc : catSrc} 
            className="absolute inset-0 w-full h-full max-w-none object-cover"
            style={innerImageStyle}
            alt="Pet Vision Layer 2"
          />
        </div>
        
        {/* Re-implementing the Image logic to be safer without JS width calculation for the inner image */}
        <div 
            ref={layer3Ref}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-4 border-white/80 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
            style={{ width: '50%' }}
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className="absolute top-0 left-0 max-w-none h-full object-cover"
                style={innerImageStyle}
                alt="Pet Vision Layer 3"
             />
             <div className="w-full h-full relative"></div>
        </div>
        
         {/* Retry Image structure for robustness */}
         <div 
            ref={layer4Ref}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            style={{ width: '50%' }}
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={innerImageStyle}
                alt="Pet Vision Layer 4"
             />
             
             <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
                 {activeMode === 'dog' ? 'DOG VISION' : 'CAT VISION'}
             </div>
        </div>

        {/* Slider Handle */}
        <div 
            ref={handleRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
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
