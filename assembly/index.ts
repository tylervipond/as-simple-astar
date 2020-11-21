// basically as implemented here: https://www.redblobgames.com/pathfinding/a-star/introduction.html
import { PriorityQueue } from './priority-queue';

type Cost = u32;
type Coord = u32;

const frontier = new PriorityQueue<Coord>();
const cameFrom = new Map<Coord, Coord>();
const costSoFar = new Map<Coord, Cost>();

function getNeighborCoords(current: Coord, width: u32, grid: Coord[]): Coord[] {
    var isTop = current < width
    var isBottom = current >= (grid.length as u32 - width);
    var x = current % width;
    var isLeft = x === 0;
    var isRight = x === width - 1;
    var neighbors: Coord[] = [];
    if (!isTop) {
        var topIndex = current - width;
        if (grid[topIndex]) {
            neighbors.push(topIndex)
        }
        if (!isLeft && grid[topIndex - 1]) {
            neighbors.push(topIndex - 1)
        }
        if (!isRight && grid[topIndex + 1]) {
            neighbors.push(topIndex + 1)
        }
    }
    if (!isLeft && grid[current - 1]) {
        neighbors.push(current - 1)
    }
    if (!isRight && grid[current + 1]) {
        neighbors.push(current + 1)
    }
    if (!isBottom) {
        var bottomIndex = current + width;
        if (grid[bottomIndex]) {
            neighbors.push(bottomIndex)
        }
        if (!isLeft && grid[bottomIndex - 1]) {
            neighbors.push(bottomIndex - 1)
        }
        if (!isRight && grid[bottomIndex + 1]) {
            neighbors.push(bottomIndex + 1)
        }
    }
    return neighbors;
}

@inline
function manhattan(x1: i32, y1: i32, x2: i32, y2: i32): u32 {
    return abs(x1 - x2) + abs(y1 - y2)
}

export function astar(start: Coord, end: Coord, grid: Coord[], width: u32): Coord[] {
    frontier.clear()
    cameFrom.clear()
    costSoFar.clear()
    costSoFar.set(start, 1);
    frontier.enqueue(1, start);
    while (!frontier.empty()) {
        var current = frontier.dequeue();
        if (current === end) {
            break;
        }
        var neighborCoords = getNeighborCoords(current, width, grid);
        for (let i = 0; i < neighborCoords.length; i++) {
            var neighbor = unchecked(neighborCoords[i]);
            var neighborCost = unchecked(grid[neighbor]);
            var currentX = current % width;
            var currentY = current / width;
            var neighborX = neighbor % width;
            var neighborY = neighbor / width;
            var cost = costSoFar.get(current) + neighborCost + manhattan(currentX, currentY, neighborX, neighborY);
            var neighborCostSoFar = costSoFar.has(neighbor) ? costSoFar.get(neighbor) : 0;
            if (neighborCostSoFar === 0 || cost < neighborCostSoFar) {
                costSoFar.set(neighbor, cost);
                var endX = end % width;
                var endY = end / width;
                var priority = cost + manhattan(endX, endY, neighborX, neighborY);
                frontier.enqueue(priority, neighbor)
                cameFrom.set(neighbor, current);
            }
        }
    }
    var last = end;
    var path: Coord[] = [];
    while (cameFrom.has(last)) {
        path.push(last);
        if (last === start) {
            break;
        }
        last = cameFrom.get(last);
    }
    return path.reverse();
}

export const GRID_TYPE_ID = idof<Coord[]>()