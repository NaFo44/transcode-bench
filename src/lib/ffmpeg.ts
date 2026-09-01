import { spawn } from 'node:child_process'

type Presets = "veryslow" | "slow" | "medium" | "fast" | "veryfast";

type ProcessInput = {
    inputPath: string;
    codec: string;
    crf: number;
    preset: Presets;
    outputPath: string;
}

type processOutput = {
    outputPath: string;
    durationMs: number;
}

const spawnTranscodingProcess = async ({
    inputPath,
    codec,
    crf,
    preset,
    outputPath
}: ProcessInput): Promise<processOutput> => {
    return new Promise((resolve, reject) => {
        const start = performance.now()

        const ffmpeg = spawn('ffmpeg', [
            '-i', inputPath,
            '-c:v', codec,
            '-crf', String(crf),
            '-preset', preset,
            '-c:a', 'copy',
            outputPath,
        ])
        
        ffmpeg.stderr.on("data", (data) => {
            process.stderr.write(data)
        })

        ffmpeg.on("error", (err) => {
            console.error("Cloud not spawn FFmpeg process. Make sure FFmpeg is installed"),
            
            reject(err)
        })

        ffmpeg.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`FFmpeg exited with code ${code}`))
                return;
            }

            const durationMs = performance.now() - start
            
            resolve ({
                outputPath,
                durationMs,
            })
        })
    })
}

export { spawnTranscodingProcess }