package com.abbys.suwaroute.model.routing;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QueueNode {
    private long nodeId;

    private double distance;
}