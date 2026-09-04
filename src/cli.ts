import { mkdir } from 'node:fs/promises';

import { configSchema } from './schemas';
import { spawnTranscodingProcess } from './lib/ffmpeg';
import { byteToMb, ratioToPercent } from './lib/utils';
import type { BenchmarkConfig, BenchmarkResults } from './types';

type CliArgs = {
  inputPath: string;
  configPath: string;
};

function parseArgs(): CliArgs {
  const inputPath = process.argv[2];
  const configPath = process.argv[3] ?? 'presets/default.json';

  if (!inputPath) {
    console.error('Usage: bun run start <input> [config]');
    process.exit(1);
  }

  if (!process.argv[3]) {
    console.log(`Config file not specified. Using ${configPath}.`);
  }

  return {
    inputPath,
    configPath,
  };
}

async function loadConfig(configPath: string) {
  const rawConfig = await Bun.file(configPath).json();

  return configSchema.parse(rawConfig);
}

async function runBenchmarks(
  inputPath: string,
  benchmarks: BenchmarkConfig[],
): Promise<BenchmarkResults> {
  const results: BenchmarkResults = {
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

    results.inputSizeMb = byteToMb(processOutput.inputSize);

    results.results.push({
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

  return results;
}

async function saveResults(results: BenchmarkResults) {
  await mkdir('results', { recursive: true });

  await Bun.write('results/result.json', JSON.stringify(results, null, 2));

  console.log('Results saved to results/result.json');
}

async function main() {
  const { inputPath, configPath } = parseArgs();
  const config = await loadConfig(configPath);

  await mkdir('output', { recursive: true });

  const results = await runBenchmarks(inputPath, config.benchmarks);

  await saveResults(results);

  console.log(results);
}

await main();
