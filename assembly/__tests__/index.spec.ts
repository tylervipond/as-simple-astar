/**
 * These tests won't currently work, as-pect doesn't yet support 0.17 at this time
 */
import { astar } from '../index';

describe('index', () => {
    describe('astar', () => {
        it('should find a direct path from point a to point b', () => {
            var start = 0;
            var end = 24;
            var grid = [
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
            ];
            var width = 5;
            var expected = [0, 6, 12, 18, 24];
            var result = astar(start, end, grid, width);
            expect(result).toStrictEqual(expected);
        })
        it('should find a path around obstacles from point a to point b', () => {
            var start = 0;
            var end = 24;
            var grid = [
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
                1, 1, 0, 1, 1,
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
            ];
            var width = 5;
            var expected = [0, 6, 7, 13, 19, 24];
            var result = astar(start, end, grid, width);
            expect(result).toStrictEqual(expected);
        })
        it('should find an optimal path around obstacles from point a to point b', () => {
            var start = 0;
            var end = 24;
            var grid = [
                1, 1, 1, 1, 1,
                1, 0, 1, 0, 1,
                1, 0, 0, 0, 1,
                1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
            ];
            var width = 5;
            var expected = [0, 1, 2, 3, 9, 14, 19, 24];
            var result = astar(start, end, grid, width);
            expect(result).toStrictEqual(expected);
        })

        it('should find the easiest path from point a to point b', () => {
            var start = 0;
            var end = 24;
            var grid = [
                1, 1, 1, 1, 1,
                1, 2, 2, 3, 3,
                1, 2, 2, 2, 3,
                3, 3, 3, 3, 3,
                3, 3, 3, 3, 1,
            ];
            var width = 5;
            var expected = [0];
            var result = astar(start, end, grid, width);
            expect(result).toStrictEqual(expected);
        })
    })
});