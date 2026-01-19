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
  // ⚡ Optimization: Use refs for animation values to avoid re-renders on every frame
  const sliderPositionRef = useRef(50);
  const clippedContainerRef = useRef<HTMLDivElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Accessible state: Only update periodically or on interaction end to avoid perf regression
  const [ariaValue, setAriaValue] = useState(50);

  const [activeMode, setActiveMode] = useState<'dog' | 'cat'>('dog');
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Helper to update DOM directly
  const updateSliderDOM = (percentage: number) => {
    if (clippedContainerRef.current) {
      clippedContainerRef.current.style.width = `${percentage}%`;
    }
    if (sliderHandleRef.current) {
      sliderHandleRef.current.style.left = `${percentage}%`;
    }
  };

  // Sync DOM on render (in case of mode switch or other re-renders)
  useLayoutEffect(() => {
    updateSliderDOM(sliderPositionRef.current);
  }, []);

  // Update aria-valuenow less frequently to support accessibility
  const updateAriaValue = useCallback((val: number) => {
     setAriaValue(Math.round(val));
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

    // Update ref and DOM directly - no state update!
    sliderPositionRef.current = percentage;
    updateSliderDOM(percentage);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    updateAriaValue(sliderPositionRef.current);
  }, [updateAriaValue]);

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
    
    let animationFrameId: number;
    let direction = 1;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;

      if (delta > 16) { // Cap at ~60fps updates
        const speed = 0.01 * delta; // 0.01% per ms

        let next = sliderPositionRef.current + (speed * direction);

        if (next > 70) {
          next = 70;
          direction = -1;
        } else if (next < 30) {
          next = 30;
          direction = 1;
        }

        sliderPositionRef.current = next;
        updateSliderDOM(next);
        lastTime = time;

        // Note: We do NOT update aria-valuenow during animation to prevent re-renders.
        // It will update when user interacts or hover ends?
        // Actually, accessibility users won't be tracking the auto-animation in real-time usually.
      }

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
        onMouseUp={handleInteractionEnd}
        onTouchEnd={handleInteractionEnd}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
            setIsHovering(false);
            handleInteractionEnd();
        }}
        role="slider"
        aria-valuenow={ariaValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Comparison Slider"
        tabIndex={0}
        onKeyDown={(e) => {
            const step = 5;
            let newVal = sliderPositionRef.current;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                newVal = Math.max(0, sliderPositionRef.current - step);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                newVal = Math.min(100, sliderPositionRef.current + step);
            } else if (e.key === 'Home') {
                e.preventDefault();
                newVal = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                newVal = 100;
            }

            if (newVal !== sliderPositionRef.current) {
                sliderPositionRef.current = newVal;
                updateSliderDOM(newVal);
                updateAriaValue(newVal); // Keyboard interaction is slow enough to update state
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

         {/* Layer 2: Pet Vision (Clipped) */}
         <div 
            ref={clippedContainerRef}
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-xl z-10"
            // Initial style is needed to prevent FOUC, but dynamic updates happen via Ref
            style={{ width: `${sliderPositionRef.current}%` }}
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className={cn(
                    "h-full object-cover max-w-none",
                    activeMode === 'dog' ? "brightness-110 contrast-110 saturate-125" : "grayscale-[0.3] contrast-125"
                )}
                style={{ 
                    // Ensure this image matches the container width exactly
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
            ref={sliderHandleRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] pointer-events-none"
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
