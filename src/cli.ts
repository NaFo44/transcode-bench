import { spawn } from 'node:child_process'

const input = process.argv[2]

if (!input) {
    console.error('Usage: bun run src/cli.ts <input>')
    process.exit(1);
}

const output = 'output/output.mp4'

const start = performance.now()

const ffmpeg = spawn('ffmpeg', [
    '-i', input,
    '-c:v', 'libx264',
    '-crf', '23',
    '-preset', 'medium',
    '-c:a', 'copy',
    output,
])

ffmpeg.stderr.on('data', (data) => {
    process.stderr.write(data)
})

ffmpeg.stderr.on('close', (code) => {
    const duration = performance.now() - start;

    console.log(`\nFFmpeg exited with code ${code}`)
    console.log(`Encoding time ${(duration / 1000).toFixed(2)}s`)
})