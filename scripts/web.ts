const api = Bun.spawn({
  cmd: ['bun', 'run', 'src/server.ts'],
  stdout: 'inherit',
  stderr: 'inherit',
});

const vite = Bun.spawn({
  cmd: ['bunx', 'vite', '--host', '0.0.0.0'],
  stdout: 'inherit',
  stderr: 'inherit',
});

console.log('Starting TranscodeBench...');

function stop(): void {
  api.kill();
  vite.kill();
}

process.once('SIGINT', stop);
process.once('SIGTERM', stop);

await vite.exited;
