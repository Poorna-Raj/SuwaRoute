package com.abbys.suwaroute.common.test;

import com.abbys.suwaroute.model.graph.Graph;
import com.abbys.suwaroute.model.graph.GraphEdge;
import com.abbys.suwaroute.model.routing.RouteResult;
import com.abbys.suwaroute.service.DijkstraService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class RoutingTester {

    private final Graph graph;
    private final Random random = new Random();

    public RoutingTester(Graph graph) {
        this.graph = graph;
    }

    public void runRandomTest(int hops) {

        List<Long> nodes = new ArrayList<>(graph.getNodes().keySet());

        long source = nodes.get(random.nextInt(nodes.size()));

        long destination = walkRandom(source, hops);

        System.out.println("--------------------------------");
        System.out.println("Source      : " + source);
        System.out.println("Destination : " + destination);
        System.out.println("--------------------------------");

        DijkstraService service = new DijkstraService(graph);

        long startTime = System.currentTimeMillis();

        RouteResult result = service.shortestPath(source, destination);

        long endTime = System.currentTimeMillis();

        if (result == null) {

            System.out.println("No route found.");

            return;
        }

        System.out.println("Execution Time : " + (endTime - startTime) + " ms");
        System.out.println("Distance       : " + result.getTotalDistance() + " m");
        System.out.println("Path Nodes     : " + result.getNodeIds().size());

        System.out.println("\nRoute:");

        result.getNodeIds().forEach(System.out::println);
    }

    private long walkRandom(long start, int hops) {

        long current = start;

        for (int i = 0; i < hops; i++) {

            List<GraphEdge> edges =
                    graph.getAdjacencyList()
                            .getOrDefault(current, Collections.emptyList());

            if (edges.isEmpty()) {
                break;
            }

            GraphEdge edge =
                    edges.get(random.nextInt(edges.size()));

            current = edge.getDestinationNodeId();
        }

        return current;
    }
}