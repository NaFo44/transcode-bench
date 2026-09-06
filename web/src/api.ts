import type { Results } from '../../src/types/benchmark.types';
import staticResults from '../../results/result.json';

export async function getResults(): Promise<Results> {
  if (import.meta.env.PROD) {
    return staticResults as Results;
  }
  
  const response = await fetch('/api/results');

  if (!response.ok) {
    throw new Error(`Failed to fetch results: ${response.status}`);
  }

  return response.json();
}
