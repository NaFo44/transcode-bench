export type Presets = 'veryslow' | 'slow' | 'medium' | 'fast' | 'veryfast';

export type BenchmarkConfig = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
};

export type ProcessInput = {
  inputPath: string;
  codec: string;
  crf: number;
  preset: Presets;
  outputPath: string;
};

export type ProcessOutput = {
  outputPath: string;
  durationMs: number;
  outputSize: number;
  inputSize: number;
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

export type OutputFileMetadata = {
  codec: string;
  width: number;
  height: number;
  fps: number;
  bitrate?: number | undefined;
  size: number;
};

export type ExtractorInput = {
  inputPath: string;
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
