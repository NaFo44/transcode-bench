import type {
  BenchmarkConfig,
  Results,
  Result,
} from '../types/benchmark.types';
import type {
  ProcessInput,
  ProcessOutput,
  MediaMetadata,
} from '../types/shared';

export interface FfmpegRunner {
  run(input: ProcessInput): Promise<ProcessOutput>;
  getInputSize(inputPath: string): Promise<number>;
}

export interface MetadataReader {
  read(inputPath: string): Promise<MediaMetadata>;
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
  ): Promise<Results> {
    const inputMetadata = await this.metadataReader.read(inputPath);

    const results: Results = {
      input: {
        metadata: inputMetadata,
        name: inputPath,
      },
      result: [],
    };

    for (const config of configs) {
      const run = await this.runOne(inputPath, config);
      run.performance.speedFactor =
        inputMetadata.duration / run.performance.durationMs;
      results.result.push(run);
    }

    return results;
  }

  private async runOne(
    inputPath: string,
    config: BenchmarkConfig,
  ): Promise<Result> {
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
      },
      performance: {
        durationMs: output.durationMs,
        speedFactor: 0,
      },
      compression: {
        outputSize: metadata.size,
        ratio,
        reductionPercentage: this.formatter.reductionPercent(ratio),
      },
      output: metadata,
    };
  }
}
