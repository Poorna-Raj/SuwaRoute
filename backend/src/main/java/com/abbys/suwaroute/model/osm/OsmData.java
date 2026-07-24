package com.abbys.suwaroute.model.osm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@Builder
public class OsmData {
    private final Map<Long,OsmNode> nodes = new HashMap<>();
    private final List<OsmWay> ways = new ArrayList<>();

    public void addNode(OsmNode node){
        nodes.put(node.getId(), node);
    }

    public void addWay(OsmWay way){
        ways.add(way);
    }
}
