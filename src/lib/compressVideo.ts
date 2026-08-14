import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

let ffmpegInstance: FFmpeg | null = null
let ffmpegLoading: Promise<FFmpeg> | null = null

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance
  if (ffmpegLoading) return ffmpegLoading

  ffmpegLoading = (async () => {
    const ffmpeg = new FFmpeg()
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    ffmpegInstance = ffmpeg
    return ffmpeg
  })()

  return ffmpegLoading
}

export async function compressVideo(file: File): Promise<File> {
  try {
    const ffmpeg = await getFFmpeg()
    const ext = file.name.match(/\.[^.]+$/)?.[0] || '.mp4'
    const inputName = `input${ext}`
    const outputName = 'output.mp4'

    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec([
      '-i', inputName,
      '-vf', "scale='min(1280,iw)':-2",
      '-crf', '28',
      '-preset', 'ultrafast',
      '-c:a', 'aac',
      '-b:a', '128k',
      outputName,
    ])
    const data = await ffmpeg.readFile(outputName)
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)

    const blob = new Blob([data as BlobPart], { type: 'video/mp4' })
    const newName = file.name.replace(/\.[^.]+$/, '') + '-compressed.mp4'
    const compressed = new File([blob], newName, { type: 'video/mp4' })

    console.info(`[compressVideo] ${file.name}: ${(file.size / 1e6).toFixed(1)}MB → ${(compressed.size / 1e6).toFixed(1)}MB`)
    return compressed
  } catch (err) {
    console.warn('[compressVideo] falló, se sube el original sin comprimir:', err)
    return file
  }
}
