import { ffprobeSchema } from '../schemas';
import type { MediaMetadata } from '../types/shared';

export interface MetadataReader {
  read(inputPath: string): Promise<MediaMetadata>;
}

export class MetadataReaderImpl implements MetadataReader {
  async read(inputPath: string): Promise<MediaMetadata> {
    const process = Bun.spawn([
      'ffprobe',
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=codec_name,width,height,r_frame_rate,bit_rate',
      '-show_entries',
      'format=size, duration',
      '-of',
      'json',
      inputPath,
    ]);

    const exitCode = await process.exited;

    if (exitCode !== 0) {
      throw new Error(`FFprobe exited with code ${exitCode}`);
    }

    const rawOutput = await new Response(process.stdout).text();
    const parsed = JSON.parse(rawOutput);

    const safeData = ffprobeSchema.parse(parsed);
    const stream = safeData.streams[0];

    if (!stream) {
      throw new Error('No video stream found');
    }

    const [numerator, denominator] = stream.r_frame_rate.split('/').map(Number);

    if (
      numerator === undefined ||
      denominator === undefined ||
      denominator === 0 ||
      Number.isNaN(numerator) ||
      Number.isNaN(denominator)
    ) {
      throw new Error(
        `Invalid frame rate returned by FFprobe: ${stream.r_frame_rate}`,
      );
    }

    return {
      codec: stream.codec_name,
      width: stream.width,
      height: stream.height,
      fps: numerator / denominator,
      bitrate: Number(stream.bit_rate),
      size: Number(safeData.format.size),
      duration: Number(safeData.format.duration) * 1000,
    };
  }
}
