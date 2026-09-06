export function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}

export function formatSize(bytes: number): string {
  const mb = bytes / 1_000_000;

  return `${mb.toFixed(2)} MB`;
}

export function formatDuration(durationMs: number): string {
  return `${(durationMs / 1000).toFixed(2)} s`;
}

export function formatBitrate(bitrate?: number): string {
  if (bitrate === undefined || bitrate === null) {
    return 'N/A';
  }

  return `${(bitrate / 1000).toFixed(0)} kbps`;
}

export function formatFps(fps: number): string {
  return `${fps.toFixed(2)} fps`;
}

export function getFileName(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}
