import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { Viewer, Entity, useCesium } from "resium";
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
  LabelStyle,
  VerticalOrigin,
  Math as CesiumMath,
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
      const center = Cartesian3.fromDegrees(lng, lat);
      const boundingSphere = new BoundingSphere(center, 50000);
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
  const { coordinates, places } = useGlobe();
  const viewerRef = useRef(null);
  const animationRef = useRef(null);

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
      terrainProvider: terrainProvider,
      contextOptions: {
        webgl: {
          alpha: true,
        },
      },
    }),
    [imageryProvider, terrainProvider]
  );

  // Globe rotation effect
  useEffect(() => {
    const viewer = viewerRef.current && viewerRef.current.cesiumElement;
    if (!viewer) return;

    function rotate() {
      if (!coordinates) {
        const camera = viewer.scene.camera;
        const currentPosition = camera.position;

        // Rotate around the vertical axis (Z-axis)
        camera.rotate(Cartesian3.UNIT_Z, CesiumMath.toRadians(0.1));

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
              label={{
                text: coordinates.name || "Selected Location",
                font: "14px sans-serif",
                fillColor: Color.WHITE,
                style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian3(0, -10),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                showBackground: true,
                backgroundColor: Color.BLACK.withAlpha(0.7),
                backgroundPadding: new Cartesian3(7, 5, 7),
              }}
              name={coordinates.name || "Selected Location"}
            />
          )}
          {places.map((place, index) => (
            <Entity
              key={index}
              position={Cartesian3.fromDegrees(place.lng, place.lat)}
              point={{
                pixelSize: 8,
                color: Color.YELLOW,
                outlineColor: Color.WHITE,
                outlineWidth: 1,
              }}
              label={{
                text: place.name,
                font: "12px sans-serif",
                fillColor: Color.WHITE,
                style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian3(0, -10),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                showBackground: true,
                backgroundColor: Color.BLACK.withAlpha(0.7),
                backgroundPadding: new Cartesian3(7, 5, 7),
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
