import type { Results } from '../../src/types/benchmark.types';

export async function getResults(): Promise<Results> {
  const response = await fetch('/api/results');

  if (!response.ok) {
    throw new Error(`Failed to fetch results: ${response.status}`);
  }

  return response.json();
}
