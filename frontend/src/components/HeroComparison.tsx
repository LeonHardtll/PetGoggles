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
  // Performance optimization: Use refs for frequent updates to avoid React re-renders
  const sliderPositionRef = useRef(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Refs for the multiple layers used in the visual effect
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);

  const animationFrameRef = useRef<number>();

  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const updateSliderStyles = (percentage: number) => {
    sliderPositionRef.current = percentage;

    const widthStyle = `${percentage}%`;
    const leftStyle = `${percentage}%`;

    if (panel1Ref.current) panel1Ref.current.style.width = widthStyle;
    if (panel2Ref.current) panel2Ref.current.style.width = widthStyle;
    if (panel3Ref.current) panel3Ref.current.style.width = widthStyle;

    if (handleRef.current) handleRef.current.style.left = leftStyle;

    // Update ARIA attribute manually for accessibility without re-renders
    if (containerRef.current) {
        containerRef.current.setAttribute('aria-valuenow', Math.round(percentage).toString());
    }
  };

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

    updateSliderStyles(percentage);
  }, []);

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

  // Auto-sweep animation using requestAnimationFrame
  useEffect(() => {
    if (isHovering) {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        return;
    }
    
    let direction = 1;
    let lastTime = performance.now();

    // Sync direction with current position to avoid getting stuck
    const currentPos = sliderPositionRef.current;
    if (currentPos >= 70) direction = -1;
    else if (currentPos <= 30) direction = 1;

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Original speed: 0.5% every 50ms = 0.01% per ms
      const speed = 0.01;

      // Cap delta to prevent huge jumps if tab was inactive
      const effectiveDelta = Math.min(delta, 100);

      let next = sliderPositionRef.current + (speed * effectiveDelta * direction);

      if (next > 70) {
        next = 70;
        direction = -1;
      } else if (next < 30) {
        next = 30;
        direction = 1;
      }

      updateSliderStyles(next);
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
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100 cursor-col-resize group"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
        tabIndex={0}
        role="slider"
        aria-label="Comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPositionRef.current)}
        onKeyDown={(e) => {
            // Basic keyboard support for accessibility
            if (e.key === 'ArrowLeft') {
                updateSliderStyles(Math.max(0, sliderPositionRef.current - 5));
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                updateSliderStyles(Math.min(100, sliderPositionRef.current + 5));
                e.preventDefault();
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
          ref={panel1Ref}
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPositionRef.current}%` }}
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
            ref={panel2Ref}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-4 border-white/80 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
            style={{ width: `${sliderPositionRef.current}%` }}
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className="absolute top-0 left-0 max-w-none h-full object-cover"
                style={{ 
                    width: containerRef.current?.offsetWidth ? `${containerRef.current.offsetWidth}px` : '100%' 
                }}
             />
             <div className="w-full h-full relative">
             </div>
        </div>
        
         {/* Retry Image structure for robustness */}
         <div 
            ref={panel3Ref}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            style={{ width: `${sliderPositionRef.current}%` }}
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
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] group-focus:ring-2 group-focus:ring-blue-500"
            style={{ left: `${sliderPositionRef.current}%` }}
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
