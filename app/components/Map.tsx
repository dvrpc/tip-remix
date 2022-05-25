import { useNavigate, useSubmit } from "remix";
import { useCallback, useEffect, useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { LngLatBounds, MapLayerMouseEvent } from "mapbox-gl";
import { boundaryLayers, togglableLayers } from "~/mapbox-layers";
import Legend from "./Legend";
import { getCategoryColor } from "~/utils";
import DetailsToggle from "./DetailsToggle";
import { SingleValue } from "react-select";

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css",
      crossOrigin: "true",
    },
  ];
};

export default function MapContainer({
  projects,
  mapData,
  setShowPopup,
  showPopup,
  location,
}) {
  const navigate = useNavigate();
  const [interactiveLayerIds, setInteractiveLayerIds] = useState();
  const [activeLayer, setActiveLayer] = useState();
  const [activeBoundary, setActiveBoundary] = useState();
  const submit = useSubmit();

  //map mousemove callback
  const onHover = useCallback((event: MapLayerMouseEvent) => {
    event.features
      ? setShowPopup({
          feature: event.features[0],
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
        })
      : null;
  }, []);

  const onMouseLeave = useCallback(() => setShowPopup(null), []);

  //map click callback
  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const { features } = event;
      const feature = features && features[0];
      feature &&
        navigate({
          pathname: feature.properties?.mpms_id.toString(),
          search: location.search,
        });
    },
    [location]
  );

  //Load data layers based on project ids
  useEffect(() => {
    if (projects.length) {
      mapData.load(`/map/${projects.map((p) => p.id).join(",")}`);
    }
  }, [projects]);

  //Don't enable data layers until they are loaded
  useEffect(() => {
    if (mapData.type === "done") {
      setInteractiveLayerIds(["pa-tip-lines", "pa-tip-points"]);
    }
  }, [mapData]);

  const maxExtent = new LngLatBounds([
    [-76.13660270099047, 39.51488251559762],
    [-74.38970960698468, 40.60856713855744],
  ]);

  return (
    <Map
      cursor="pointer"
      maxBounds={maxExtent}
      initialViewState={{ bounds: maxExtent }}
      mapStyle="mapbox://styles/mapbox/outdoors-v11"
      mapboxAccessToken="pk.eyJ1IjoibW1vbHRhIiwiYSI6ImNqZDBkMDZhYjJ6YzczNHJ4cno5eTcydnMifQ.RJNJ7s7hBfrJITOBZBdcOA"
      interactiveLayerIds={interactiveLayerIds}
      onMouseMove={onHover}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {boundaryLayers.map((source) => {
        const { key, layer, ...props } = source;

        return (
          <Source key={key} {...props}>
            <Layer
              {...layer}
              layout={{
                visibility:
                  activeBoundary && activeBoundary[0] === props.id
                    ? "visible"
                    : "none",
              }}
            />
          </Source>
        );
      })}

      {togglableLayers.map((source) => {
        const { key, layer, ...props } = source;

        return (
          <Source key={key} {...props}>
            <Layer
              {...layer}
              layout={{
                visibility:
                  activeLayer && activeLayer[0] === props.id
                    ? "visible"
                    : "none",
              }}
            />
          </Source>
        );
      })}

      {mapData.type === "done" &&
        mapData.data.map((d: any) => (
          <Source type="geojson" data={d} key={d.id}>
            <Layer {...d.layer} />
          </Source>
        ))}

      {showPopup ? (
        <Popup
          longitude={showPopup.longitude}
          latitude={showPopup.latitude}
          closeButton={false}
          closeOnClick={false}
          maxWidth="350px"
        >
          <div
            className="-mb-[15px] -mt-[10px] -mx-[10px] border-b-8 cursor-pointer flex flex-nowrap flex-row items-stretch outline-stone-700 overflow-clip pointer-events-none rounded text-sm z-10"
            style={{
              borderColor: getCategoryColor(
                showPopup.feature.properties.descriptio
              ),
            }}
          >
            <div className="bg-stone-700 flex font-bold items-center p-2 text-lg text-stone-100">
              <div>{showPopup.feature.properties.mpms_id}</div>
            </div>
            <div className="bg-stone-600 flex items-center p-2 text-stone-100">
              <div>{showPopup.feature.properties.road_name}</div>
            </div>
          </div>
        </Popup>
      ) : null}

      <div className="absolute flex gap-4 m-4" style={{ colorScheme: "dark" }}>
        <DetailsToggle
          filter={activeBoundary}
          setFilter={setActiveBoundary}
          name="boundary"
          title="Boundaries"
          options={boundaryLayers.map((l) => l.id)}
          submit={submit}
        />
        <DetailsToggle
          filter={activeLayer}
          setFilter={setActiveLayer}
          name="layer"
          title="Layers"
          options={togglableLayers.map((l) => l.id)}
          deselect
          submit={submit}
        />
      </div>
      <Legend activeLayer={activeLayer} />
    </Map>
  );
}
