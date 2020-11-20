/**
 * Seems like I should look into using a proper benchmarking lib for this.
 * One interesting thing here: the as version appears 3x faster than the pathfinding lib,
 * but only when run once, when run many times node optimizes the js version to be
 * quite a bit faster. will this still be the case if the grid and paths are varied?
 */
import loader from '@assemblyscript/loader';
import fs from 'fs';
import { performance } from 'perf_hooks';
import PF from 'pathfinding';

const COUNT = 1;

const getPathfindingPerf = () => {
    const matrix = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
    ];
    const grid = new PF.Grid(matrix);
    const finder = new PF.AStarFinder({
        allowDiagonal: true
    });
    let perfs = 0;
    for (let i = 0; i < COUNT; i++) {
        const t1 = performance.now();
        finder.findPath(0, 0, 6, 6, grid);
        const t2 = performance.now();
        perfs += (t2 - t1)
    }
    return perfs / COUNT;
}

const getAsSimpleAstarFromJSPerf = ({ exports }) => {
    const start = 0;
    const end = 48;
    const grid = [
        1, 1, 1, 1, 1, 1, 1,
        1, 0, 1, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
    ];
    const width = 7;
    const { __retain, __newArray, __release, __getArray, astar, GRID_TYPE_ID } = exports;
    const gridPtr = __retain(__newArray(GRID_TYPE_ID, grid));
    let perfs = 0;
    for (let i = 0; i < COUNT; i++) {
        const t1 = performance.now();
        const pathPtr = astar(start, end, gridPtr, width);
        __release(gridPtr);
        __getArray(pathPtr);
        __release(pathPtr);
        const t2 = performance.now();
        perfs += (t2 - t1)
    }
    return perfs / COUNT;
}

async function runPerfs() {
    const asPerfInstance = await loader.instantiate(
        fs.promises.readFile(process.env.DEBUG ? './dist/perf-debug.wasm' : './dist/perf.wasm'),
        {
            performance: {
                "performance.now"() {
                    return performance.now()
                },
            },
        });
    const asSimpleAstarInstance = await loader.instantiate(
        fs.promises.readFile(process.env.DEBUG ? '../dist/as-simple-astar-debug.wasm' : '../dist/as-simple-astar.wasm')
    );
    const { runPerf } = asPerfInstance.exports;
    console.log('as-simple-astar from as', runPerf(COUNT))
    console.log('as-simple-astar from js', getAsSimpleAstarFromJSPerf(asSimpleAstarInstance))
    console.log('pathfinding', getPathfindingPerf());
}
runPerfs();