const API_BASE = '/api'

export async function processImage(file: File, mode: string): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('mode', mode)

  const response = await fetch(`${API_BASE}/images/process`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let errorMessage = 'Processing failed';
    try {
      const errorData = await response.json();
      console.error('Backend Error Details:', errorData);
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch (e) {
      const text = await response.text();
      console.error('Backend Error Text:', text);
      errorMessage = `Processing failed (${response.status}): ${text.substring(0, 100)}`;
    }
    throw new Error(errorMessage);
  }

  return response.json()
}

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
