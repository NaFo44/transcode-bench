import type { Result, Results } from '../../../src/types/benchmark.types';

import {
  formatBitrate,
  formatDuration,
  formatSize,
  requireElement,
} from '../utils';

function createCell(value: string): HTMLTableCellElement {
  const cell = document.createElement('td');

  cell.textContent = value;

  return cell;
}

function createResultRow(result: Result): HTMLTableRowElement {
  const row = document.createElement('tr');

  const values = [
    result.transcoding.name,
    result.transcoding.codec,
    String(result.transcoding.crf),
    result.transcoding.preset,
    formatSize(result.output.size),
    result.quality ? result.quality.vmaf.toFixed(2) : 'N/A',
    formatDuration(result.performance.encodingTimeMs),
    `${result.performance.speedFactor.toFixed(2)}x`,
    `${result.compression.reductionPercentage.toFixed(1)}%`,
    formatBitrate(result.output.bitrate),
  ];

  row.append(...values.map(createCell));

  return row;
}

function createMessageRow(message: string): HTMLTableRowElement {
  const row = document.createElement('tr');
  const cell = createCell(message);

  cell.colSpan = 10;
  row.appendChild(cell);

  return row;
}

export function renderResultsMessage(message: string): void {
  const table = requireElement<HTMLTableSectionElement>('#results-table');

  table.replaceChildren(createMessageRow(message));
}

export function renderResultsTable(results: Results): void {
  const table = requireElement<HTMLTableSectionElement>('#results-table');

  if (results.result.length === 0) {
    table.replaceChildren(createMessageRow('No benchmark results.'));
    return;
  }

  table.replaceChildren(...results.result.map(createResultRow));
}
