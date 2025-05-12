/** @format */

import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, IconLayer, LineLayer } from "@deck.gl/layers";
import Map from "react-map-gl/maplibre";

const MAP_STYLES = {
  positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  satellite: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

function App() {
  const [uploadedData, setUploadedData] = useState(null);
  const [basemap, setBasemap] = useState(MAP_STYLES.positron);

  const municipiosData = require("./data/municipios.geojson");
  // const pontosData = require('./data/pontos_de_interesse.geojson');
  const pontosData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          icon: "https://cdn-icons-png.flaticon.com/128/164/164403.png",
        },
        geometry: {
          coordinates: [-46.39179622837122, -23.9478225466285],
          type: "Point",
        },
        id: 0,
      },
      {
        type: "Feature",
        properties: {
          icon: "https://cdn-icons-png.flaticon.com/128/164/164363.png",
        },
        geometry: {
          coordinates: [-46.57020592055778, -23.690434117386857],
          type: "Point",
        },
        id: 1,
      },
      {
        type: "Feature",
        properties: {
          icon: "https://cdn-icons-png.flaticon.com/128/233/233992.png",
        },
        geometry: {
          coordinates: [-46.539400162248654, -23.594485788093706],
          type: "Point",
        },
        id: 2,
      },
    ],
  };

  const toggleBasemap = () => {
    setBasemap((prev) =>
      prev === MAP_STYLES.positron ? MAP_STYLES.satellite : MAP_STYLES.positron
    );
  };

  const layers = [
    new IconLayer({
      id: "pontos-interesse",
      data: pontosData.features,
      pickable: true,
      getIcon: (d) => ({
        url: d.properties.icon,
        width: 128,
        height: 128,
        anchorY: 128,
      }),
      getPosition: (d) => d.geometry.coordinates,
      getSize: 6,
      sizeScale: 15,
      loadOptions: {
        fetch: window.fetch,
      },
    }),

    new GeoJsonLayer({
      id: "municipios",
      data: municipiosData,
      filled: true,
      stroked: true,
      getFillColor: [200, 200, 200, 100],
      getLineColor: [0, 0, 0],
      lineWidthMinPixels: 2,
    }),

    pontosData?.features?.length > 1
      ? new LineLayer({
          id: "linhas",
          data: pontosData.features.slice(1),
          getSourcePosition: (d) => d.geometry.coordinates,
          getTargetPosition: (d) => pontosData.features[0].geometry.coordinates,
          getColor: [255, 0, 0],
          getWidth: 2,
        })
      : null,

    ...(uploadedData
      ? [
          new GeoJsonLayer({
            id: "uploaded-data",
            data: uploadedData,
            filled: true,
            stroked: true,
            getFillColor: [0, 140, 255, 100],
            getLineColor: [0, 0, 255],
          }),
        ]
      : []),
  ].filter(Boolean);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setUploadedData(data);
        } catch (error) {
          alert("Arquivo GeoJSON inválido!");
        }
      };
      reader.readAsText(file);
    }
  };

  console.log(pontosData.features);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <DeckGL
        initialViewState={{
          longitude: -46.5,
          latitude: -23.6,
          zoom: 9,
        }}
        controller={true}
        layers={layers}
      >
        <Map mapStyle={basemap} />
      </DeckGL>

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <button onClick={toggleBasemap}>Alternar Basemap</button>
        <input
          type="file"
          accept=".geojson,.json"
          onChange={handleFileUpload}
          style={{ display: "block", marginTop: "10px" }}
        />
      </div>
    </div>
  );
}

export default App;
