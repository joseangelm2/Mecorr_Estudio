export async function compressImage(file: File, maxDimension = 1920, quality = 0.8): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.warn('[compressImage] sin contexto 2d, se sube el original sin comprimir')
      return file
    }

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob) {
      console.warn('[compressImage] canvas.toBlob devolvió null, se sube el original sin comprimir')
      return file
    }

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    const compressed = new File([blob], newName, { type: 'image/jpeg' })

    console.info(`[compressImage] ${file.name}: ${(file.size / 1e6).toFixed(1)}MB → ${(compressed.size / 1e6).toFixed(1)}MB`)
    return compressed
  } catch (err) {
    console.warn('[compressImage] falló, se sube el original sin comprimir:', err)
    return file
  }
}
