import { spawnTranscodingProcess } from './lib/ffmpeg';
import { byteToMb, ratioToPercent } from './lib/utils';

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
  `Transcoding done.
   Input Path: ${input};
   Input Size: ${byteToMb(ffmpeg.inputSize).toFixed(2)} MB
   Transcoding duration: ${ffmpeg.durationMs};
   Output Path: ${ffmpeg.outputPath};
   Output Size: ${byteToMb(ffmpeg.outputSize).toFixed(2)} MB
   Output/Input ratio: ${ffmpeg.ratio}
   Compression percentage: ${ratioToPercent(ffmpeg.ratio)}`,
);
