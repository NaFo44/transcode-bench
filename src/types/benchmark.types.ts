import type { Presets } from './shared';
import type { MediaMetadata } from './shared';

export type BenchmarkConfig = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
};

export type TranscodingResult = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
  outputPath: string;
};

export type Performance = {
  durationMs: number;
  speedFactor: number;
};

export type Compression = {
  outputSize: number;
  ratio: number;
  reductionPercentage: number;
};

export type Result = {
  transcoding: TranscodingResult;
  performance: Performance;
  compression: Compression;
  output: MediaMetadata;
};

export type Results = {
  input: {
    metadata: MediaMetadata;
    name: string;
  }
  result: Result[];
};
