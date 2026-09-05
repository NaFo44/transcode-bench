import './style.css';

import { getResults } from './api';
import type {
  BenchmarkResult,
  BenchmarkResults,
} from '../../src/types/benchmark.types';

function formatDuration(durationMs: number): string {
  return `${(durationMs / 1000).toFixed(2)} s`;
}

function formatSize(sizeMb: number): string {
  return `${sizeMb.toFixed(2)} MB`;
}

const byteToMb = (sizeByte: number) => sizeByte / 1024 / 1024;

function getInputName(inputPath: string): string {
  return inputPath.split(/[\\/]/).pop() ?? inputPath;
}

function createResultRow(result: BenchmarkResult): HTMLTableRowElement {
  const row = document.createElement('tr');

  const values = [
    result.transcoding.name,
    result.transcoding.codec,
    String(result.transcoding.crf),
    result.transcoding.preset,
    formatSize(byteToMb(result.outputFile.size)),
    formatDuration(result.transcoding.durationMs),
    `${result.transcoding.reductionPercentage.toFixed(1)}%`,
  ];

  for (const value of values) {
    const cell = document.createElement('td');

    cell.textContent = value;

    row.appendChild(cell);
  }

  return row;
}

function renderResults(results: BenchmarkResults): void {
  const inputName = document.querySelector<HTMLElement>('#input-name');
  const inputSize = document.querySelector<HTMLElement>('#input-size');
  const table =
    document.querySelector<HTMLTableSectionElement>('#results-table');

  if (!inputName || !inputSize || !table) {
    throw new Error('UI elements not found');
  }

  inputName.textContent = getInputName(results.inputPath);
  inputSize.textContent = formatSize(results.inputSizeMb);

  table.replaceChildren();

  for (const result of results.results) {
    table.appendChild(createResultRow(result));
  }
}

async function main(): Promise<void> {
  try {
    const results = await getResults();

    renderResults(results);
  } catch (error) {
    console.error(error);

    const table =
      document.querySelector<HTMLTableSectionElement>('#results-table');

    if (table) {
      table.replaceChildren();

      const row = document.createElement('tr');
      const cell = document.createElement('td');

      cell.colSpan = 7;
      cell.className = 'loading';
      cell.textContent = 'Failed to load benchmark results.';

      row.appendChild(cell);
      table.appendChild(row);
    }
  }
}

main();
