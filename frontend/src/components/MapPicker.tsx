'use client';

import { useEffect, useState, useRef } from 'react';

// Không import gì ở top level
export default function MapPicker({ lat, lng, onLocationChange }: { lat: number; lng: number; onLocationChange: (lat: number, lng: number) => void }) {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Dynamic import only when mounted
    const loadMap = async () => {
      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, useMapEvents } = await import('react-leaflet');
      // Fix icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      // Render map
      // ... (phức tạp vì cần render React component)
    };
    loadMap();
  }, [mounted]);

  return <div style={{ height: '300px', background: '#f3f4f6', borderRadius: '8px' }}>Loading map...</div>;
}