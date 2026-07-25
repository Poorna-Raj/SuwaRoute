package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.osm.OsmNode;
import org.openstreetmap.osmosis.core.container.v0_6.EntityContainer;
import org.openstreetmap.osmosis.core.domain.v0_6.Node;
import org.openstreetmap.osmosis.core.task.v0_6.Sink;

import java.util.Map;

public class RoadNodeCollector implements Sink {

    private final RoadNetworkData data;

    public RoadNodeCollector(RoadNetworkData data) {
        this.data = data;
    }

    @Override
    public void initialize(Map<String, Object> metaData) {
    }

    @Override
    public void process(EntityContainer entityContainer) {

        if (!(entityContainer.getEntity() instanceof Node node))
            return;

        if (!data.getRequiredNodeIds().contains(node.getId()))
            return;

        OsmNode osmNode = OsmNode.builder()
                .id(node.getId())
                .latitude(node.getLatitude())
                .longitude(node.getLongitude())
                .build();

        data.getRoadNodes().put(node.getId(), osmNode);

    }

    @Override
    public void complete() {

        System.out.println("--------------------------------");
        System.out.println("Road Nodes : " + data.getRoadNodes().size());
        System.out.println("--------------------------------");

    }

    @Override
    public void close() {
    }
}