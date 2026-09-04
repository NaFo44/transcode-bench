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

export const ffprobeSchema = z.object({
  streams: z
    .array(
      z.object({
        codec_name: z.string(),
        width: z.number(),
        height: z.number(),
        r_frame_rate: z.string(),
        bit_rate: z.string().optional(),
      }),
    )
    .min(1),

  format: z.object({
    size: z.string(),
  }),
});
