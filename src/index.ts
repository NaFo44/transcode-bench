import { configSchema } from './schemas';
import { FfmpegRunnerImpl } from './service/ffmpeg.service';
import { MetadataReaderImpl } from './service/ffprobe.service';
import {
  BenchmarkService,
  BenchmarkFormatterImpl,
} from './service/benchmark.service';
import { JsonResultRepository } from './storage/result-repository';

async function main() {
  const inputPath = process.argv[2];
  const configPath = process.argv[3] ?? 'presets/default.json';

  if (!inputPath) {
    throw new Error('Usage: bun run start <input> [config]');
  }

  if (!process.argv[3]) {
    console.log(`Config file not specified. Using ${configPath}.`);
  }

  const raw = await Bun.file(configPath).json();
  const config = configSchema.parse(raw);

  const service = new BenchmarkService(
    new FfmpegRunnerImpl(),
    new MetadataReaderImpl(),
    new BenchmarkFormatterImpl(),
  );

  const results = await service.runAll(inputPath, config.benchmarks);

  const repo = new JsonResultRepository();
  await repo.save('results/result.json', results);
}

await main();
