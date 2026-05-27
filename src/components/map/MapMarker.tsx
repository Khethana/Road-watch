import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { Report } from '../../types';
import { getSeverityColor } from '../../utils/formatters';

interface MapMarkerProps {
  report: Report;
  onClick: (report: Report) => void;
}

// Create custom icons based on severity
const createCustomIcon = (severity: string) => {
  let color = '#3B82F6'; // default info
  if (severity === 'critical') color = '#EF4444';
  if (severity === 'moderate') color = '#F59E0B';
  if (severity === 'low') color = '#22C55E';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5 15.5 6.07 15.5 8 13.93 11.5 12 11.5z"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export const MapMarker = React.memo(({ report, onClick }: MapMarkerProps) => {
  const icon = React.useMemo(() => createCustomIcon(report.severity), [report.severity]);

  return (
    <Marker
      position={[report.lat, report.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(report),
      }}
    />
  );
});

MapMarker.displayName = 'MapMarker';
export default MapMarker;
