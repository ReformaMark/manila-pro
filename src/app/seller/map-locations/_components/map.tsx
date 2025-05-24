'use client';

import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LayersControl, MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { PropertyTypesWithImageUrls } from '@/lib/types';
import PinIcon from '@/../public/images/pin.png';
import PropertyCard from '@/app/properties/_components/PropertyCard';
import { Doc } from '../../../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface LeafletMapProps {
    selectedProperty: Doc<'property'> | null;
    setSelectedProperty: (value: Doc<'property'> | null) => void;
    properties?: PropertyTypesWithImageUrls[];
    selectedLocation: [number, number] | null;
    setSelectedLocation: (value: [number, number] | null) => void;
}

interface NearbyPlacesProps {
    coordinates: [number, number];
    name: string;
    type: string;
}


export default function LeafletMap({
    selectedProperty,
    setSelectedProperty,
    properties, 
    selectedLocation,
    setSelectedLocation,
 
}: LeafletMapProps) {
    const saveCoordinates = useMutation(api.property.saveCoordinates)
 
    const [position] = useState({
    lat: 14.5537, // Center latitude between Makati, Taguig, and Pasay
    lng: 121.0276, // Center longitude between Makati, Taguig, and Pasay
    zoom: 13
    })
    const [iconSize, setIconSize] = useState<[number, number]>([25, 41]);
    const coordinates: [number, number] = [position.lat, position.lng]

    function LocationSelector() {
        useMapEvents({
        click(e) {
            if (selectedProperty) {
                const location: [number, number] = [e.latlng.lat, e.latlng.lng];
                setSelectedLocation(location)
            }
        }
        });
        return null;
    }
  return (
    <MapContainer center={coordinates} zoom={position.zoom} className='h-full w-full'>
        <LayersControl position="topright">
           <LayersControl.BaseLayer checked name="Default Map">
               <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
           </LayersControl.BaseLayer>
             {/* Satellite Layer */}
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {properties?.filter((property) => property.coordinates).map((property, index) => {
         
          return (
          <React.Fragment key={property._id}>
            <Marker 
             
              key={`${property._id}-${index}`}
              position={property.coordinates as [number, number]}
              icon={L.icon({
                iconUrl: PinIcon.src || '/placeholder.svg',
                iconSize: iconSize,
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                
              })}
            >
              <Popup closeButton={false} className='p-0'>
                <PropertyCard property={property} onClick={() => {}}  />
              </Popup>
            </Marker>
          </React.Fragment>
        )})}
        {selectedLocation && (
            <Marker 
             
              key={`${selectedLocation}`}
              position={selectedLocation as [number, number]}
              icon={L.icon({
                iconUrl: PinIcon.src || '/placeholder.svg',
                iconSize: iconSize,
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                
              })}
            >
              <Popup closeButton={false} className='p-0'>
                
              </Popup>
            </Marker> 
        )}
        <LocationSelector />
    </MapContainer>
  );
}
