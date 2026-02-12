import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

/**
 * HeatmapLayer component for React-Leaflet
 * @param {Array} points - Array of [lat, lng, intensity]
 * @param {Object} options - Heatmap options (radius, blur, maxZoom, etc.)
 */
const HeatmapLayer = ({ points, options = {} }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Default configuration for the heatmap
    const heatOptions = {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.4: "blue",
        0.6: "cyan",
        0.7: "lime",
        0.8: "yellow",
        1.0: "red",
      },
      ...options,
    };

    // Create the heat layer
    const heatLayer = L.heatLayer(points, heatOptions);
    
    // Add to map
    heatLayer.addTo(map);

    // Cleanup: remove the layer when component unmounts or points change
    return () => {
      if (map) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points, options]);

  return null;
};

export default HeatmapLayer;
