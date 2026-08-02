package com.abbys.suwaroute.model.routing;

import java.util.ArrayList;
import java.util.List;

public class MinHeap {

    private final List<QueueNode> heap = new ArrayList<>();

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    public int size() {
        return heap.size();
    }

    public QueueNode peek() {
        if (heap.isEmpty()) {
            return null;
        }

        return heap.get(0);
    }

    public void insert(QueueNode node) {

        heap.add(node);

        heapifyUp(heap.size() - 1);
    }

    public QueueNode extractMin() {

        if (heap.isEmpty()) {
            return null;
        }

        QueueNode min = heap.get(0);

        QueueNode last = heap.remove(heap.size() - 1);

        if (!heap.isEmpty()) {

            heap.set(0, last);

            heapifyDown(0);
        }

        return min;
    }

    private void heapifyUp(int index) {

        while (index > 0) {

            int parent = (index - 1) / 2;

            if (heap.get(index).getDistance()
                    >= heap.get(parent).getDistance()) {
                break;
            }

            swap(index, parent);

            index = parent;
        }
    }

    private void heapifyDown(int index) {

        while (true) {

            int left = index * 2 + 1;
            int right = index * 2 + 2;

            int smallest = index;

            if (left < heap.size()
                    && heap.get(left).getDistance()
                    < heap.get(smallest).getDistance()) {

                smallest = left;
            }

            if (right < heap.size()
                    && heap.get(right).getDistance()
                    < heap.get(smallest).getDistance()) {

                smallest = right;
            }

            if (smallest == index) {
                break;
            }

            swap(index, smallest);

            index = smallest;
        }
    }

    private void swap(int i, int j) {

        QueueNode temp = heap.get(i);

        heap.set(i, heap.get(j));

        heap.set(j, temp);
    }
}