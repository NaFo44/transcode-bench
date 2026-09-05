import { mkdir, writeFile, readFile } from 'node:fs/promises';

export interface ResultRepository {
  save(path: string, data: unknown): Promise<void>;
  load(path: string): Promise<unknown>;
}

export class JsonResultRepository implements ResultRepository {
  async save(path: string, data: unknown): Promise<void> {
    await mkdir('results', { recursive: true });
    await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');

    console.log('Results saved to results/result.json');
  }

  async load(path: string): Promise<string> {
    return readFile(path, 'utf-8');
  }
}
