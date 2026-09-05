import type { QualityAnalyser, QualityScore } from '../types/shared';
import { unlink } from 'node:fs/promises';

export class VmafAnalyserImpl implements QualityAnalyser {
  async analyse(
    referencePath: string,
    distortedPath: string,
  ): Promise<QualityScore> {
    const logPath = `results/vmaf-${crypto.randomUUID()}.json`;

    const process = Bun.spawn([
      'ffmpeg',
      '-i',
      referencePath,
      '-i',
      distortedPath,
      '-lavfi',
      `libvmaf=log_fmt=json:log_path=${logPath}`,
      '-f',
      'null',
      '-',
    ]);

    const exitCode = await process.exited;

    if (exitCode !== 0) {
      const errorOutput = await new Response(process.stderr).text();

      throw new Error(
        `VMAF analysis failed with code ${exitCode}: ${errorOutput}`,
      );
    }

    const raw = await Bun.file(logPath).json();

    const score = raw.pooled_metrics?.vmaf?.mean;

    await unlink(logPath);

    if (typeof score !== 'number') {
      throw new Error('VMAF score not found in FFmpeg output');
    }

    return { vmaf: score };
  }
}
