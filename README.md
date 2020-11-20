# as-simple-astar

This simple A* implementation is meant to be used in the context of a larger AssemblyScript project, or from JS. It finds the shortest path from the start index to the end in a row-major 1-dimensional array where the value of each index represents the difficulty of the terrain. Given that the array is 1d, a width must a supplied as well. A value of 0 at an index indicates that the tile is impassable. Diagonal movements are permitted.

### API
`astar(start: u32, end: u32, grid: u32[], width: u32)` - the primary function, takes a start index, an end index, an array of tiles, and a row-width

`GRID_TYPE_ID` - The id for the grid type, useful when using the lib from JS

### Example of usage in AssemblyScript
```ts
import { astar } from 'as-simple-astar';

function someFunction(): u32[] {
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
    return astar(start, end, grid, width)
}

```

### Running tests
Tests do not currently work. 

### Benchmarks
A subproject is provided that runs a benchmark comparing this lib in AssemblyScript, JavaScript, and to the popular JS `pathfinding` lib. 
- `cd ./benchmarks`
- `npm i`
- `npm run build`
- `npm run start`