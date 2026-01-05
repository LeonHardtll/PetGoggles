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
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
      e.preventDefault();
    } else if (e.key === 'Home') {
      setSliderPosition(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      setSliderPosition(100);
      e.preventDefault();
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
    setSliderPosition(percentage);
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

  // Auto-sweep animation when not hovering
  useEffect(() => {
    if (isHovering || isFocused) return;
    
    let direction = 1;
    const interval = setInterval(() => {
      setSliderPosition(prev => {
        const next = prev + (0.5 * direction);
        if (next > 70) direction = -1;
        if (next < 30) direction = 1;
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isHovering, isFocused]);

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
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={activeMode === 'dog' ? dogSrc : catSrc} 
            className={cn(
                "absolute inset-0 w-full h-full max-w-none object-cover h-full", 
                // Fix for aspect ratio matching - we need the image to be exactly the same size/position as the underlying one.
                // Assuming all images are same aspect ratio. 
                // Since we use max-w-none and container width, we need to ensure it matches the container's full width.
                // Actually 'w-full' inside 'absolute inset-0' refers to the PARENT (the clipped div).
                // We need the image to be the width of the GRANDPARENT (container).
            )}
            style={{ width: containerRef.current?.offsetWidth || '100%' }} // Dynamic fix or just 100% of container?
            // Correction: The image inside the clipped div must be the full width of the CONTAINER, not the clipped div.
            // So we use width: 100% of the viewport (container) width.
            // But standard CSS 'w-full' is 100% of parent.
            // We need to use vw or calc? No.
            // We can just set the image width to the container width.
            // Let's use a style prop for width if possible, or just standard "100%" and ensure parent is the container.
            // Wait, if I put the image in a clipped div, and say w-full, it will be squished.
            // Correct approach:
          />
        </div>
        
        {/* Re-implementing the Image logic to be safer without JS width calculation for the inner image */}
        <div 
            className="absolute top-0 left-0 h-full overflow-hidden border-r-4 border-white/80 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
            style={{ width: `${sliderPosition}%` }}
        >
             <img 
                src={activeMode === 'dog' ? dogSrc : catSrc} 
                className="absolute top-0 left-0 max-w-none h-full object-cover"
                style={{ 
                    width: containerRef.current?.offsetWidth ? `${containerRef.current.offsetWidth}px` : '100%' 
                }}
                // Fallback: If ref is null (initial render), this might look weird. 
                // Better approach: use 'vw' or fixed size? 
                // Or just use a very wide width? 
                // Actually, standard solution:
                // Inner image width = 100% of container.
                // Set width to the container's width.
                // Let's rely on the JS width set above, or default to 100% and hope it matches.
                // Actually, standard trick: 'w-[500px]' (max width of container) if we know it.
                // Let's just use '100%' and a transformer? 
                // No, simpler: 
             />
             {/* Better way:
                The image should be: width: 100% (of container) height: 100%.
                The parent div clips it. 
                If parent div is 50%, image is 50%.
                So image needs to be 200%? No.
                The image inside the clipped div needs to be positioned absolutely and sized to the full container.
             */}
             <div className="w-full h-full relative">
                 {/* This wrapper is the clipped window. */}
                 {/* The image inside needs to be translated opposite to the clip? No. */}
                 {/* Simplest: The image is just fixed size matching the container. */}
                 {/* Let's try `width: '100vw'`? No. */}
                 {/* Let's trust the `containerRef.current.offsetWidth` trick, but add a resize listener. */}
             </div>
        </div>
        
         {/* Retry Image structure for robustness */}
         <div 
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
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] outline-none"
            style={{ left: `${sliderPosition}%` }}
            role="slider"
            tabIndex={0}
            aria-label="Comparison slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <div className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-all",
              "active:scale-95 group-hover:scale-110",
              isFocused && "ring-4 ring-orange-400 scale-110"
            )}>
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
