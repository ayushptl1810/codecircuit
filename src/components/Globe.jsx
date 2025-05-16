import React, { useEffect, useCallback, useMemo } from "react";
import { Viewer, Scene, Globe as ResiumGlobe, Entity, useCesium } from "resium";
import {
  Ion,
  createWorldTerrain,
  Color,
  createWorldImagery,
  Cartesian3,
  EasingFunction,
  HeadingPitchRange,
  Rectangle,
  BoundingSphere,
} from "cesium";
import ErrorBoundary from "./ErrorBoundary";
import { useGlobe } from "../context/GlobeContext";
import "./Globe.css";

// Replace this with your own Cesium ion access token from https://cesium.com/ion/tokens
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN;

// Create a separate component for the camera control
function CameraController({ coordinates }) {
  const { camera } = useCesium();

  useEffect(() => {
    if (coordinates && camera) {
      const { lat, lng } = coordinates;

      // Create a bounding sphere around the target location
      const center = Cartesian3.fromDegrees(lng, lat);
      const boundingSphere = new BoundingSphere(center, 50000); // 50km radius

      // Fly to the location using bounding sphere
      camera.flyToBoundingSphere(boundingSphere, {
        duration: 3,
        offset: new HeadingPitchRange(0, -Math.PI / 4, 0),
      });
    }
  }, [coordinates, camera]);

  return null;
}

function Globe() {
  const terrainProvider = useMemo(() => createWorldTerrain(), []);
  const imageryProvider = useMemo(() => createWorldImagery(), []);

  // Memoize the viewer options to prevent recreation
  const viewerOptions = useMemo(
    () => ({
      full: true,
      scene3DOnly: true,
      baseLayerPicker: false,
      navigationHelpButton: false,
      homeButton: false,
      geocoder: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      infoBox: false,
      imageryProvider: imageryProvider,
      contextOptions: {
        webgl: {
          alpha: true,
        },
      },
    }),
    [imageryProvider]
  );

  const { coordinates, places } = useGlobe();

  return (
    <ErrorBoundary>
      <div className="globe-container">
        <Viewer {...viewerOptions}>
          <Scene backgroundColor={Color.BLACK}>
            <ResiumGlobe
              enableLighting={true}
              terrainProvider={terrainProvider}
            />
            <CameraController coordinates={coordinates} />
            {coordinates && (
              <Entity
                position={Cartesian3.fromDegrees(
                  coordinates.lng,
                  coordinates.lat
                )}
                point={{
                  pixelSize: 10,
                  color: Color.RED,
                  outlineColor: Color.WHITE,
                  outlineWidth: 2,
                }}
                name={coordinates.name || "Selected Location"}
              />
            )}
            {places.map((place, index) => (
              <Entity
                key={index}
                position={Cartesian3.fromDegrees(
                  coordinates.lng,
                  coordinates.lat
                )}
                point={{
                  pixelSize: 8,
                  color: Color.YELLOW,
                  outlineColor: Color.WHITE,
                  outlineWidth: 1,
                }}
                name={place.name}
                description={place.address}
              />
            ))}
          </Scene>
        </Viewer>
      </div>
    </ErrorBoundary>
  );
}

export default Globe;
