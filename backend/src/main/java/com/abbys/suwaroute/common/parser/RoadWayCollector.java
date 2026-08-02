package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.osm.OsmWay;
import lombok.Getter;
import org.openstreetmap.osmosis.core.container.v0_6.EntityContainer;
import org.openstreetmap.osmosis.core.domain.v0_6.Tag;
import org.openstreetmap.osmosis.core.domain.v0_6.Way;
import org.openstreetmap.osmosis.core.domain.v0_6.WayNode;
import org.openstreetmap.osmosis.core.task.v0_6.Sink;

import java.util.Map;
import java.util.Set;

@Getter
public class RoadWayCollector implements Sink {

    private static final Set<String> ROAD_TYPES = Set.of(
            "motorway",
            "trunk",
            "primary",
            "secondary",
            "tertiary",
            "unclassified",
            "residential",
            "service",
            "living_street"
    );

    private final RoadNetworkData data = new RoadNetworkData();

    @Override
    public void initialize(Map<String, Object> metaData) {
    }

    @Override
    public void process(EntityContainer entityContainer) {
        if (!(entityContainer.getEntity() instanceof Way way)) {
            return;
        }

        if (!isRoad(way)) {
            return;
        }

        OsmWay osmWay = new OsmWay(way.getId());

        for (WayNode node : way.getWayNodes()) {
            long nodeId = node.getNodeId();

            osmWay.addNode(nodeId);
            data.getRequiredNodeIds().add(nodeId);
        }

        for (Tag tag : way.getTags()) {

            switch (tag.getKey()) {

                case "highway" ->
                        osmWay.setHighwayType(tag.getValue());

                case "oneway" ->
                        osmWay.setOneWay("yes".equalsIgnoreCase(tag.getValue()));

            }
        }
        data.getRoadWays().add(osmWay);
    }

    @Override
    public void complete() {
        System.out.println("Road Ways        : " + data.getRoadWays().size());
        System.out.println("Required Nodes   : " + data.getRequiredNodeIds().size());
    }

    @Override
    public void close() {
    }

    private boolean isRoad(Way way) {
        for (Tag tag : way.getTags()) {
            if ("highway".equals(tag.getKey())) {
                return ROAD_TYPES.contains(tag.getValue());
            }
        }

        return false;
    }
}