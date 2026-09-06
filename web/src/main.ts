import './style.css';

import type { Results } from '../../src/types/benchmark.types';

import { getResults } from './api';
import { renderCharts } from './charts';
import { renderInputSummary } from './components/input-summary';
import {
  renderResultsMessage,
  renderResultsTable,
} from './components/results-table';
import { renderStats } from './components/stats';
import { renderBestOverall } from './components/best-overall';

function setupTabs(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.tab-button');

  const panels = document.querySelectorAll<HTMLElement>('.tab-panel');

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;

      if (!target) {
        return;
      }

      for (const currentButton of buttons) {
        const isActive = currentButton === button;

        currentButton.classList.toggle('active', isActive);
      }

      for (const panel of panels) {
        const isActive = panel.dataset.panel === target;

        panel.hidden = !isActive;
      }
    });
  }
}

function renderDashboard(results: Results): void {
  const hasVmaf = results.result.some((result) => result.quality !== undefined);

  for (const button of document.querySelectorAll<HTMLButtonElement>(
    '[data-requires-vmaf]',
  )) {
    button.hidden = !hasVmaf;
  }

  renderInputSummary(results);
  renderResultsTable(results);
  renderStats(results);
  renderCharts(results);
  renderBestOverall(results);
}

async function main(): Promise<void> {
  setupTabs();

  let results: Results;

  try {
    results = await getResults();
  } catch (error) {
    console.error('Failed to load benchmark results:', error);
    renderResultsMessage('Failed to load benchmark results.');
    return;
  }

  try {
    renderDashboard(results);
  } catch (error) {
    console.error('Failed to render benchmark results:', error);
    renderResultsMessage('Failed to display benchmark results.');
  }
}

main();
