package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.graph.Graph;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;

public class GraphLoader {

    public Graph load(String filePath) {

        long start = System.currentTimeMillis();

        try (ObjectInputStream in =
                     new ObjectInputStream(
                             new BufferedInputStream(
                                     new FileInputStream(filePath), 1 << 20 // 1MB buffer
                             )
                     )) {

            Graph graph = (Graph) in.readObject();

            long elapsed = System.currentTimeMillis() - start;
            System.out.println("GraphLoader: loaded in " + elapsed + " ms");

            return graph;

        } catch (IOException | ClassNotFoundException e) {
            throw new RuntimeException("Failed to load graph from " + filePath, e);
        }

    }

}