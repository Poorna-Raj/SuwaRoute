package com.abbys.suwaroute.model.osm;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class OsmWay {

    private final long id;
    private final List<Long> nodeIds = new ArrayList<>();

    private boolean oneWay;
    private String highwayType;

    public OsmWay(long id) {
        this.id = id;
    }

    public void addNode(long nodeId) {
        nodeIds.add(nodeId);
    }

}