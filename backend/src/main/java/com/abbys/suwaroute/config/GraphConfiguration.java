package com.abbys.suwaroute.config;

import com.abbys.suwaroute.common.parser.GraphLoader;
import com.abbys.suwaroute.model.graph.Graph;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphConfiguration {
    @Bean
    public Graph graph(){
        GraphLoader loader = new GraphLoader();
        return loader.load("src/main/resources/graph/graph.ser");
    }
}
