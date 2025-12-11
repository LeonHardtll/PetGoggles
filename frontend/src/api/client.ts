const API_BASE = 'http://localhost:8000/api'

export async function uploadImage(file: File): Promise<{ id: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/images/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Upload failed')
  }

  return response.json()
}

export async function generateImage(imageId: string, mode: string): Promise<{ url: string }> {
  const response = await fetch(`${API_BASE}/images/generate/${imageId}?mode=${mode}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Generation failed')
  }

  return response.json()
}
