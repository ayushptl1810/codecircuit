import React from "react";
import { Viewer, Scene, Globe as ResiumGlobe } from "resium";
import { Ion, createWorldTerrain, Color, createWorldImagery } from "cesium";
import ErrorBoundary from "./ErrorBoundary";
import "./Globe.css";

// Replace this with your own Cesium ion access token from https://cesium.com/ion/tokens
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMDU5NTMxOC0zNWFlLTQzZGUtOGJiYy0wYWQwY2ZiZDljNDYiLCJpZCI6MjkxMDY2LCJpYXQiOjE3NDM4MzkyMTV9.LPvRbUhDWM-Q4w3ALnV4G74fGNiHqFVBWN8iCU1AvVA";

function Globe() {
  const terrainProvider = createWorldTerrain();
  const imageryProvider = createWorldImagery();

  return (
    <ErrorBoundary>
      <div className="globe-container">
        <Viewer
          full
          scene3DOnly={true}
          baseLayerPicker={false}
          navigationHelpButton={false}
          homeButton={false}
          geocoder={false}
          animation={false}
          timeline={false}
          fullscreenButton={false}
          infoBox={false}
          imageryProvider={imageryProvider}
          contextOptions={{
            webgl: {
              alpha: true,
            },
          }}
        >
          <Scene backgroundColor={Color.BLACK}>
            <ResiumGlobe
              enableLighting={true}
              terrainProvider={terrainProvider}
            />
          </Scene>
        </Viewer>
      </div>
    </ErrorBoundary>
  );
}

export default Globe;
