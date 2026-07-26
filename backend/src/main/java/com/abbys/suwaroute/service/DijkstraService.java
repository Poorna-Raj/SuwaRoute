package com.abbys.suwaroute.service;

import com.abbys.suwaroute.model.graph.Graph;
import com.abbys.suwaroute.model.graph.GraphEdge;
import com.abbys.suwaroute.model.routing.QueueNode;
import com.abbys.suwaroute.model.routing.RouteResult;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@AllArgsConstructor
@Service
public class DijkstraService {
    private final Graph graph;

    public RouteResult shortestPath(long source, long destination){
        PriorityQueue<QueueNode> queue = new PriorityQueue<>();
        // TODO:: Implement the priority queue later

        Map<Long,Double> distance = new HashMap<>();
        Map<Long,Long> previous = new HashMap<>();
        Set<Long> visited = new HashSet<>();

        distance.put(source,0.0);
        queue.offer(new QueueNode(source,0.0));

        while(!queue.isEmpty()){
            QueueNode current = queue.poll();
            long currentNodeId = current.getNodeId();

            if(visited.contains(currentNodeId)){
                continue;
            }
            visited.add(currentNodeId);

            if(currentNodeId == destination){
                break;
            }

            List<GraphEdge> edges = graph.getAdjacencyList()
                    .getOrDefault(currentNodeId,Collections.emptyList());

            for(GraphEdge edge: edges){
                long neighbourId = edge.getDestinationNodeId();

                double newDistance = distance.get(currentNodeId)
                        + edge.getDistanceMeters();

                double oldDistance = distance.getOrDefault(
                        neighbourId,
                        Double.POSITIVE_INFINITY
                );

                if(newDistance < oldDistance){
                    distance.put(neighbourId,newDistance);
                    previous.put(neighbourId,currentNodeId);

                    queue.offer(
                            new QueueNode(
                                    neighbourId,
                                    newDistance
                            )
                    );
                }
            }
        }

        if(!distance.containsKey(destination)){
            return null;
        }

        List<Long> path = new ArrayList<>();

        long current = destination;

        while(current != source){
            path.add(current);
            current = previous.get(current);
        }

        path.add(source);
        Collections.reverse(path);

        return RouteResult.builder()
                .nodeIds(path)
                .totalDistance(distance.get(destination))
                .build();
    }
}
