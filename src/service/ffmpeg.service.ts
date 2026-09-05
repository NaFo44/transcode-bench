import type { ProcessInput, ProcessOutput } from '../types/shared';
import type { FfmpegRunner } from './benchmark.service';

export class FfmpegRunnerImpl implements FfmpegRunner {
  async run({
    inputPath,
    codec,
    crf,
    preset,
    outputPath,
  }: ProcessInput): Promise<ProcessOutput> {
    const start = performance.now();

    const ffmpeg = Bun.spawn([
      'ffmpeg',
      '-y',
      '-i',
      inputPath,
      '-c:v',
      codec,
      '-crf',
      String(crf),
      '-preset',
      preset,
      '-c:a',
      'copy',
      outputPath,
    ]);

    const exitCode = await ffmpeg.exited;

    if (exitCode !== 0) {
      throw new Error(`FFmpeg exited with code ${exitCode}`);
    }

    const [inputSize, outputStats] = await Promise.all([
      this.getInputSize(inputPath),
      Bun.file(outputPath).size,
    ]);

    return {
      outputPath,
      durationMs: performance.now() - start,
      outputSize: outputStats,
      inputSize,
    };
  }

  async getInputSize(inputPath: string): Promise<number> {
    const file = Bun.file(inputPath);
    return await file.size;
  }
}
