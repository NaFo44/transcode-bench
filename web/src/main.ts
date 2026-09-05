import './style.css';

import { getResults } from './api';
import type { Results, Result } from '../../src/types/benchmark.types';

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

function createResultRow(result: Result): HTMLTableRowElement {
  const row = document.createElement('tr');

  const values = [
    result.transcoding.name,
    result.transcoding.codec,
    String(result.transcoding.crf),
    result.transcoding.preset,
    formatSize(byteToMb(result.output.size)),
    formatDuration(result.performance.encodingTimeMs),
    `${result.compression.reductionPercentage.toFixed(1)}%`,
  ];

  for (const value of values) {
    const cell = document.createElement('td');

    cell.textContent = value;

    row.appendChild(cell);
  }

  return row;
}

function renderResults(results: Results): void {
  const inputName = document.querySelector<HTMLElement>('#input-name');
  const inputSize = document.querySelector<HTMLElement>('#input-size');
  const table =
    document.querySelector<HTMLTableSectionElement>('#results-table');

  if (!inputName || !inputSize || !table) {
    throw new Error('UI elements not found');
  }

  inputName.textContent = getInputName(results.input.name);
  inputSize.textContent = formatSize(byteToMb(results.input.metadata.size));

  table.replaceChildren();

  for (const result of results.result) {
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
