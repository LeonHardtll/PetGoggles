import { create } from 'zustand'

type PetMode = 'dog' | 'cat' | null

interface AppState {
  mode: PetMode
  originalImage: File | null
  originalImageUrl: string | null
  resultImageUrl: string | null
  isProcessing: boolean
  error: string | null

  // Actions
  setMode: (mode: PetMode) => void
  setOriginalImage: (file: File) => void
  setResultImage: (url: string) => void
  setIsProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  mode: null,
  originalImage: null,
  originalImageUrl: null,
  resultImageUrl: null,
  isProcessing: false,
  error: null,

  setMode: (mode) => set({ mode }),
  setOriginalImage: (file) => {
    // Create a local preview URL immediately
    const url = URL.createObjectURL(file)
    set({ originalImage: file, originalImageUrl: url, error: null })
  },
  setResultImage: (url) => set({ resultImageUrl: url }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  reset: () => set({ 
    mode: null, 
    originalImage: null, 
    originalImageUrl: null, 
    resultImageUrl: null, 
    isProcessing: false, 
    error: null 
  }),
}))
