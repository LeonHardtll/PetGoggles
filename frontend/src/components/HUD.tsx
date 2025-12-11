import { Heart, Zap, Crosshair, AlertTriangle, Battery } from 'lucide-react'

export function DogHUD() {
  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between animate-in fade-in duration-1000">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="bg-orange-500/80 backdrop-blur-md text-white px-4 py-2 rounded-br-2xl rounded-tl-lg shadow-lg border-2 border-yellow-300 transform -skew-x-12">
          <div className="flex items-center gap-2 transform skew-x-12">
            <Heart className="fill-white w-5 h-5 animate-pulse" />
            <span className="font-black text-lg tracking-widest">LOVE: 9999%</span>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
           <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}/>
           <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '400ms'}}/>
        </div>
      </div>

      {/* Center Target (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-dashed border-yellow-200/30 rounded-full animate-spin-slow opacity-50" />

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
         <div className="bg-black/40 backdrop-blur text-white p-3 rounded-lg border border-yellow-400/50">
            <p className="text-xs text-yellow-200 font-mono">OBJECT IDENTIFIED</p>
            <p className="font-bold text-xl">BEST FRIEND</p>
         </div>
         
         <div className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-1 rounded-full font-bold text-sm animate-pulse">
            <Zap className="w-4 h-4 fill-black" />
            <span>EXCITEMENT LEVEL: MAX</span>
         </div>
      </div>
    </div>
  )
}

export function CatHUD() {
  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between animate-in fade-in duration-1000 font-mono">
      {/* Overlay Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none" />
      
      {/* Top UI */}
      <div className="flex justify-between items-start z-10">
        <div className="border border-purple-500/50 bg-black/60 text-purple-300 px-3 py-1 text-xs">
           <p>SYS.ANALYSIS.v9</p>
           <p className="text-red-400">THREAT: NEGLIGIBLE</p>
        </div>
        <div className="flex flex-col items-end gap-1">
           <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
              <span className="animate-pulse">● REC</span>
              <span>[12:04:99]</span>
           </div>
           <Battery className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
         <div className="relative">
            <Crosshair className="w-32 h-32 text-purple-500/40" strokeWidth={1} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500" />
         </div>
         <div className="absolute -right-24 top-0 bg-red-900/80 text-white text-[10px] p-1 border-l-2 border-red-500">
            <p>INTELLIGENCE: LOW</p>
            <p>OBEDIENCE: HIGH</p>
         </div>
      </div>

      {/* Bottom UI */}
      <div className="flex justify-between items-end z-10">
         <div className="flex gap-4 text-purple-400/70 text-xs">
            <div>
               <p>HGT: 175cm</p>
               <p>WGT: UNKNOWN</p>
            </div>
            <div>
               <p>STATUS: CLUMSY</p>
               <p>FOOD: NOT DETECTED</p>
            </div>
         </div>
         
         <div className="flex items-center gap-2 border border-red-500/50 bg-red-900/20 px-3 py-1 text-red-400 rounded">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">JUDGMENT IN PROGRESS</span>
         </div>
      </div>
    </div>
  )
}
