// basically as described here: https://algorithmtutor.com/Data-Structures/Tree/Priority-Queues/

class HeapItem<T> {
    constructor(public priority: i32, public data: T) { }
}

function getLeftChildIndex(index: u32): u32 {
    return index * 2 + 1;
}

function getRightChildIndex(index: u32): u32 {
    return index * 2 + 2;
}

function getParentIndex(index: u32): u32 {
    return (index - 1) / 2;
}

export class PriorityQueue<T> {
    private heap: HeapItem<T>[] = [];
    private size: u32 = 0;

    enqueue(priority: i32, data: T): void {
        this.heap[this.size] = new HeapItem(priority, data);
        this.size += 1
        var i = this.size - 1;
        while (i !== 0) {
            var parentIndex = getParentIndex(i)
            var valueAtParentIndex = unchecked(this.heap[parentIndex]);
            var valueAtCurrentIndex = unchecked(this.heap[i]);
            if (valueAtParentIndex.priority <= valueAtCurrentIndex.priority) {
                break;
            }
            unchecked(this.heap[i] = valueAtParentIndex);
            unchecked(this.heap[parentIndex] = valueAtCurrentIndex);
            i = parentIndex;
        }
    }

    maxHeapify(index: i32): void {
        var leftIndex = getLeftChildIndex(index);
        var rightIndex = getRightChildIndex(index);
        var indexOfLargest = index;
        if (leftIndex <= this.size && unchecked(this.heap[leftIndex].priority < this.heap[indexOfLargest].priority)) {
            indexOfLargest = leftIndex;
        }
        if (rightIndex <= this.size && unchecked(this.heap[rightIndex].priority < this.heap[indexOfLargest].priority)) {
            indexOfLargest = rightIndex;
        }
        if (indexOfLargest !== index) {
            var indexValue = this.heap[index];
            unchecked(this.heap[index] = this.heap[indexOfLargest]);
            unchecked(this.heap[indexOfLargest] = indexValue);
            this.maxHeapify(indexOfLargest);
        }
    }

    peek(): T {
        return unchecked(this.heap[0].data);
    }

    dequeue(): T {
        var heapItem = unchecked(this.heap[0]);
        this.size -= 1;
        unchecked(this.heap[0] = this.heap[this.size]);
        this.maxHeapify(0);
        return heapItem.data
    }

    empty(): boolean {
        return this.size === 0;
    }
}