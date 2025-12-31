import { useState, type KeyboardEvent } from 'react'
import { useAppStore } from './store/useAppStore'
import { processImage } from './api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Sparkles, Loader2, Download, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Testimonials } from './components/Landing'
import { DogHUD, CatHUD } from './components/HUD'
import { HeroComparison } from './components/HeroComparison'

function App() {
  const { 
    mode, setMode, 
    originalImage, originalImageUrl, setOriginalImage,
    resultImageUrl, setResultImage,
    isProcessing, setIsProcessing,
    setError,
    reset 
  } = useAppStore()
  
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setOriginalImage(file)
      handleGenerate(file)
    }
  }

  // Scroll to upload section when mode is selected
  const handleModeSelect = (selectedMode: 'dog' | 'cat') => {
      setMode(selectedMode)
      setTimeout(() => {
          document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
  }

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>, selectedMode: 'dog' | 'cat') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleModeSelect(selectedMode)
    }
  }

  const handleGenerate = async (file: File) => {
    if (!mode) return
    setIsProcessing(true)
    setError(null)
    
    try {
      // 1. Single Step: Upload & Process (Serverless Friendly)
      const { url } = await processImage(file, mode)
      setResultImage(url)
    } catch (err) {
      setError("Failed to generate. Please try again.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnlock = () => {
    setIsUnlocking(true)
    setTimeout(() => {
      setIsUnlocked(true)
      setIsUnlocking(false)
    }, 1500) // Fake payment delay
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-400/20 blur-[120px] rounded-full mix-blend-multiply" />
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 blur-[120px] rounded-full mix-blend-multiply" />
           <div className="absolute top-[20%] left-[30%] w-[600px] h-[600px] bg-indigo-400/10 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        {/* HERO SECTION */}
        {!originalImage && !mode && (
          <div className="mb-24 pt-8 lg:pt-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left: Text & CTA */}
              <div className="text-center lg:text-left space-y-8">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm text-sm font-medium text-slate-600 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>#1 AI Filter for Pet Lovers</span>
                 </div>
                 
                 <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                    See yourself through <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">their eyes</span>.
                 </h1>
                 
                 <p className="text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    To your dog, you are a <b className="text-orange-600">Golden Deity</b>. 
                    To your cat, you are a <b className="text-purple-600">Clumsy Servant</b>. 
                    Upload a selfie and reveal the hilarious truth hidden in their brains.
                 </p>

                 <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6 rounded-full bg-slate-900 hover:bg-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                      onClick={() => document.getElementById('mode-selection')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Upload className="mr-2 w-5 h-5" />
                      Try It Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="text-lg px-8 py-6 rounded-full border-2 hover:bg-slate-50"
                      onClick={() => window.open('https://github.com', '_blank')}
                    >
                      View Gallery
                    </Button>
                 </div>
                 
                 <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover'}} />
                       ))}
                    </div>
                    <p>Loved by 10,000+ humans</p>
                 </div>
              </div>

              {/* Right: Visual Impact */}
              <div className="relative hidden lg:flex h-[600px] w-full items-center justify-center">
                 <HeroComparison 
                    realitySrc="/hero_image_reality.png" 
                    catRealitySrc="/hero_image_reality_cat.png"
                    dogSrc="/hero_image_dogvision.png" 
                    catSrc="/hero_image_catvision.png" 
                 />
                 
                 {/* Background Accents (Kept for vibe) */}
                 <div className="absolute top-10 right-0 -z-10 animate-bounce duration-[3000ms]">
                    <img src="/mode_dog.png" className="w-16 h-16 object-contain opacity-50" />
                 </div>
                 <div className="absolute bottom-20 left-10 -z-10 animate-bounce duration-[4000ms]">
                    <img src="/mode_cat.png" className="w-16 h-16 object-contain opacity-50" />
                 </div>
              </div>

              {/* Mobile Only Image (Simplified) */}
              <div className="lg:hidden relative mx-auto w-64 aspect-[3/4] rounded-2xl shadow-xl overflow-hidden border-4 border-orange-200 rotate-3">
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 to-orange-500/30 mix-blend-overlay z-10" />
                  <img src="/hero_image_dogvision.png" className="w-full h-full object-cover brightness-125 saturate-150" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">Dog Mode Preview</span>
                  </div>
              </div>

            </div>
          </div>
        )}
        
        {/* Testimonials (Keep this) */}
        {!originalImage && !mode && <Testimonials />}
        
        {/* SECTION: Mode Selection (Target for CTA) */}
        {!originalImage && (
          <div id="mode-selection" className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto scroll-mt-24", !mode ? "mt-12" : "")}>
            <Card 
              role="button"
              tabIndex={0}
              aria-pressed={mode === 'dog'}
              onKeyDown={(e) => handleCardKeyDown(e, 'dog')}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:-translate-y-1 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                mode === 'dog' ? "border-indigo-500 bg-indigo-50" : "border-slate-100 hover:border-orange-200"
              )}
              onClick={() => handleModeSelect('dog')}
            >
              <CardContent className="flex flex-col items-center p-8">
                <div className="bg-orange-100/50 p-6 rounded-full mb-6 relative group">
                  <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                  <img src="/mode_dog.png" className="w-24 h-24 object-contain relative z-10 transform group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Dog Mode</h3>
                <p className="text-slate-500 text-center mt-3">
                  Adoration filter. You are a glowing deity. Everything is vibrant.
                </p>
              </CardContent>
            </Card>

            <Card 
              role="button"
              tabIndex={0}
              aria-pressed={mode === 'cat'}
              onKeyDown={(e) => handleCardKeyDown(e, 'cat')}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:-translate-y-1 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                mode === 'cat' ? "border-indigo-500 bg-indigo-50" : "border-slate-100 hover:border-purple-200"
              )}
              onClick={() => handleModeSelect('cat')}
            >
              <CardContent className="flex flex-col items-center p-8">
                <div className="bg-purple-100/50 p-6 rounded-full mb-6 relative group">
                  <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                  <img src="/mode_cat.png" className="w-24 h-24 object-contain relative z-10 transform group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Cat Mode</h3>
                <p className="text-slate-500 text-center mt-3">
                  Judgmental filter. You are a clumsy servant. Everything is desaturated.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 2: Upload */}
        {mode && !originalImage && (
          <div id="upload-section" className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <span className={cn("inline-block px-4 py-1 rounded-full text-sm font-bold mb-4", mode === 'dog' ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700")}>
                    Selected: {mode === 'dog' ? "🐶 Dog Perspective" : "🐱 Cat Perspective"}
                </span>
            </div>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-4 text-indigo-400" />
                  <p className="mb-2 text-lg text-slate-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-sm text-slate-400">Your selfie, their vision.</p>
                </div>
                <input id="dropzone-file" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
            <div className="text-center mt-8">
              <Button variant="ghost" onClick={() => setMode(null)} className="text-slate-500">
                ← Back to Mode Selection
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Loading */}
        {isProcessing && (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-300">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 animate-pulse">
              {mode === 'dog' ? "Sniffing your aura..." : "Judging your life choices..."}
            </h3>
            <p className="text-slate-500 mt-2">Connecting to {mode === 'dog' ? "Canine" : "Feline"} Neural Network...</p>
          </div>
        )}

        {/* STEP 4: Results */}
        {resultImageUrl && !isProcessing && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Original */}
              <div className="bg-white p-2 rounded-lg shadow">
                <img src={originalImageUrl!} alt="Original" className="w-full h-64 object-cover rounded" />
                <p className="text-center text-sm text-slate-500 mt-2">Reality</p>
              </div>
              
              {/* Result */}
              <div className="bg-white p-2 rounded-lg shadow relative group overflow-hidden">
                 <div className="relative">
                   <img 
                      src={resultImageUrl} 
                      alt="Result" 
                      className={cn(
                        "w-full h-64 object-cover rounded transition-all duration-700",
                        !isUnlocked && "blur-sm scale-105"
                      )} 
                    />
                    
                    {/* HUD OVERLAY */}
                    {mode === 'dog' && <DogHUD />}
                    {mode === 'cat' && <CatHUD />}

                    {/* Watermark Overlay (Keep this) */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] z-20">
                        <Lock className="w-12 h-12 text-white mb-2" />
                        <p className="text-white font-bold drop-shadow-md">Premium Vision</p>
                      </div>
                    )}
                 </div>

                  <p className="text-center text-sm text-indigo-600 font-bold mt-2">
                    {mode === 'dog' ? "Through Dog's Eyes" : "Through Cat's Eyes"}
                  </p>
              </div>
            </div>

            {/* AI Commentary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8 text-center">
              <Sparkles className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg italic text-slate-700">
                {mode === 'dog' 
                  ? '"OMG! THE GIANT LIGHT-BRINGER IS HOLDING THE MAGIC GLOWING SQUARE! I LOVE YOU! DO YOU HAVE CHEESE?"'
                  : '"Pathetic. The large hairless ape is staring at the rectangle again. The food bowl is half empty. This is unacceptable."'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 items-center">
              {!isUnlocked ? (
                <Button size="lg" className="w-full md:w-auto text-lg px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all" onClick={handleUnlock} disabled={isUnlocking}>
                  {isUnlocking ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" /> Unlock HD Result ($0.99)
                    </>
                  )}
                </Button>
              ) : (
                 <Button size="lg" className="w-full md:w-auto text-lg px-8 bg-green-600 hover:bg-green-700 shadow-lg animate-bounce" onClick={() => window.open(resultImageUrl, '_blank')}>
                    <Download className="mr-2 h-5 w-5" /> Download HD Image
                 </Button>
              )}
              
              <Button variant="ghost" onClick={reset} className="text-slate-500 hover:text-slate-800">
                Start Over
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default App