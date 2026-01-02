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
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for optimized animation
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const animationPosRef = useRef(50);

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

    // Update state for non-animation logic
    setSliderPosition(percentage);
    // Sync ref for animation resume
    animationPosRef.current = percentage;
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

  // Auto-sweep animation when not hovering - Optimized with requestAnimationFrame
  useEffect(() => {
    if (isHovering) {
      // When hover starts, ensure refs are synced to the last known state from the animation
      // (Actually, the state 'sliderPosition' might be stale if we didn't update it during animation)
      // So we should set the state to the current animation position
      setSliderPosition(animationPosRef.current);
      return;
    }
    
    let direction = 1;
    let animationFrameId: number;
    let lastTime = performance.now();

    // We start from the current position
    let currentPos = animationPosRef.current;

    const animate = (time: number) => {
      const delta = time - lastTime;

      // Update at approximately 60fps, but using delta for consistent speed
      // Previous speed: 0.5 per 50ms = 10 per second
      // 10 units / 1000ms = 0.01 units per ms
      if (delta > 0) {
         const speed = 0.01 * delta;

         currentPos += (speed * direction);

         if (currentPos > 70) {
           currentPos = 70;
           direction = -1;
         }
         if (currentPos < 30) {
           currentPos = 30;
           direction = 1;
         }

         animationPosRef.current = currentPos;
         lastTime = time;

         // Direct DOM updates
         const widthStr = `${currentPos}%`;
         const leftStr = `${currentPos}%`;

         if (layer1Ref.current) layer1Ref.current.style.width = widthStr;
         if (layer2Ref.current) layer2Ref.current.style.width = widthStr;
         if (layer3Ref.current) layer3Ref.current.style.width = widthStr;
         if (handleRef.current) handleRef.current.style.left = leftStr;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
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
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100 cursor-col-resize group-focus:outline-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        // Accessibility: Pause animation on focus
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Compare View Slider"
        onKeyDown={(e) => {
             // Basic keyboard support for accessibility
             let newPos = sliderPosition;
             if (e.key === 'ArrowLeft') newPos -= 5;
             if (e.key === 'ArrowRight') newPos += 5;
             if (e.key === 'Home') newPos = 0;
             if (e.key === 'End') newPos = 100;

             newPos = Math.max(0, Math.min(100, newPos));
             if (newPos !== sliderPosition) {
                 setSliderPosition(newPos);
                 animationPosRef.current = newPos;
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
          ref={layer1Ref}
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={activeMode === 'dog' ? dogSrc : catSrc} 
            className={cn(
                "absolute inset-0 w-full h-full max-w-none object-cover h-full", 
            )}
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
          />
        </div>
        
        {/* Re-implementing the Image logic to be safer without JS width calculation for the inner image */}
        <div 
            ref={layer2Ref}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-4 border-white/80 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
            style={{ width: `${sliderPosition}%` }}
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className="absolute top-0 left-0 max-w-none h-full object-cover"
                style={{ 
                    width: containerRef.current?.offsetWidth ? `${containerRef.current.offsetWidth}px` : '100%' 
                }}
             />
        </div>
        
         {/* Retry Image structure for robustness */}
         <div 
            ref={layer3Ref}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            style={{ width: `${sliderPosition}%` }}
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={{ 
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
            style={{ left: `${sliderPosition}%` }}
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
