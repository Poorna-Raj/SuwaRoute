package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.graph.Graph;
import com.abbys.suwaroute.model.graph.GraphEdge;
import com.abbys.suwaroute.model.graph.GraphNode;
import com.abbys.suwaroute.model.osm.OsmData;
import com.abbys.suwaroute.model.osm.OsmNode;
import com.abbys.suwaroute.model.osm.OsmWay;

import java.util.ArrayList;

public class OsmGraphBuilder {
    public Graph build(OsmData osmData){
        Graph graph = new Graph();

        osmData.getNodes().values().forEach(node ->{
            GraphNode graphNode = GraphNode.builder()
                    .nodeId(node.getId())
                    .latitude(node.getLatitude())
                    .longitude(node.getLongitude())
                    .build();
            graph.getNodes().put(graphNode.getNodeId(),graphNode);
        });

        for(OsmWay way: osmData.getWays()){
            buildEdges(graph,way,osmData);
        }

        return graph;
    }

    private void buildEdges(Graph graph,OsmWay way,OsmData data){
        var nodeIds = way.getNodeIds();

        for(int i=0; i<nodeIds.size()-1; i++){
            long fromId = nodeIds.get(i);
            long toId = nodeIds.get(i+1);

            OsmNode fromNode = data.getNodes().get(fromId);
            OsmNode toNode = data.getNodes().get(toId);

            if(fromNode == null || toNode == null){
                continue;
            }

            double distance = calculateDistance(fromNode,toNode);
            addEdge(graph,fromId,toId,distance);

            if(!way.isOneWay()){
                addEdge(graph,toId,fromId,distance);
            }
        }
    }

    private double calculateDistance(OsmNode fromNode, OsmNode toNode) {
        final double R = 6371000;

        double lat1 = Math.toRadians(fromNode.getLatitude());
        double lat2 = Math.toRadians(toNode.getLatitude());

        double dLat = lat2 - lat1;
        double dLon = Math.toRadians(
                toNode.getLongitude()- fromNode.getLongitude()
        );

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2)
                        + Math.cos(lat1)
                        * Math.cos(lat2)
                        * Math.sin(dLon / 2)
                        * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private void addEdge(Graph graph, long from, long to, double distance){
        GraphEdge edge = GraphEdge.builder()
                .sourceNodeId(from)
                .destinationNodeId(to)
                .distanceMeters(distance)
                .oneWay(false)
                .build();
        graph.getAdjacencyList()
                .computeIfAbsent(from, k -> new ArrayList<>())
                .add(edge);
    }
    
    
}
