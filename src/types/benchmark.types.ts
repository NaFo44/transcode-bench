import type { Presets, QualityScore } from './shared';
import type { MediaMetadata } from './shared';

export type BenchmarkConfig = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
};

export type ConfigFile = {
  vmaf: boolean;
  benchmarks: BenchmarkConfig[];
};

export type TranscodingResult = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
  outputPath: string;
};

export type Performance = {
  encodingTimeMs: number;
  speedFactor: number;
};

export type Compression = {
  ratio: number;
  reductionPercentage: number;
};

export type Result = {
  transcoding: TranscodingResult;
  performance: Performance;
  compression: Compression;
  quality?: QualityScore;
  output: MediaMetadata;
};

export type Results = {
  input: {
    name: string;
    metadata: MediaMetadata;
  };
  result: Result[];
};
