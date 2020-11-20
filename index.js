import loader from '@assemblyscript/loader';
import fs from 'fs';

const filename = process.env.DEBUG ? './dist/as-simple-astar-debug.wasm' : './dist/as-simple-astar.wasm';
loader.instantiate(
    fs.promises.readFile(filename)
).then(({ exports }) => {
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
    const gridPtr = __retain(__newArray(GRID_TYPE_ID, grid))
    const pathPtr = astar(start, end, gridPtr, width);
    __release(gridPtr);
    const path = __getArray(pathPtr);
    __release(pathPtr);
    console.log(path)
})
