package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.graph.Graph;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;

public class GraphLoader {

    public Graph load(String filePath) {

        try (ObjectInputStream in =
                     new ObjectInputStream(new FileInputStream(filePath))) {

            return (Graph) in.readObject();

        } catch (IOException | ClassNotFoundException e) {

            throw new RuntimeException(e);

        }

    }

}