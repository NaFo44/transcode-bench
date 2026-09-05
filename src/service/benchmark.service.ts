import type {
  BenchmarkConfig,
  BenchmarkResult,
  BenchmarkResults,
} from '../types/benchmark.types';
import type {
  ProcessInput,
  ProcessOutput,
  OutputFileMetadata,
} from '../types/shared';

export interface FfmpegRunner {
  run(input: ProcessInput): Promise<ProcessOutput>;
  getInputSize(inputPath: string): Promise<number>;
}

export interface MetadataReader {
  read(inputPath: string): Promise<OutputFileMetadata>;
}

export interface BenchmarkFormatter {
  reductionPercent(ratio: number): number;
}

export class BenchmarkFormatterImpl implements BenchmarkFormatter {
  reductionPercent(ratio: number): number {
    return (1 - ratio) * 100;
  }
}

export class BenchmarkService {
  constructor(
    private readonly ffmpegRunner: FfmpegRunner,
    private readonly metadataReader: MetadataReader,
    private readonly formatter: BenchmarkFormatter,
  ) {}

  async runAll(
    inputPath: string,
    configs: BenchmarkConfig[],
  ): Promise<BenchmarkResults> {
    const results: BenchmarkResults = {
      inputPath,
      inputSizeMb: 0,
      results: [],
    };

    for (const config of configs) {
      const run = await this.runOne(inputPath, config);
      results.results.push(run);
    }

    const inputSize = await this.ffmpegRunner.getInputSize(inputPath);
    results.inputSizeMb = inputSize / (1024 * 1024);

    return results;
  }

  private async runOne(
    inputPath: string,
    config: BenchmarkConfig,
  ): Promise<BenchmarkResult> {
    const output = await this.ffmpegRunner.run({
      inputPath,
      codec: config.codec,
      crf: config.crf,
      preset: config.preset,
      outputPath: `output/${config.name}.mp4`,
    });

    const metadata = await this.metadataReader.read(output.outputPath);
    const ratio = output.outputSize / output.inputSize;

    return {
      transcoding: {
        name: config.name,
        codec: config.codec,
        crf: config.crf,
        preset: config.preset,
        outputPath: output.outputPath,
        durationMs: output.durationMs,
        ratio,
        reductionPercentage: this.formatter.reductionPercent(ratio),
      },
      outputFile: metadata,
    };
  }
}
