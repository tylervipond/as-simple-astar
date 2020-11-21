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

const getRandomCoords = (grid, count) => {
    const validCoords = grid.reduce((acc, cost, index) => cost ? [...acc, index] : acc, []);
    const chosenCoords = [];
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < 2; j++) {
            const index = Math.floor(Math.random() * validCoords.length);
            chosenCoords.push(validCoords[index]);
        }
    }
    return chosenCoords;
}


const oneDimensionToTwoDimension = (grid, width) => {
    const rowCount = grid.length / width;
    const formattedGrid = [];
    for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            row.push(grid[i * width + j])
        }
        formattedGrid.push(row);
    }
    return formattedGrid;
}

const getPathfindingPerf = (coords, grid, width) => {
    const formattedGrid = oneDimensionToTwoDimension(grid, width);
    const pfGrid = new PF.Grid(formattedGrid);
    const finder = new PF.AStarFinder({
        allowDiagonal: true
    });
    let perfs = 0;
    for (let i = 0; i < coords.length; i += 2) {
        var startX = coords[i] % width;
        var startY = parseInt(coords[i] / width, 10);
        var endX = coords[i + 1] % width;
        var endY = parseInt(coords[i + 1] / width, 10);
        const t1 = performance.now();
        finder.findPath(startX, startY, endX, endY, pfGrid);
        const t2 = performance.now();
        perfs += (t2 - t1)
    }
    return perfs / (coords.length/2);
}

const getAsSimpleAstarFromJSPerf = async (coords, grid, width) => {
    const { exports } = await loader.instantiate(
        fs.promises.readFile(process.env.DEBUG ? '../dist/as-simple-astar-debug.wasm' : '../dist/as-simple-astar.wasm')
    );
    const { __retain, __newArray, __release, __getArray, astar, GRID_TYPE_ID } = exports;
    const gridPtr = __retain(__newArray(GRID_TYPE_ID, grid));
    let perfs = 0;
    for (let i = 0; i < coords.length; i += 2) {
        const t1 = performance.now();
        const pathPtr = astar(coords[i], coords[i + 1], gridPtr, width);
        __getArray(pathPtr);
        __release(pathPtr);
        const t2 = performance.now();
        perfs += (t2 - t1)
    }
    __release(gridPtr);
    return perfs / (coords.length/2);
}

const getAsSimpleAstarFromWASMPerf = async (coords, grid, width) => {
    const { exports } = await loader.instantiate(
        fs.promises.readFile(process.env.DEBUG ? './dist/perf-debug.wasm' : './dist/perf.wasm'),
        {
            performance: {
                "performance.now"() {
                    return performance.now()
                },
            },
        });
    const { __retain, __newArray, __release, runPerf, GRID_TYPE_ID } = exports;
    const gridPtr = __retain(__newArray(GRID_TYPE_ID, grid));
    const coordsPtr = __retain(__newArray(GRID_TYPE_ID, coords));
    const perf = runPerf(coordsPtr, gridPtr, width);
    __release(coordsPtr);
    __release(gridPtr);
    return perf;
}

async function runPerfs() {
    const count = 1

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

    const coords = getRandomCoords(grid, count);
    console.log('as-simple-astar from as', await getAsSimpleAstarFromWASMPerf(coords, grid, width));
    console.log('as-simple-astar from js', await getAsSimpleAstarFromJSPerf(coords, grid, width));
    console.log('pathfinding', getPathfindingPerf(coords, grid, width));
}
runPerfs();