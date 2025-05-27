'use client';

import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LayersControl, MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import PinIcon from '@/../public/images/pin.png';
import { Doc } from '../../../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { toast } from 'sonner';
import { ConfirmLocationDialog } from './confirmation-dialog';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface LeafletMapProps {
    position: { lat: number; lng: number; zoom: number };
    setPosition: (value: { lat: number; lng: number; zoom: number }) => void;
    selectedProperty: Doc<'property'> | null;
    setSelectedProperty: (value: Doc<'property'> | null) => void;
    properties?: Doc<'property'>[] | undefined;
    selectedLocation: [number, number] | null;
    setSelectedLocation: (value: [number, number] | null) => void;
    selectedNearbyPlace: [number,number] | null;
    setSelectedNearbyPlace: (value: [number, number] | null) => void;
    addingNearbyPlaces: boolean;
    setActiveTab: (tab: string) => void;
}

interface NearbyPlacesProps {
    coordinates: [number, number];
    name: string;
    type: string;
}


export default function LeafletMap({
    position,
    setPosition,
    selectedProperty,
    setSelectedProperty,
    properties, 
    selectedLocation,
    setSelectedLocation,
    selectedNearbyPlace,
    setSelectedNearbyPlace,
    addingNearbyPlaces,
    setActiveTab
}: LeafletMapProps) {
    const saveCoordinates = useMutation(api.property.saveCoordinates)
    const removeCoordinates = useMutation(api.property.removeCoordinates)
 
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [iconSize, setIconSize] = useState<[number, number]>([25, 41]);
    const coordinates: [number, number] = [position.lat, position.lng]

    function ChangeCenter({ center }: { center: [number, number] }) {
      const map = useMap();
      // Update the view when center changes
      map.flyTo(center, map.getZoom());

      return null;
    }
    function LocationSelector() {
        useMapEvents({
        click(e) {
          const location: [number, number] = [e.latlng.lat, e.latlng.lng];
            if (selectedProperty && !addingNearbyPlaces) {
              setPosition({
                lat: location[0],
                lng: location[1],
                zoom: 13
              })
              setSelectedLocation(location)
              setConfirmationDialogOpen(true);
            }
          }
        });
        return null;
    }
    function NearbyPlaceSelector() {
        useMapEvents({
        click(e) {
          const location: [number, number] = [e.latlng.lat, e.latlng.lng];
          
            if(selectedProperty && addingNearbyPlaces) {
              setSelectedNearbyPlace(location)
            }
        }
        });
        return null;
    }
    function onClose() {
      setSelectedLocation(null);
      setConfirmationDialogOpen(false);
    }
    function onConfirm() {
      if(selectedProperty && selectedLocation) { 
        toast.promise(
          saveCoordinates({
            propertyId: selectedProperty?._id,
            coordinates: selectedLocation as [number, number]
          }),{
            loading: 'Saving location...',
            success: 'Location saved successfully.',
            error: 'Failed to save location.'
        })
        setConfirmationDialogOpen(false)
        setActiveTab('Assigned');
      }
    }
    const filteredProperties = selectedProperty ? properties?.filter((property) => property._id === selectedProperty._id) : properties;
   
   
  return (
    <div className='contents'>
  
    <MapContainer center={coordinates} zoom={15} className='h-full w-full cursor-pointer'>
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
        {filteredProperties?.filter((property) => property.coordinates).map((property, index) => {
         
          return (
          <React.Fragment key={property._id}>
            <Marker 
              eventHandlers={{
                click: () => {
                  if (!selectedProperty && !addingNearbyPlaces) {
                    setSelectedLocation(property.coordinates as [number, number]);
                    setSelectedProperty(property);
                  }
                },
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
                  <h1 className='text-center font-semibold '>{property.propertyName}</h1>
                 
              </Popup>
            </Marker>
          </React.Fragment>
        )})}
        {selectedLocation && (
            <Marker 
              
              riseOnHover
              key={`${selectedLocation}-location`}
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
        {selectedNearbyPlace && (
            <Marker 
              key={`${selectedNearbyPlace}-nearbyPlace`}
              position={selectedNearbyPlace as [number, number]}
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
        <NearbyPlaceSelector />
        {selectedLocation && !addingNearbyPlaces && (
          <ConfirmLocationDialog 
            open={confirmationDialogOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            coordinates={selectedLocation as [number, number]}
          />
        )}
        <ChangeCenter center={[position.lat, position.lng]} />
    </MapContainer>
    </div>
  );
}
