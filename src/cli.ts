import { spawnTranscodingProcess } from './lib/ffmpeg';
import { byteToMb, ratioToPercent } from './lib/utils';
import type { BenchmarkResults } from './types';

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

const result: BenchmarkResults = {
  inputPath,
  inputSizeMb: 0,
  results: [],
};

for (const benchmark of benchmarks) {
  console.log(`Running ${benchmark.name}...`);

  const processOutput = await spawnTranscodingProcess({
    inputPath,
    codec: benchmark.codec,
    crf: benchmark.crf,
    preset: benchmark.preset,
    outputPath: `output/${benchmark.name}.mp4`,
  });

  const ratio = processOutput.outputSize / processOutput.inputSize;

  result.inputSizeMb = byteToMb(processOutput.inputSize);

  result.results.push({
    name: benchmark.name,
    codec: benchmark.codec,
    crf: benchmark.crf,
    preset: benchmark.preset,
    outputPath: processOutput.outputPath,
    outputSizeMb: byteToMb(processOutput.outputSize),
    durationMs: processOutput.durationMs,
    ratio,
    compressionPercentage: ratioToPercent(ratio),
  });
}

await Bun.write('results/result.json', JSON.stringify(result, null, 2));

console.log('Results saved to results/result.json');
console.log(result);