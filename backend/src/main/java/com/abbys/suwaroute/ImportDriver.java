package com.abbys.suwaroute;

import com.abbys.suwaroute.common.parser.GraphSerializer;
import com.abbys.suwaroute.common.parser.OsmGraphBuilder;
import com.abbys.suwaroute.common.parser.OsmPbfReader;
import com.abbys.suwaroute.common.parser.RoadNetworkData;
import com.abbys.suwaroute.model.graph.Graph;
import com.abbys.suwaroute.model.osm.OsmData;

public class ImportDriver {
    public static void main(String[] args){
        String pbfFile = "src/main/resources/maps/map.pbf";
        String graphFile = "src/main/resources/graph/graph.ser";

        OsmPbfReader reader = new OsmPbfReader();

        RoadNetworkData data = reader.read(pbfFile);

        OsmGraphBuilder builder = new OsmGraphBuilder();

        Graph graph = builder.build(data);

        data.getRoadNodes().clear();
        data.getRoadWays().clear();
        data.getRequiredNodeIds().clear();

        System.gc();

        GraphSerializer serializer = new GraphSerializer();

        serializer.save(graph, graphFile);

        System.out.println("--------------------------------");
        System.out.println("Nodes : " + graph.getNodes().size());
        System.out.println("Adjacency Lists : " + graph.getAdjacencyList().size());
        System.out.println("--------------------------------");

    }
}
