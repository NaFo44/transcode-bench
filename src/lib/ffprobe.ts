import { spawn } from 'node:child_process';
import type { ExtractorInput, OutputFileMetadata } from '../types';
import { ffprobeSchema } from '../schemas';

const extractMediaMetadata = ({
  inputPath,
}: ExtractorInput): Promise<OutputFileMetadata> => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=codec_name,width,height,r_frame_rate,bit_rate',
      '-show_entries',
      'format=size',
      '-of',
      'json',
      inputPath,
    ]);

    let output = '';
    let errorOutput = '';

    ffprobe.stdout.on('data', (data) => {
      output += data;
    });

    ffprobe.stderr.on('data', (data) => {
      errorOutput += data;
    });

    ffprobe.on('error', (error) => {
      reject(error);
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`FFprobe exited with code ${code}: ${errorOutput}`));
        return;
      }

      try {
        const rawData = JSON.parse(output);
        const data = ffprobeSchema.parse(rawData);

        const stream = data.streams[0];
        const format = data.format;

        if (!stream) {
          reject(new Error('FFprobe did not return a video stream'));
          return;
        }

        const [numerator, denominator] = stream.r_frame_rate
          .split('/')
          .map(Number);

        if (
          numerator === undefined ||
          denominator === undefined ||
          denominator === 0 ||
          Number.isNaN(numerator) ||
          Number.isNaN(denominator)
        ) {
          reject(
            new Error(
              `Invalid frame rate returned by FFprobe: ${stream.r_frame_rate}`,
            ),
          );
          return;
        }

        resolve({
          codec: stream.codec_name,
          width: stream.width,
          height: stream.height,
          fps: numerator / denominator,
          bitrate: Number(stream.bit_rate),
          size: Number(format.size),
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

export { extractMediaMetadata };
