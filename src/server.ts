import { readFile } from 'node:fs/promises';

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/api/results') {
      try {
        const results = await readFile('results/result.json', 'utf-8');

        return new Response(results, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch {
        return Response.json(
          { error: 'No benchmark results found.' },
          { status: 404 },
        );
      }
    }

    return new Response('Not Found', {
      status: 404,
    });
  },
});

console.log(`Server running at ${server.url}`);
