package com.abbys.suwaroute;

import com.abbys.suwaroute.common.parser.GraphLoader;
import com.abbys.suwaroute.common.test.RoutingTester;
import com.abbys.suwaroute.model.graph.Graph;

import java.util.*;

public class TestDriver {

    public static void main(String[] args) {

        GraphLoader loader = new GraphLoader();

        Graph graph = loader.load("src/main/resources/graph/graph.ser");

        RoutingTester tester = new RoutingTester(graph);

        tester.runRandomTest(100);
    }
}