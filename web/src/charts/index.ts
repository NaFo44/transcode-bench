import Chart from 'chart.js/auto';

import type { Result, Results } from '../../../src/types/benchmark.types';

import { requireElement } from '../utils';

type BarChartConfig = {
  selector: string;
  label: string;
  yAxisLabel: string;
  getValue: (result: Result) => number | null;
  formatTooltip: (value: number) => string;
};

type ScatterPoint = {
  x: number;
  y: number;
};

type ScatterChartConfig = {
  selector: string;
  xAxisLabel: string;
  yAxisLabel: string;
  getPoint: (result: Result) => ScatterPoint | null;
  formatTooltip: (result: Result) => string[];
};

const bytesToMegabytes = (bytes: number): number => bytes / 1_000_000;
const millisecondsToSeconds = (milliseconds: number): number =>
  milliseconds / 1000;

function renderBarChart(results: Results, config: BarChartConfig): void {
  const element = requireElement<HTMLCanvasElement>(config.selector);

  new Chart(element, {
    type: 'bar',
    data: {
      labels: results.result.map((result) => result.transcoding.name),
      datasets: [
        {
          label: config.label,
          data: results.result.map(config.getValue),
          backgroundColor: '#7c3aed',
          borderColor: '#6d28d9',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Benchmark',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: config.yAxisLabel,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed.y;

              return value === null
                ? `${config.label}: N/A`
                : config.formatTooltip(value);
            },
          },
        },
      },
      animation: false,
    },
  });
}

function renderScatterChart(
  results: Results,
  config: ScatterChartConfig,
): void {
  const element = requireElement<HTMLCanvasElement>(config.selector);
  const entries = results.result.flatMap((result) => {
    const point = config.getPoint(result);

    return point ? [{ point, result }] : [];
  });

  new Chart(element, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Benchmarks',
          data: entries.map(({ point }) => point),
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#7c3aed',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: config.xAxisLabel,
          },
        },
        y: {
          title: {
            display: true,
            text: config.yAxisLabel,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label(context) {
              const entry = entries[context.dataIndex];

              return entry ? config.formatTooltip(entry.result) : '';
            },
          },
        },
      },
      animation: false,
    },
  });
}

export function renderCharts(results: Results): void {
  renderScatterChart(results, {
    selector: '#chart-size-time',
    xAxisLabel: 'Output size (MB)',
    yAxisLabel: 'Encoding time (s)',
    getPoint: (result) => ({
      x: bytesToMegabytes(result.output.size),
      y: millisecondsToSeconds(result.performance.encodingTimeMs),
    }),
    formatTooltip: (result) => [
      result.transcoding.name,
      `Size: ${bytesToMegabytes(result.output.size).toFixed(2)} MB`,
      `Encoding time: ${millisecondsToSeconds(result.performance.encodingTimeMs).toFixed(2)} s`,
    ],
  });

  const hasVmaf = results.result.some((result) => result.quality !== undefined);

  if (hasVmaf) {
    renderScatterChart(results, {
      selector: '#chart-quality-size',
      xAxisLabel: 'Output size (MB)',
      yAxisLabel: 'VMAF',
      getPoint: (result) =>
        result.quality
          ? {
              x: bytesToMegabytes(result.output.size),
              y: result.quality.vmaf,
            }
          : null,
      formatTooltip: (result) => [
        result.transcoding.name,
        `Size: ${bytesToMegabytes(result.output.size).toFixed(2)} MB`,
        `VMAF: ${result.quality?.vmaf.toFixed(2) ?? 'N/A'}`,
      ],
    });

    renderScatterChart(results, {
      selector: '#chart-time-quality',
      xAxisLabel: 'Encoding time (s)',
      yAxisLabel: 'VMAF',
      getPoint: (result) =>
        result.quality
          ? {
              x: millisecondsToSeconds(result.performance.encodingTimeMs),
              y: result.quality.vmaf,
            }
          : null,
      formatTooltip: (result) => [
        result.transcoding.name,
        `Encoding time: ${millisecondsToSeconds(result.performance.encodingTimeMs).toFixed(2)} s`,
        `VMAF: ${result.quality?.vmaf.toFixed(2) ?? 'N/A'}`,
      ],
    });
  }

  renderBarChart(results, {
    selector: '#chart-speed',
    label: 'Encoding speed',
    yAxisLabel: 'Speed factor',
    getValue: (result) => result.performance.speedFactor,
    formatTooltip: (value) => `Speed: ${value.toFixed(2)}× realtime`,
  });

  renderBarChart(results, {
    selector: '#chart-size',
    label: 'Output size',
    yAxisLabel: 'Output size (MB)',
    getValue: (result) => bytesToMegabytes(result.output.size),
    formatTooltip: (value) => `Size: ${value.toFixed(2)} MB`,
  });

  renderBarChart(results, {
    selector: '#chart-bitrate',
    label: 'Bitrate',
    yAxisLabel: 'Bitrate (kbps)',
    getValue: (result) =>
      result.output.bitrate == null ? null : result.output.bitrate / 1000,
    formatTooltip: (value) => `Bitrate: ${value.toFixed(0)} kbps`,
  });
}
