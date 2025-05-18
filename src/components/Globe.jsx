import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { Viewer, Entity, useCesium } from "resium";
import {
  Ion,
  createWorldTerrain,
  createWorldImagery,
  Cartesian3,
  EasingFunction,
  HeadingPitchRange,
  Rectangle,
  BoundingSphere,
  Math as CesiumMath,
} from "cesium";
import ErrorBoundary from "./ErrorBoundary";
import { useGlobe } from "../context/GlobeContext";
import CameraController from "./CameraController";
import {
  VIEWER_OPTIONS,
  POINT_STYLES,
  LABEL_STYLES,
  ROTATION_SPEED,
} from "../config/globeConfig";
import "../styles/Globe.css";

// Initialize Cesium ion access token for terrain and imagery
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN;

/**
 * Globe Component
 * Renders a 3D globe visualization using Cesium
 * Manages the globe's terrain, imagery, and entity markers
 */
function Globe() {
  const terrainProvider = useMemo(() => createWorldTerrain(), []);
  const imageryProvider = useMemo(() => createWorldImagery(), []);
  const { coordinates, places } = useGlobe();
  const viewerRef = useRef(null);
  const animationRef = useRef(null);

  // Configure viewer options with terrain and imagery providers
  const viewerOptions = useMemo(
    () => ({
      ...VIEWER_OPTIONS,
      imageryProvider,
      terrainProvider,
    }),
    [imageryProvider, terrainProvider]
  );

  // Filter and validate place coordinates
  const validPlaces = useMemo(() => {
    if (!places || !Array.isArray(places)) return [];
    return places.filter(
      (place) =>
        place &&
        typeof place.lat === "number" &&
        typeof place.lng === "number" &&
        !isNaN(place.lat) &&
        !isNaN(place.lng) &&
        place.lat >= -90 &&
        place.lat <= 90 &&
        place.lng >= -180 &&
        place.lng <= 180
    );
  }, [places]);

  // Handle globe rotation when no location is selected
  useEffect(() => {
    const viewer = viewerRef.current && viewerRef.current.cesiumElement;
    if (!viewer) return;

    function rotate() {
      if (!coordinates) {
        const camera = viewer.scene.camera;
        camera.rotate(Cartesian3.UNIT_Z, CesiumMath.toRadians(ROTATION_SPEED));
        animationRef.current = requestAnimationFrame(rotate);
      }
    }

    if (!coordinates) {
      animationRef.current = requestAnimationFrame(rotate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [coordinates]);

  return (
    <ErrorBoundary>
      <div className="globe-container">
        <Viewer ref={viewerRef} {...viewerOptions}>
          <CameraController coordinates={coordinates} />
          {coordinates && coordinates.lat && coordinates.lng && (
            <Entity
              position={Cartesian3.fromDegrees(
                coordinates.lng,
                coordinates.lat
              )}
              point={POINT_STYLES.selected}
              label={{
                ...LABEL_STYLES,
                text: coordinates.name || "Selected Location",
              }}
              name={coordinates.name || "Selected Location"}
            />
          )}
          {validPlaces.map((place, index) => (
            <Entity
              key={index}
              position={Cartesian3.fromDegrees(place.lng, place.lat)}
              point={POINT_STYLES.place}
              label={{
                ...LABEL_STYLES,
                text: place.name,
              }}
              name={place.name}
              description={place.address}
            />
          ))}
        </Viewer>
      </div>
    </ErrorBoundary>
  );
}

export default Globe;
