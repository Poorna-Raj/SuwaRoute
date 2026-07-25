package com.abbys.suwaroute.common.parser;

import com.abbys.suwaroute.model.osm.OsmData;
import crosby.binary.osmosis.OsmosisReader;

import java.io.File;

public class OsmPbfReader {

    public OsmData read(String filePath) {

        File file = new File(filePath);

        if (!file.exists()) {
            throw new RuntimeException("PBF file not found: " + file.getAbsolutePath());
        }

        RoadNetworkSink sink = new RoadNetworkSink();

        OsmosisReader reader = new OsmosisReader(file);

        reader.setSink(sink);

        reader.run();

        return sink.getOsmData();
    }

}
