package com.abbys.suwaroute.model.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphNode {
    private String nodeId;
    private double latitude;
    private double longitude;
}
