import type { BenchmarkResults } from '../../src/types';

export async function getResults(): Promise<BenchmarkResults> {
  const response = await fetch('/api/results');

  if (!response.ok) {
    throw new Error(`Failed to fetch results: ${response.status}`);
  }

  return response.json();
}
