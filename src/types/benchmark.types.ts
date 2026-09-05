import type { Presets } from './shared';
import type { OutputFileMetadata } from './shared';

export type BenchmarkConfig = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
};

export type BenchmarkResult = {
  transcoding: TranscodingResult;
  outputFile: OutputFileMetadata;
};

export type BenchmarkResults = {
  inputPath: string;
  inputSizeMb: number;
  results: BenchmarkResult[];
};

export type TranscodingResult = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
  outputPath: string;
  durationMs: number;
  ratio: number;
  reductionPercentage: number;
};
