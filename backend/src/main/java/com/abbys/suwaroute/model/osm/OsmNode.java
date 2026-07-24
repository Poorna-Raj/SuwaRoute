package com.abbys.suwaroute.model.osm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
public class OsmNode {
    private final long id;
    private final double latitude;
    private final double longitude;
}
