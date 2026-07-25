package com.abbys.suwaroute;

import com.abbys.suwaroute.common.parser.GraphLoader;
import com.abbys.suwaroute.model.graph.Graph;

public class TestDriver {
    public static void main(String[] args){
        GraphLoader gl = new GraphLoader();
        Graph graph = gl.load("src/main/resources/graph/graph.ser");

        System.out.println(graph.getNodes().size());

        graph.getNodes().keySet()
                .stream()
                .limit(10)
                .forEach(System.out::println);
    }
}
