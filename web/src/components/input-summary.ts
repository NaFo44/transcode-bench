import type { Results } from '../../../src/types/benchmark.types';

import {
  formatDuration,
  formatFps,
  formatSize,
  getFileName,
  requireElement,
} from '../utils';

export function renderInputSummary(results: Results): void {
  const inputFile = requireElement<HTMLElement>('#input-file');
  const inputResolution = requireElement<HTMLElement>('#input-resolution');
  const inputCodec = requireElement<HTMLElement>('#input-codec');
  const inputFps = requireElement<HTMLElement>('#input-fps');
  const inputSize = requireElement<HTMLElement>('#input-size');
  const inputDuration = requireElement<HTMLElement>('#input-duration');

  const { name, metadata } = results.input;

  inputFile.textContent = getFileName(name);

  inputResolution.textContent = `${metadata.width} × ${metadata.height}`;

  inputCodec.textContent = metadata.codec.toUpperCase();

  inputFps.textContent = formatFps(metadata.fps);

  inputSize.textContent = formatSize(metadata.size);

  inputDuration.textContent = formatDuration(metadata.duration);
}
