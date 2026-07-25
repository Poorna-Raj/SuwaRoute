package com.abbys.suwaroute.model.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GraphEdge {
    private long sourceNodeId;
    private long destinationNodeId;
    private double distanceMeters;
    private boolean oneWay;
}
