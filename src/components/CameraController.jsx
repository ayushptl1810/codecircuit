import React, { useEffect, useRef } from "react";
import { useCesium } from "resium";
import {
  Cartesian3,
  BoundingSphere,
  HeadingPitchRange,
  Rectangle,
} from "cesium";
import { useGlobe } from "../context/GlobeContext";

/**
 * CameraController Component
 * Manages the camera behavior for the 3D globe
 * Handles zooming and positioning based on selected locations and places
 */
function CameraController({ coordinates }) {
  const { camera } = useCesium();
  const { places } = useGlobe();
  const initialViewRef = useRef(null);

  // Store the initial camera view for reference
  useEffect(() => {
    if (camera && !initialViewRef.current) {
      initialViewRef.current = {
        position: camera.position.clone(),
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll,
      };
    }
  }, [camera]);

  // Handle camera movement based on coordinates and places
  useEffect(() => {
    if (!camera || !initialViewRef.current) return;

    if (coordinates && coordinates.lat && coordinates.lng) {
      // Calculate view area based on places
      if (places && places.length > 0 && !places[0].error) {
        const lats = places.map((p) => p.lat);
        const lngs = places.map((p) => p.lng);

        // Calculate the geographical bounds
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        // Add padding to ensure all points are visible
        const latPadding = (maxLat - minLat) * 0.2;
        const lngPadding = (maxLng - minLng) * 0.2;

        // Create a view rectangle with padding
        const rectangle = Rectangle.fromDegrees(
          minLng - lngPadding,
          minLat - latPadding,
          maxLng + lngPadding,
          maxLat + latPadding
        );

        // Animate camera to the view area
        camera.flyTo({
          destination: rectangle,
          duration: 3,
          complete: () => {
            // Adjust camera for optimal viewing angle
            const boundingSphere = BoundingSphere.fromRectangle3D(rectangle);
            const distance = boundingSphere.radius * 2.5;
            camera.flyToBoundingSphere(boundingSphere, {
              duration: 1,
              offset: new HeadingPitchRange(0, -Math.PI / 6, distance),
            });
          },
        });
      } else {
        // Default view for single location
        const center = Cartesian3.fromDegrees(coordinates.lng, coordinates.lat);
        const boundingSphere = new BoundingSphere(center, 50000);
        camera.flyToBoundingSphere(boundingSphere, {
          duration: 3,
          offset: new HeadingPitchRange(0, -Math.PI / 6, 0),
        });
      }
    } else {
      // Return to initial view when no location is selected
      camera.flyTo({
        destination: initialViewRef.current.position,
        orientation: {
          heading: initialViewRef.current.heading,
          pitch: initialViewRef.current.pitch,
          roll: initialViewRef.current.roll,
        },
        duration: 3,
      });
    }
  }, [coordinates, places, camera]);

  return null;
}

export default CameraController;
