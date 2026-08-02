package com.abbys.suwaroute.model.graph;

import lombok.*;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphEdge implements Serializable {
    private long sourceNodeId;
    private long destinationNodeId;
    private double distanceMeters;
    private boolean oneWay;
}