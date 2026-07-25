package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.osm.OsmNode;
import com.abbys.suwaroute.model.osm.OsmWay;

import java.util.*;

public class RoadNetworkData {

    private final Map<Long, OsmNode> roadNodes = new HashMap<>();

    private final List<OsmWay> roadWays = new ArrayList<>();

    private final Set<Long> requiredNodeIds = new HashSet<>();

    public Map<Long, OsmNode> getRoadNodes() {
        return roadNodes;
    }

    public List<OsmWay> getRoadWays() {
        return roadWays;
    }

    public Set<Long> getRequiredNodeIds() {
        return requiredNodeIds;
    }

}