package com.abbys.suwaroute.model.routing;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QueueNode implements Comparable<QueueNode> {
    private long nodeId;
    private double distance;

    @Override
    public int compareTo(QueueNode o) {
        return Double.compare(this.distance,o.distance);
    }
}
