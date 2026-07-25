package com.abbys.suwaroute.model.graph;

import com.abbys.suwaroute.model.osm.OsmNode;
import lombok.*;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class Graph implements Serializable {

    private final Map<Long, OsmNode> nodes = new HashMap<>();

    private final Map<Long, List<GraphEdge>> adjacencyList = new HashMap<>();

}
