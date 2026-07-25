package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.graph.Graph;
import com.abbys.suwaroute.model.graph.GraphEdge;
import com.abbys.suwaroute.model.osm.OsmNode;
import com.abbys.suwaroute.model.osm.OsmWay;

import java.util.ArrayList;
import java.util.List;

public class OsmGraphBuilder {

    public Graph build(RoadNetworkData data) {

        Graph graph = new Graph();

        graph.getNodes().putAll(data.getRoadNodes());

        for (OsmWay way : data.getRoadWays()) {

            List<Long> nodeIds = way.getNodeIds();

            for (int i = 0; i < nodeIds.size() - 1; i++) {

                long fromId = nodeIds.get(i);
                long toId = nodeIds.get(i + 1);

                OsmNode fromNode = data.getRoadNodes().get(fromId);
                OsmNode toNode = data.getRoadNodes().get(toId);

                if (fromNode == null || toNode == null)
                    continue;

                double distance = calculateDistance(fromNode, toNode);

                addEdge(graph, fromId, toId, distance, way.isOneWay());

                if (!way.isOneWay()) {

                    addEdge(graph, toId, fromId, distance, false);

                }

            }

        }

        return graph;

    }

    private void addEdge(Graph graph,
                         long from,
                         long to,
                         double distance,
                         boolean oneWay) {

        GraphEdge edge = GraphEdge.builder()
                .sourceNodeId(from)
                .destinationNodeId(to)
                .distanceMeters(distance)
                .oneWay(oneWay)
                .build();

        graph.getAdjacencyList()
                .computeIfAbsent(from, k -> new ArrayList<>())
                .add(edge);

    }

    private double calculateDistance(OsmNode from, OsmNode to) {

        final double R = 6371000;

        double lat1 = Math.toRadians(from.getLatitude());
        double lat2 = Math.toRadians(to.getLatitude());

        double dLat = lat2 - lat1;
        double dLon = Math.toRadians(to.getLongitude() - from.getLongitude());

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2)
                        + Math.cos(lat1)
                        * Math.cos(lat2)
                        * Math.sin(dLon / 2)
                        * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

}