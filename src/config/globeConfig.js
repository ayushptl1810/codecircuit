import { Color, Cartesian3, LabelStyle, VerticalOrigin } from "cesium";

export const VIEWER_OPTIONS = {
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
  contextOptions: {
    webgl: {
      alpha: true,
    },
  },
};

export const POINT_STYLES = {
  selected: {
    pixelSize: 10,
    color: Color.RED,
    outlineColor: Color.WHITE,
    outlineWidth: 2,
  },
  place: {
    pixelSize: 8,
    color: Color.YELLOW,
    outlineColor: Color.WHITE,
    outlineWidth: 1,
  },
};

export const LABEL_STYLES = {
  font: "15px sans-serif",
  fillColor: Color.WHITE,
  style: LabelStyle.FILL_AND_OUTLINE,
  outlineWidth: 2,
  verticalOrigin: VerticalOrigin.BOTTOM,
  pixelOffset: new Cartesian3(0, -10),
  disableDepthTestDistance: Number.POSITIVE_INFINITY,
  showBackground: true,
  backgroundColor: Color.BLACK.withAlpha(0.7),
  backgroundPadding: new Cartesian3(7, 5, 7),
};

export const ROTATION_SPEED = 0.1; // degrees per frame
