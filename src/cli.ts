import { spawnTranscodingProcess } from './lib/ffmpeg';
import { byteToMb, ratioToPercent } from './lib/utils';

const input = process.argv[2];
const configPath = process.argv[3] ?? 'presets/default.json'

if (!input) {
  console.error('Usage: bun run src/cli.ts <input> <config>');
  process.exit(1);
}

if (!process.argv[3]) {
    console.log(`Config file not specified. Using ${configPath}.`)
}

const config = await Bun.file(configPath).json();
const benchmarks = config.benchmarks;

for (const benchmark of benchmarks) {
  console.log(`Running ${benchmark.name}...`);

  const ffmpeg = await spawnTranscodingProcess({
    inputPath: input,
    codec: benchmark.codec,
    crf: benchmark.crf,
    preset: benchmark.preset,
    outputPath: `output/${benchmark.name}.mp4`,
  });

  console.log(
    `Job finished.
        Input Path: ${input};
        Input Size: ${byteToMb(ffmpeg.inputSize).toFixed(2)} MB
        Transcoding duration: ${ffmpeg.durationMs};
        Output Path: ${ffmpeg.outputPath};
        Output Size: ${byteToMb(ffmpeg.outputSize).toFixed(2)} MB
        Output/Input ratio: ${ffmpeg.ratio}
        Compression percentage: ${ratioToPercent(ffmpeg.ratio)}`,
  );
}
