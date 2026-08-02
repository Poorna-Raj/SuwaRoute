package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.graph.Graph;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;

public class GraphSerializer {

    public void save(Graph graph, String filePath) {

        try (ObjectOutputStream out =
                     new ObjectOutputStream(new FileOutputStream(filePath))) {

            out.writeObject(graph);

            System.out.println("Graph saved successfully.");

        } catch (IOException e) {

            throw new RuntimeException(e);

        }

    }

}