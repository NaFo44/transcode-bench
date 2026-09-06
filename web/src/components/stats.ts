import type { Results } from '../../../src/types/benchmark.types';

import { formatSize, requireElement } from '../utils';

export function renderStats(results: Results): void {
  const benchmarkCount = requireElement<HTMLElement>('#benchmark-count');
  const bestQuality = requireElement<HTMLElement>('#best-quality');
  const smallestOutput = requireElement<HTMLElement>('#smallest-output');
  const fastest = requireElement<HTMLElement>('#fastest');

  if (results.result.length === 0) {
    benchmarkCount.textContent = '0';
    bestQuality.textContent = 'N/A';
    smallestOutput.textContent = 'N/A';
    fastest.textContent = 'N/A';

    return;
  }

  const bestQualityResult = results.result.reduce((best, current) =>
    (current.quality?.vmaf ?? -Infinity) > (best.quality?.vmaf ?? -Infinity)
      ? current
      : best,
  );

  const smallestResult = results.result.reduce((best, current) =>
    current.output.size < best.output.size ? current : best,
  );

  const fastestResult = results.result.reduce((best, current) =>
    current.performance.encodingTimeMs < best.performance.encodingTimeMs
      ? current
      : best,
  );

  benchmarkCount.textContent = String(results.result.length);

  bestQuality.textContent = bestQualityResult.quality
    ? `${bestQualityResult.quality.vmaf.toFixed(2)} VMAF`
    : 'N/A';

  smallestOutput.textContent = formatSize(smallestResult.output.size);

  fastest.textContent = fastestResult.transcoding.name;
}
