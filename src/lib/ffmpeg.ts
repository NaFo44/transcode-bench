import { spawn } from 'node:child_process';
import { stat } from 'node:fs/promises';
import type { ProcessInput, ProcessOutput } from '../types';

const spawnTranscodingProcess = ({
  inputPath,
  codec,
  crf,
  preset,
  outputPath,
}: ProcessInput): Promise<ProcessOutput> => {
  return new Promise((resolve, reject) => {
    const start = performance.now();

    const ffmpeg = spawn('ffmpeg', [
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

    ffmpeg.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    ffmpeg.on('error', (err) => {
      console.error(
        'Could not spawn FFmpeg process. Make sure FFmpeg is installed',
      );
      reject(err);
    });

    ffmpeg.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}`));
        return;
      }

      try {
        const durationMs = performance.now() - start;
        const outputStats = await stat(outputPath);
        const inputStats = await stat(inputPath);

        resolve({
          outputPath,
          durationMs,
          outputSize: outputStats.size,
          inputSize: inputStats.size,
        });
      } catch (err) {
        reject(err);
      }
    });
  });
};

export { spawnTranscodingProcess };
