package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.osm.OsmData;
import crosby.binary.osmosis.OsmosisReader;

import java.io.File;

public class OsmPbfReader {

    public RoadNetworkData read(String filePath) {

        File file = new File(filePath);

        RoadWayCollector wayCollector = new RoadWayCollector();

        OsmosisReader pass1 = new OsmosisReader(file);
        pass1.setSink(wayCollector);
        pass1.run();

        RoadNetworkData data = wayCollector.getData();

        RoadNodeCollector nodeCollector = new RoadNodeCollector(data);

        OsmosisReader pass2 = new OsmosisReader(file);
        pass2.setSink(nodeCollector);
        pass2.run();

        return data;
    }

}
