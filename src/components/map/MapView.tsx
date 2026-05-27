import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { Report, FilterState } from '../../types';
import { ENV } from '../../config/env';
import { useTheme } from '../../hooks/useTheme';
import MapMarker from './MapMarker';

interface MapViewProps {
  reports: Report[];
  filters?: FilterState;
  height?: string;
  onMarkerClick?: (report: Report) => void;
  interactive?: boolean;
}

// Component to handle dynamic theme changes on map tiles
const MapUpdater = ({ tileUrl }: { tileUrl: string }) => {
  const map = useMap();
  useEffect(() => {
    // Force redraw when tileUrl changes
    map.invalidateSize();
  }, [map, tileUrl]);
  return null;
};

export const MapView = ({
  reports,
  height = '400px',
  onMarkerClick,
  interactive = true,
}: MapViewProps) => {
  const { isDark } = useTheme();
  
  const tileUrl = isDark ? ENV.MAP_TILE_URL : ENV.MAP_TILE_URL_LIGHT;

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-border relative z-0">
      <MapContainer
        center={[ENV.MAP_DEFAULT_LAT, ENV.MAP_DEFAULT_LNG]}
        zoom={ENV.MAP_DEFAULT_ZOOM}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        <MapUpdater tileUrl={tileUrl} />
        
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
        >
          {reports.map((report) => (
            <MapMarker
              key={report.id}
              report={report}
              onClick={(r) => {
                if (onMarkerClick) onMarkerClick(r);
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapView;
