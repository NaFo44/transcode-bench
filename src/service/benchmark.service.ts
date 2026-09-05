import type {
  BenchmarkConfig,
  ConfigFile,
  Results,
  Result,
} from '../types/benchmark.types';
import type {
  ProcessInput,
  ProcessOutput,
  MediaMetadata,
  QualityAnalyser,
  QualityScore,
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
    private readonly qualityAnalyser: QualityAnalyser,
    private readonly formatter: BenchmarkFormatter,
  ) {}

  async runAll(inputPath: string, config: ConfigFile): Promise<Results> {
    const inputMetadata = await this.metadataReader.read(inputPath);

    const results: Results = {
      input: {
        name: inputPath,
        metadata: inputMetadata,
      },
      result: [],
    };

    for (const benchmark of config.benchmarks) {
      const run = await this.runOne(inputPath, benchmark, config.vmaf);
      run.performance.speedFactor =
        inputMetadata.duration / run.performance.encodingTimeMs;
      results.result.push(run);
    }

    return results;
  }

  private async runOne(
    inputPath: string,
    config: BenchmarkConfig,
    enableVmaf: boolean,
  ): Promise<Result> {
    const output = await this.ffmpegRunner.run({
      inputPath,
      codec: config.codec,
      crf: config.crf,
      preset: config.preset,
      outputPath: `output/${config.name}.mp4`,
    });

    const metadata = await this.metadataReader.read(output.outputPath);

    let quality: QualityScore | undefined;

    if (enableVmaf) {
      quality = await this.qualityAnalyser.analyse(
        inputPath,
        output.outputPath,
      );
    }

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
        encodingTimeMs: output.durationMs,
        speedFactor: 0,
      },
      compression: {
        ratio,
        reductionPercentage: this.formatter.reductionPercent(ratio),
      },
      quality,
      output: metadata,
    };
  }
}
