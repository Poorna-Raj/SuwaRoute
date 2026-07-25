package com.abbys.suwaroute.model.graph;

import lombok.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class Graph {
    private Map<Long,GraphNode> nodes;
    private Map<Long, List<GraphEdge>> adjacencyList;

    public Graph(){
        this.nodes = new HashMap<>();
        this.adjacencyList = new HashMap<>();
    }
}
