type Presets = 'veryslow' | 'slow' | 'medium' | 'fast' | 'veryfast';

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

export type BenchmarkResult = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
  inputPath: string;
  inputSizeMb: number;
  outputPath: string;
  outputSizeMb: number;
  durationMs: number;
  ratio: number;
  compressionPercentage: number;
};
