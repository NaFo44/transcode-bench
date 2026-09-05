import { describe, expect, test } from 'bun:test';
import { BenchmarkFormatterImpl } from '../src/service/benchmark.service';

describe('BenchmarkService', () => {
    const formatter = new BenchmarkFormatterImpl();

    test('calculates reduction percentage', () => {
        expect(formatter.reductionPercent(0.75)).toBe(25);
    })

    test('calculates reduction with floating point values', () => {
        expect(formatter.reductionPercent(0.8507189481))
            .toBeCloseTo(14.9281, 4)
    })
});