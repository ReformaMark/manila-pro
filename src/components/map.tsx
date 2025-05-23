'use client';

import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LayersControl, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { PropertyTypesWithImageUrls } from '@/lib/types';
import PinIcon from '@/../public/images/pin.png';
import PropertyCard from '@/app/properties/_components/PropertyCard';
import { useRouter } from 'next/navigation';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  property?: PropertyTypesWithImageUrls;
  properties?: PropertyTypesWithImageUrls[];
  setSelectedMarker?: (property: PropertyTypesWithImageUrls | null) => void;
  selectedMarker?: PropertyTypesWithImageUrls | null;
  isAuthenticated?: boolean;
}
interface NearbyPlacesProps {
  coordinates: [number, number];
  name: string;
  type: string;
}


export default function LeafletMap({
  property,
  properties, 
  setSelectedMarker,
  selectedMarker,
  isAuthenticated,
}: MapProps) {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlacesProps[]>([]);
  const [position] = useState({
    lat: 14.5537, // Center latitude between Makati, Taguig, and Pasay
    lng: 121.0276, // Center longitude between Makati, Taguig, and Pasay
    zoom: 13
  })
  const [iconSize, setIconSize] = useState<[number, number]>([25, 41]);
  const router = useRouter();
  const coordinates: [number, number] = [position.lat, position.lng]



  // useEffect(() => {
  //   if (selectedMarker) {
  //     const map = useMap();
  //     map.flyTo(selectedMarker.coordinates as [number, number], 15);
  //   }
  // }, [selectedMarker]);
  
  // Remove the effect that tries to imperatively add markers to the map,
  // since React Leaflet manages the map instance and markers declaratively.
  // If you want to display fetched places, store them in state and render as <Marker> components.

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
              eventHandlers={{
                click: () => {
                  if (setSelectedMarker) {
                  if (selectedMarker && property._id === selectedMarker._id ) {
                    setSelectedMarker(null);
                    setIconSize([25, 41]);
                    return;
                  } else {
                    setSelectedMarker(property);
                    setIconSize([25, 41]);
                    return;
                  }
                }},
              }}
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
                <PropertyCard property={property} onClick={() => isAuthenticated ? router.push(`/properties/${property._id}`) : router.push(`/auth`)}  />
              </Popup>
            </Marker>
          </React.Fragment>
        )})}
        {/* {nearbyPlaces.filter((place) => place.coordinates).map((place, index) => {
         
          return (
          <React.Fragment key={place.name}>
            <Marker
              key={`${place.name}-${index}`}
              position={place.coordinates as [number, number]}
              icon={L.icon({
                iconUrl: PinIcon.src || '/placeholder.svg',
                iconSize: iconSize,
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                
              })}
            >
              <Popup closeButton={false} className='p-0'>
                <div className="p-2">
                  <h3 className="text-sm font-semibold">{place.name}</h3>
                  <p className="text-xs text-gray-500">{place.type}</p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
          )})} */}
        {property && property.coordinates &&(
          <React.Fragment key={property._id}>
            <Marker 
              eventHandlers={{
                click: () => {
                  if (setSelectedMarker) {
                  if (selectedMarker && property._id === selectedMarker._id ) {
                    setSelectedMarker(null);
                    setIconSize([25, 41]);
                    return;
                  } else {
                    setSelectedMarker(property);
                    setIconSize([25, 41]);
                    return;
                  }
                }},
              }}
              key={`${property._id}`}
              position={property.coordinates as [number, number]}
              icon={L.icon({
                iconUrl: PinIcon.src || '/placeholder.svg',
                iconSize: iconSize,
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                
              })}
            >
              <Popup closeButton={false} className='p-0'>
                <PropertyCard property={property} onClick={()=>{}}/>
              </Popup>
            </Marker>
          </React.Fragment>
        )}
    </MapContainer>
  );
}
