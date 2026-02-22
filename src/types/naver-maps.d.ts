// Naver Maps SDK Type Definitions
declare namespace naver {
  namespace maps {
    class Map {
      constructor(element: HTMLElement | string, options: MapOptions);
      setCenter(center: LatLng | Coord): void;
      getCenter(): Coord;
      setZoom(zoom: number, animate?: boolean): void;
      getZoom(): number;
      destroy(): void;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(position: LatLng | Coord): void;
      getPosition(): Coord;
      setAnimation(animation: Animation | null): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, marker?: Marker): void;
      close(): void;
      setContent(content: string | HTMLElement): void;
    }

    interface MapOptions {
      center: LatLng | Coord;
      zoom?: number;
      minZoom?: number;
      maxZoom?: number;
      zoomControl?: boolean;
      zoomControlOptions?: ZoomControlOptions;
      mapTypeControl?: boolean;
      scaleControl?: boolean;
      logoControl?: boolean;
      mapDataControl?: boolean;
      draggable?: boolean;
      pinchZoom?: boolean;
      scrollWheel?: boolean;
      disableDoubleTapZoom?: boolean;
      disableDoubleClickZoom?: boolean;
      disableTwoFingerTapZoom?: boolean;
    }

    interface MarkerOptions {
      position: LatLng | Coord;
      map?: Map;
      icon?: string | ImageIcon | SymbolIcon | HtmlIcon;
      animation?: Animation;
      title?: string;
      clickable?: boolean;
      draggable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    interface InfoWindowOptions {
      content: string | HTMLElement;
      maxWidth?: number;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      anchorSize?: Size;
      anchorSkew?: boolean;
      anchorColor?: string;
      pixelOffset?: Point;
    }

    interface ImageIcon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface SymbolIcon {
      path: SymbolPath | string;
      style?: SymbolStyle;
      radius?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
      anchor?: Point;
    }

    interface HtmlIcon {
      content: string | HTMLElement;
      size?: Size;
      anchor?: Point;
    }

    interface ZoomControlOptions {
      position: Position;
      style?: ZoomControlStyle;
    }

    interface Coord {
      x: number;
      y: number;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    enum Position {
      TOP_LEFT,
      TOP_CENTER,
      TOP_RIGHT,
      LEFT_CENTER,
      LEFT_TOP,
      LEFT_BOTTOM,
      CENTER,
      RIGHT_TOP,
      RIGHT_CENTER,
      RIGHT_BOTTOM,
      BOTTOM_LEFT,
      BOTTOM_CENTER,
      BOTTOM_RIGHT,
    }

    enum ZoomControlStyle {
      LARGE,
      SMALL,
    }

    enum Animation {
      BOUNCE,
      DROP,
    }

    enum SymbolPath {
      CIRCLE,
      BACKWARD_CLOSED_ARROW,
      FORWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      FORWARD_OPEN_ARROW,
    }

    enum SymbolStyle {
      CIRCLE,
      PATH,
      CLOSED_PATH,
    }
  }
}

interface Window {
  naver?: typeof naver;
}
