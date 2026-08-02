package com.abbys.suwaroute.model.osm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
public class OsmNode implements Serializable {

    private final long id;
    private final double latitude;
    private final double longitude;

}