import { z } from 'zod';

const presetSchema = z.enum(['veryslow', 'slow', 'medium', 'fast', 'veryfast']);

export const benchmarkConfigSchema = z.object({
  name: z.string().min(1),
  codec: z.string().min(1),
  crf: z.number().min(0),
  preset: presetSchema,
});

export const configSchema = z.object({
  benchmarks: z.array(benchmarkConfigSchema).min(1),
});
