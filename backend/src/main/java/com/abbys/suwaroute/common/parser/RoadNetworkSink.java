package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.osm.OsmData;
import com.abbys.suwaroute.model.osm.OsmNode;
import com.abbys.suwaroute.model.osm.OsmWay;
import lombok.Getter;
import org.openstreetmap.osmosis.core.container.v0_6.EntityContainer;
import org.openstreetmap.osmosis.core.domain.v0_6.Entity;
import org.openstreetmap.osmosis.core.domain.v0_6.Node;
import org.openstreetmap.osmosis.core.domain.v0_6.Tag;
import org.openstreetmap.osmosis.core.domain.v0_6.Way;
import org.openstreetmap.osmosis.core.domain.v0_6.WayNode;
import org.openstreetmap.osmosis.core.task.v0_6.Sink;

import java.util.Map;

@Getter
public class RoadNetworkSink implements Sink {

    private final OsmData osmData = new OsmData();

    private long nodeCount = 0;
    private long wayCount = 0;

    @Override
    public void initialize(Map<String, Object> metaData) {
        System.out.println("=================================");
        System.out.println("Starting OSM Import...");
        System.out.println("=================================");
    }

    @Override
    public void process(EntityContainer entityContainer) {

        Entity entity = entityContainer.getEntity();

        if (entity instanceof Node node) {
            processNode(node);
        }
        else if (entity instanceof Way way) {
            processWay(way);
        }
    }

    @Override
    public void complete() {

        System.out.println();
        System.out.println("=================================");
        System.out.println("Import Completed");
        System.out.println("=================================");
        System.out.println("Nodes Loaded : " + nodeCount);
        System.out.println("Road Ways    : " + wayCount);
        System.out.println("=================================");
    }

    @Override
    public void close() {
    }

    /**
     * Store every node.
     */
    private void processNode(Node node) {

        OsmNode osmNode = new OsmNode(
                node.getId(),
                node.getLatitude(),
                node.getLongitude()
        );

        osmData.addNode(osmNode);

        nodeCount++;

        if (nodeCount % 100000 == 0) {
            System.out.println("Nodes Loaded : " + nodeCount);
        }
    }

    /**
     * Store only drivable roads.
     */
    private void processWay(Way way) {

        if (!isRoad(way)) {
            return;
        }

        OsmWay osmWay = new OsmWay(way.getId());

        // Read tags
        for (Tag tag : way.getTags()) {

            switch (tag.getKey()) {

                case "highway":
                    osmWay.setHighwayType(tag.getValue());
                    break;

                case "oneway":
                    osmWay.setOneWay("yes".equalsIgnoreCase(tag.getValue()));
                    break;
            }
        }

        // Read node references
        for (WayNode wayNode : way.getWayNodes()) {
            osmWay.addNode(wayNode.getNodeId());
        }

        osmData.addWay(osmWay);

        wayCount++;

        if (wayCount % 10000 == 0) {
            System.out.println("Road Ways : " + wayCount);
        }
    }

    /**
     * Returns true if the way is a drivable road.
     */
    private boolean isRoad(Way way) {

        for (Tag tag : way.getTags()) {

            if (!"highway".equals(tag.getKey())) {
                continue;
            }

            String value = tag.getValue();

            return switch (value) {

                case "motorway",
                     "trunk",
                     "primary",
                     "secondary",
                     "tertiary",
                     "unclassified",
                     "residential",
                     "service",
                     "living_street" -> true;

                default -> false;
            };
        }

        return false;
    }
}