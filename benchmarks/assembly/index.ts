import { astar } from 'as-simple-astar';
import { performance } from './performance';

export function runPerf(coords: u32[], grid: u32[], width: u32): f64 {
    var perfs: f64 = 0.0;
    for (var i = 0; i < coords.length; i += 2) {
        var start = coords[i];
        var end = coords[i + 1];
        var t1 = performance.now();
        astar(start, end, grid, width)
        var t2 = performance.now();
        perfs += (t2 - t1);
    }
    var pairCount = coords.length / 2;
    return perfs / (pairCount)
}

export { GRID_TYPE_ID } from 'as-simple-astar';
