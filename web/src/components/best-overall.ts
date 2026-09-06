import type {
    Result,
    Results,
} from '../../../src/types/benchmark.types'
import {
  formatDuration,
  formatSize,
  requireElement,
} from '../utils';

type ScoredResult = {
    result: Result;
    score: number;
    qualityScore: number;
    sizeScore: number;
    speedScore: number;
};

const WEIGHTS = {
    quality: 0.5,
    size: 0.3,
    speed: 0.2
} as const;

function normalize(value: number, minimum: number, maximum: number): number {
    if (minimum === maximum) {
        return 1;
    }

    return (value - minimum) / (maximum - minimum);
}

export function findBestOverall(results: Results): ScoredResult | null {
    const candidates = results.result.flatMap((result) => 
        result.quality
            ? [
                {
                    result,
                    vmaf: result.quality.vmaf
                }
            ]
        : []
    )

    if (candidates.length === 0) {
        return null;
    }

    const qualities = candidates.map(({ vmaf }) => vmaf);
    const sizes = candidates.map(({ result }) => result.output.size)
    const encodingTimes = candidates.map(
        ({ result }) => result.performance.encodingTimeMs
    )

    const minimumQuality = Math.min(...qualities);
    const maximumQuality = Math.max(...qualities)
    const minimumSize = Math.min(...sizes)
    const maximumSize = Math.max(...sizes);
    const minimumTime = Math.min(...encodingTimes);
    const maximumTime = Math.max(...encodingTimes)

    const ranking = candidates.map(({ result, vmaf }): ScoredResult => {
        const qualityScore = normalize(
            vmaf,
            minimumQuality,
            maximumQuality,
        )

        const sizeScore = 1 - normalize(result.output.size, minimumSize, maximumSize);

        const speedScore = 1 - normalize(result.performance.encodingTimeMs, minimumTime, maximumTime)

        const score = qualityScore * WEIGHTS.quality + sizeScore * WEIGHTS.size + speedScore * WEIGHTS.speed;

        return {
            result,
            score,
            qualityScore,
            sizeScore,
            speedScore,
        }
    })

    ranking.sort(
        (left, right) =>
            right.score - left.score ||
            right.qualityScore - left.qualityScore ||
            right.sizeScore - left.sizeScore
    )

    return ranking [0] ?? null
}

export function renderBestOverall(results: Results): void {
  const name = requireElement<HTMLElement>('#overall-name');
  const score = requireElement<HTMLElement>('#overall-score');
  const details = requireElement<HTMLElement>('#overall-details');

  const best = findBestOverall(results);

  if (!best) {
    name.textContent = 'N/A';
    score.textContent = '';
    details.textContent = 'VMAF measurements are required.';
    return;
  }

  const { result } = best;

  name.textContent = result.transcoding.name;
  score.textContent = `Overall score: ${(best.score * 100).toFixed(1)}/100`;

  details.textContent = [
    `${result.quality?.vmaf.toFixed(2)} VMAF`,
    formatSize(result.output.size),
    formatDuration(result.performance.encodingTimeMs),
  ].join(' · ');
}