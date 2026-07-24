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
    private String edgeId;
    private String sourceNodeId;
    private String destinationNodeId;
    private double distanceMeters;
    private boolean oneWay;
    private String roadName;
}
