import { spawnTranscodingProcess } from './lib/ffmpeg';

const input = process.argv[2];

if (!input) {
  console.error('Usage: bun run src/cli.ts <input>');
  process.exit(1);
}

const output = 'output/output.mp4';

const ffmpeg = await spawnTranscodingProcess({
  inputPath: input,
  codec: 'libx264',
  crf: 23,
  preset: 'medium',
  outputPath: output,
});

console.log(
  `Transcoding done. Input: ${input}; Duration: ${ffmpeg.durationMs}; Output: ${ffmpeg.outputPath}`,
);
