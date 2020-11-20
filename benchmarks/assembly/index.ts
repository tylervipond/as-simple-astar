import { astar } from 'as-simple-astar';
import { performance } from './performance';
export function runPerf(count: i32): f64 {
    var start = 0;
    var end = 48;
    var grid: u32[] = [
        1, 1, 1, 1, 1, 1, 1,
        1, 0, 1, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
    ];
    var width = 7;
    var perfs: f64 = 0.0;
    for (var i = 0; i < count; i ++) {
        var t1 = performance.now();
        astar(start, end, grid, width)
        var t2 = performance.now();
        perfs += (t2 - t1);
    }
    return perfs/count
}
