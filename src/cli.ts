import { spawnTranscodingProcess } from './lib/ffmpeg';
import { byteToMb, ratioToPercent } from './lib/utils';
import type { BenchmarkResult } from './types';

const inputPath = process.argv[2];
const configPath = process.argv[3] ?? 'presets/default.json';

if (!inputPath) {
  console.error('Usage: bun run start <input> <config>');
  process.exit(1);
}

if (!process.argv[3]) {
  console.log(`Config file not specified. Using ${configPath}.`);
}

const config = await Bun.file(configPath).json();
const benchmarks = config.benchmarks;
let results: BenchmarkResult[] = [];

for (const benchmark of benchmarks) {
  console.log(`Running ${benchmark.name}...`);

  const result = await spawnTranscodingProcess({
    inputPath: inputPath,
    codec: benchmark.codec,
    crf: benchmark.crf,
    preset: benchmark.preset,
    outputPath: `output/${benchmark.name}.mp4`,
  });

  const ratio = result.outputSize / result.inputSize;

  results.push({
    name: benchmark.name,
    codec: benchmark.codec,
    crf: benchmark.crf,
    preset: benchmark.preset,
    inputPath,
    inputSizeMb: byteToMb(result.inputSize),
    outputPath: result.outputPath,
    outputSizeMb: byteToMb(result.outputSize),
    durationMs: result.durationMs,
    ratio: ratio,
    compressionPercentage: ratioToPercent(ratio),
  });

  await Bun.write('results/result.json', JSON.stringify(results, null, 2));

  console.log('Results saved to results/result.json');
}

console.log(results);
