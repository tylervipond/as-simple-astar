// basically as implemented here: https://www.redblobgames.com/pathfinding/a-star/introduction.html
import { PriorityQueue } from './priority-queue';

type Cost = u32;
type Coord = u32;

function getNeighborCoords(current: Coord, width: u32, grid: Coord[]): Coord[] {
    var isTop = current < width
    var isBottom = current >= (grid.length as u32 - width);
    var isLeft = current % width === 0;
    var isRight = current % width === width - 1;
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

function manhattan(current: Coord, target: Coord, width: u32): u32 {
    var currentX = current % width;
    var currentY = current / width;
    var targetX = target % width;
    var targetY = target / width;
    return Math.abs(currentX as i32 - targetX as i32) + Math.abs(currentY as i32 - targetY as i32) as u32
}

export function astar(start: Coord, end: Coord, grid: Coord[], width: u32): Coord[] {
    var frontier = new PriorityQueue<Coord>();
    var cameFrom = new Map<Coord, Coord>();
    var costSoFar = new Map<Coord, Cost>();
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
            var cost = costSoFar.get(current) + neighborCost + manhattan(current, neighbor, width);
            var neighborCostSoFar = costSoFar.has(neighbor) ? costSoFar.get(neighbor) : 0;
            if (neighborCostSoFar === 0 || cost < neighborCostSoFar) {
                costSoFar.set(neighbor, cost);
                var priority = cost + manhattan(end, neighbor, width);
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