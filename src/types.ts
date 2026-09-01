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
  ratio: number;
};

type BenchmarkConfig = {
  name: string;
  codec: string;
  crf: number;
  preset: Presets;
};
