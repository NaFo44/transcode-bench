export type Presets = 'veryslow' | 'slow' | 'medium' | 'fast' | 'veryfast';

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

export type MediaMetadata = {
  codec: string;
  width: number;
  height: number;
  fps: number;
  bitrate?: number | undefined;
  size: number;
  duration: number;
};

export type QualityScore = {
  vmaf: number;
};

export interface QualityAnalyser {
  analyse(referencePath: string, distortedPath: string): Promise<QualityScore>;
}
