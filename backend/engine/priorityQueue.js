export default class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    enqueue(task) {
        this.heap.push(task);
        this.bubbleUp();
    }

    dequeue() {
        if (this.isEmpty()) return null;

        const max = this.heap[0];
        const end = this.heap.pop();

        if (!this.isEmpty()) {
            this.heap[0] = end;
            this.bubbleDown();
        }

        return max;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        const element = this.heap[index];

        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];

            if (this.compare(element, parent) <= 0) break;

            this.heap[parentIndex] = element;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }

    bubbleDown() {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[0];

        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let swap = null;

            if (left < length) {
                if (this.compare(this.heap[left], element) > 0) {
                    swap = left;
                }
            }

            if (right < length) {
                if (
                    (swap == null &&
                        this.compare(this.heap[right], element) > 0) ||
                    (swap !== null &&
                        this.compare(this.heap[right], this.heap[left]) > 0)
                ) {
                    swap = right;
                }
            }

            if (swap == null) break;

            this.heap[index] = this.heap[swap];
            this.heap[swap] = element;
            index = swap;
        }


    }

    compare(a, b) {
        if (a.priority === b.priority) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return a.priority - b.priority;
    }
}