import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

// --- Visual Showcase Section ---
export function Showcase() {
  return (
    <div className="py-12 bg-white rounded-3xl my-12 border border-slate-100 shadow-sm">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">The Truth Revealed</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          See the dramatic difference between reality and your pet's internal cinema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Reality */}
        <div className="space-y-3">
          <div className="relative group overflow-hidden rounded-xl aspect-[3/4] shadow-md">
             <img 
               src="/hero_image_reality.png" 
               alt="Human Reality" 
               className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
             />
             <Badge className="absolute top-3 left-3 bg-slate-900/80 hover:bg-slate-900">Reality</Badge>
          </div>
          <p className="text-sm text-slate-500 text-center italic">Just a normal human trying their best.</p>
        </div>

        {/* Dog Vision */}
        <div className="space-y-3">
          <div className="relative group overflow-hidden rounded-xl aspect-[3/4] shadow-xl border-4 border-orange-200">
             <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 z-10 mix-blend-overlay pointer-events-none" />
             <img 
               src="/hero_image_dogvision.png" 
               alt="Dog Vision" 
               className="object-cover w-full h-full brightness-110 contrast-125 saturate-150 transition-transform duration-500 group-hover:scale-105"
             />
             <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 border-none">Dog Mode 🐶</Badge>
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-900/80 to-transparent p-4 pt-12">
               <p className="text-white font-bold text-sm">✨ GLORIOUS LEADER ✨</p>
             </div>
          </div>
          <p className="text-sm text-slate-500 text-center italic">"The most beautiful being in the universe!"</p>
        </div>

        {/* Cat Vision */}
        <div className="space-y-3">
          <div className="relative group overflow-hidden rounded-xl aspect-[3/4] shadow-xl border-4 border-purple-200">
             <div className="absolute inset-0 bg-indigo-900/20 z-10 mix-blend-multiply pointer-events-none" />
             <img 
               src="/hero_image_catvision.png" 
               alt="Cat Vision" 
               className="object-cover w-full h-full grayscale-[50%] contrast-125 transition-transform duration-500 group-hover:scale-110"
             />
             <Badge className="absolute top-3 left-3 bg-purple-600 hover:bg-purple-700 border-none">Cat Mode 🐱</Badge>
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/80 to-transparent p-4 pt-12">
               <p className="text-white font-bold text-sm">🥘 THE SERVANT 🥘</p>
             </div>
          </div>
          <p className="text-sm text-slate-500 text-center italic">"Useful only for opening cans. Mediocre."</p>
        </div>
      </div>
    </div>
  )
}

// --- Testimonials Section ---
export function Testimonials() {
  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">Reviews from the Community</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-1 mb-4 text-orange-400" role="img" aria-label="5 out of 5 stars">
              <Star className="fill-current w-4 h-4" aria-hidden="true" /><Star className="fill-current w-4 h-4" aria-hidden="true" /><Star className="fill-current w-4 h-4" aria-hidden="true" /><Star className="fill-current w-4 h-4" aria-hidden="true" /><Star className="fill-current w-4 h-4" aria-hidden="true" />
            </div>
            <Quote className="w-8 h-8 text-orange-200 mb-2" aria-hidden="true" />
            <p className="text-slate-700 font-medium italic mb-4">
              "Finally, an app that captures my human's true radiance! I knew they were made of sunshine and bacon!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100" alt="Rex" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              <div>
                <p className="text-sm font-bold text-slate-900">Rex</p>
                <p className="text-xs text-slate-500">Golden Retriever • Good Boy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-1 mb-4 text-purple-400" role="img" aria-label="2 out of 5 stars">
              <Star className="fill-current w-4 h-4" aria-hidden="true" /><Star className="fill-current w-4 h-4" aria-hidden="true" />
            </div>
            <Quote className="w-8 h-8 text-purple-200 mb-2" aria-hidden="true" />
            <p className="text-slate-700 font-medium italic mb-4">
              "Accurate representation of the biped's awkwardness. The filter exposes their true lack of grace. 2 stars because I was fed late."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=100" alt="Luna" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              <div>
                <p className="text-sm font-bold text-slate-900">Luna</p>
                <p className="text-xs text-slate-500">Void Cat • The Boss</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
