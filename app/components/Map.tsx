import { useNavigate, useSubmit, useParams } from "remix";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import { LngLatBounds, MapLayerMouseEvent } from "mapbox-gl";
import { boundaryLayers, togglableLayers } from "~/mapbox-layers";
import Legend from "./Legend";
import { getCategoryColor, getBoundingBox } from "~/utils";
import DetailsToggle from "./DetailsToggle";
import { useAppContext } from "~/AppContext";
import { extractIdFromSplat } from "~/utils";

import type { MapRef } from "react-map-gl";

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
  hoverProject,
  setProjectsWithinView,
}) {
  const navigate = useNavigate();
  const {
    appContext: { basename },
  } = useAppContext();
  const [interactiveLayerIds, setInteractiveLayerIds] = useState();
  const [activeLayer, setActiveLayer] = useState();
  const [activeBoundary, setActiveBoundary] = useState({
    label: "Counties and Muncipalities",
    value: "Counties and Muncipalities",
  });
  const submit = useSubmit();
  const map = useRef<MapRef>();
  const params = useParams();
  const id = Object.keys(params).length > 0 ? extractIdFromSplat(params) : null;

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
      mapData.load(`${basename}/map/${projects.map((p) => p.id).join(",")}`);
    }
  }, [projects]);

  //Don't enable data layers until they are loaded
  useEffect(() => {
    if (mapData.type === "done") {
      setInteractiveLayerIds(["pa-tip-lines", "pa-tip-points"]);
    }
  }, [mapData]);

  //zoom to project
  useEffect(() => {
    if (id && mapData.type === "done" && interactiveLayerIds) zoomCallback();
  }, [mapData, id, interactiveLayerIds]);

  const zoomCallback = () => {
    const features = interactiveLayerIds
      .map((layer) =>
        map.current?.querySourceFeatures(layer, {
          filter: ["in", "mpms_id", parseInt(id, 10)],
        })
      )
      .reduce((prev, curr) => [...prev, ...curr]);
    const bbox = getBoundingBox({ features });
    const { xMin, xMax, yMin, yMax } = bbox;
    xMin &&
      map.current?.fitBounds(
        [
          [xMin, yMin],
          [xMax, yMax],
        ],
        { maxZoom: 11 }
      );
  };

  //Filter highlighted project
  const filter = useMemo(
    () => ["in", "mpms_id", hoverProject ? parseInt(hoverProject, 10) : ""],
    [hoverProject]
  );

  const maxExtent = new LngLatBounds([
    [-76.13660270099047, 39.51488251559762],
    [-74.38970960698468, 40.60856713855744],
  ]);

  const onMoveEnd = () => {
    const features = map.current?.queryRenderedFeatures({
      layers: ["pa-tip-points", "pa-tip-lines"],
    });
    if (features) {
      const projectsWithinView = new Set();
      for (const feature of features) {
        const id = feature.properties.mpms_id;
        if (!projectsWithinView.has(id)) projectsWithinView.add(id);
      }
      setProjectsWithinView(new Set(projectsWithinView));
    }
  };

  return (
    <Map
      cursor="pointer"
      maxBounds={maxExtent}
      initialViewState={{ bounds: maxExtent }}
      mapStyle="mapbox://styles/crvanpollard/cl309ua6g006a15qks975tm31"
      mapboxAccessToken="pk.eyJ1IjoibW1vbHRhIiwiYSI6ImNqZDBkMDZhYjJ6YzczNHJ4cno5eTcydnMifQ.RJNJ7s7hBfrJITOBZBdcOA"
      interactiveLayerIds={interactiveLayerIds}
      onMouseMove={onHover}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onMoveEnd={onMoveEnd}
      ref={map}
    >
      <NavigationControl />
      <div
        id="default-extent-btn"
        className="overlays shadow"
        aria-label="Default DVRPC Extent"
        onClick={() => map.current?.fitBounds(maxExtent)}
      >
        <img
          id="default-extent-img"
          src="https://www.dvrpc.org/img/banner/new/bug-favicon.png"
          alt="DVRPC logo"
        />
      </div>

      {boundaryLayers.map((source) => {
        const { key, layer, ...props } = source;

        return (
          <Source key={key} {...props}>
            <Layer
              {...layer}
              layout={{
                visibility:
                  activeBoundary?.value === props.id ? "visible" : "none",
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
                  activeLayer?.value === props.id ? "visible" : "none",
              }}
            />
          </Source>
        );
      })}

      {mapData.type === "done" &&
        mapData.data.map((d: any) => (
          <Source type="geojson" data={d} id={d.id} key={d.id}>
            <Layer {...d.highlightLayer} filter={filter} />
            <Layer {...d.layer} />
            <Layer {...d.backlightLayer} filter={filter} />
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

      <div
        className="absolute flex gap-4 m-4 w-full"
        style={{ colorScheme: "dark" }}
      >
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
          submit={submit}
          deselect={true}
          onChange={(val) => {
            if (!activeLayer) setActiveLayer(val);
            else if (activeLayer.value !== val.value) setActiveLayer(val);
            else if (activeLayer.value === val.value) setActiveLayer(null);
            setTimeout(() => submit(), 1);
          }}
        />
        <button
          className="bg-[#57534e] p-2 rounded text-white"
          style={{
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            fontWeight: 700,
          }}
          onClick={zoomCallback}
        >
          Zoom to Project
        </button>
      </div>
      <Legend activeLayer={activeLayer?.value} />
    </Map>
  );
}
