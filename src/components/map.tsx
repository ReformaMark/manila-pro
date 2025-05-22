'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LayersControl, MapContainer, Polygon, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

export default function LeafletMap() {
    const [position, setPosition] = useState({
      lat: 14.5537, // Center latitude between Makati, Taguig, and Pasay
      lng: 121.0276, // Center longitude between Makati, Taguig, and Pasay
      zoom: 13
    })

  const coordinates: [number, number] = [position.lat, position.lng]

  return (
    <MapContainer center={coordinates} zoom={position.zoom} className='h-[700px] w-full'>
        <LayersControl position="topright">
           <LayersControl.BaseLayer checked name="Default Map">
               <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
           </LayersControl.BaseLayer>
        </LayersControl>
    </MapContainer>
  );
}
