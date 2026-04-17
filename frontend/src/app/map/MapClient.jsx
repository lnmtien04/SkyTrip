// src/app/map/MapClient.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Star, MapPin, Navigation, Grid3x3, List,
  Waves, Mountain, Building2, Landmark, Utensils, Church, Sparkles,
  Route, X, Car, Clock
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component điều khiển map
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 13);
  }, [center, zoom, map]);
  return null;
}

// Component xử lý click trên map
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

// Component Routing nâng cao
function RoutingControl({ start, end, onRouteReady }) {
  const map = useMap();
  const routingRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const clearRouting = useCallback(() => {
    if (routingRef.current) {
      try { map.removeControl(routingRef.current); } catch (e) {}
      routingRef.current = null;
    }
  }, [map]);

  useEffect(() => {
    if (!map || !start || !end) return;
    clearRouting();
    const control = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      routeWhileDragging: true,
      showAlternatives: false,
      lineOptions: { styles: [{ color: '#f97316', weight: 5, opacity: 0.8 }] },
      router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
      formatter: new L.Routing.Formatter({ units: 'metric' }),
      createMarker: () => null,
      show: false,
    }).addTo(map);
    control.on('routesfound', (e) => {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(1);
      const time = Math.round(route.summary.totalTime / 60);
      setRouteInfo({ distance, time });
      onRouteReady?.({ distance, time });
    });
    routingRef.current = control;
    return clearRouting;
  }, [map, start, end, clearRouting, onRouteReady]);

  return routeInfo ? (
    <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1000, backgroundColor: 'white', borderRadius: 12, padding: '8px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Car size={16} color="#f97316" /> {routeInfo.distance} km</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={16} color="#f97316" /> {routeInfo.time} phút</div>
    </div>
  ) : null;
}

export default function MapClient() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [mapCenter, setMapCenter] = useState([21.0285, 105.8542]);
  const [mapZoom, setMapZoom] = useState(6);
  const [viewMode, setViewMode] = useState('both');
  const [userLocation, setUserLocation] = useState(null);
  const [routingMode, setRoutingMode] = useState(false);
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef();

  const categories = [
    { value: '', label: 'Tất cả', icon: Sparkles },
    { value: 'beach', label: 'Biển', icon: Waves },
    { value: 'mountain', label: 'Núi', icon: Mountain },
    { value: 'city', label: 'Thành phố', icon: Building2 },
    { value: 'culture', label: 'Văn hóa', icon: Landmark },
    { value: 'food', label: 'Ẩm thực', icon: Utensils },
    { value: 'spiritual', label: 'Tâm linh', icon: Church },
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let filtered = [...places];
    if (debouncedSearch) filtered = filtered.filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if (category) filtered = filtered.filter(p => p.category === category);
    setFilteredPlaces(filtered);
    if (search && search.length > 1) {
      const sugg = places.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
      setSuggestions(sugg);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearch, category, places, search]);

  const fetchPlaces = async () => {
    try {
      // SỬA: gọi đúng endpoint public
      const res = await fetch(`${API_URL}/public/places?limit=100`);
      const data = await res.json();
      setPlaces(data.places || []);
      setFilteredPlaces(data.places || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '/image/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return `${API_URL.replace('/api', '')}/uploads/${image}`;
  };

  const handlePlaceClick = (place) => {
    setSelectedId(place._id);
    if (routingMode) {
      if (!routeStart) setRouteStart({ lat: place.lat, lng: place.lng, name: place.name });
      else if (!routeEnd) setRouteEnd({ lat: place.lat, lng: place.lng, name: place.name });
    } else {
      setMapCenter([place.lat, place.lng]);
      setMapZoom(15);
    }
  };

  const handleMarkerClick = (place) => {
    setSelectedId(place._id);
    const el = document.getElementById(`place-${place._id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (routingMode) {
      if (!routeStart) setRouteStart({ lat: place.lat, lng: place.lng, name: place.name });
      else if (!routeEnd) setRouteEnd({ lat: place.lat, lng: place.lng, name: place.name });
    }
  };

  const handleMapClick = (latlng) => {
    if (routingMode) {
      if (!routeStart) setRouteStart({ lat: latlng.lat, lng: latlng.lng, name: 'Điểm chọn' });
      else if (!routeEnd) setRouteEnd({ lat: latlng.lat, lng: latlng.lng, name: 'Điểm chọn' });
    }
  };

  const handleGetUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          setMapZoom(13);
          let minDist = Infinity, nearest = null;
          filteredPlaces.forEach(p => {
            const dist = Math.hypot(p.lat - latitude, p.lng - longitude);
            if (dist < minDist) { minDist = dist; nearest = p; }
          });
          if (nearest) handlePlaceClick(nearest);
        },
        () => alert('Không thể lấy vị trí')
      );
    } else alert('Trình duyệt không hỗ trợ');
  };

  const handleClearRouting = () => {
    setRouteStart(null);
    setRouteEnd(null);
    setRouteInfo(null);
    setRoutingMode(false);
  };

  const SkeletonCard = () => (
    <div style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ width: '100%', height: 140, backgroundColor: '#e5e7eb', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: 12 }}>
        <div style={{ width: '70%', height: 20, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ width: '90%', height: 16, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
      </div>
    </div>
  );

  // Styles (giữ nguyên)
  const containerStyle = { display: 'flex', height: 'calc(100vh - 64px)' };
  const listStyle = {
    width: viewMode === 'map' ? '0%' : viewMode === 'list' ? '100%' : '30%',
    overflowY: 'auto',
    backgroundColor: '#f9fafb',
    padding: viewMode === 'map' ? 0 : 16,
    transition: 'width 0.3s',
  };
  const mapStyle = {
    width: viewMode === 'list' ? '0%' : viewMode === 'map' ? '100%' : '70%',
    height: '100%',
    transition: 'width 0.3s',
  };
  const cardStyle = (isSelected) => ({
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: isSelected ? '0 0 0 2px #f97316, 0 4px 12px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: 16,
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  });
  const cardImageStyle = { width: '100%', height: 140, objectFit: 'cover' };
  const cardContentStyle = { padding: 12 };
  const cardTitleStyle = { fontSize: '1rem', fontWeight: 'bold', marginBottom: 4, color: '#1f2937' };
  const cardRatingStyle = { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#f97316' };
  const filterBarStyle = { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' };
  const searchBoxStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    padding: '8px 16px',
    border: '1px solid #e5e7eb',
    position: 'relative',
  };
  const categoryBtnStyle = (isActive) => ({
    padding: '6px 16px',
    borderRadius: 40,
    backgroundColor: isActive ? '#f97316' : 'white',
    color: isActive ? 'white' : '#374151',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  });
  const toggleButtonStyle = (isActive = false) => ({
    padding: 8,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    backgroundColor: isActive ? '#f97316' : 'white',
    color: isActive ? 'white' : '#374151',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  });
  const suggestionsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    marginTop: 8,
    zIndex: 50,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };
  const suggestionItemStyle = {
    padding: '10px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };
  const routingPanelStyle = {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 'auto',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 1000,
    width: 280,
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <div style={{ width: '30%', padding: 16, overflowY: 'auto' }}>{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
        <div style={{ width: '70%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải bản đồ...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar */}
      <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Bản đồ du lịch</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setViewMode('both')} style={toggleButtonStyle(viewMode === 'both')}><Grid3x3 size={18} /> Cả hai</button>
            <button onClick={() => setViewMode('list')} style={toggleButtonStyle(viewMode === 'list')}><List size={18} /> Danh sách</button>
            <button onClick={() => setViewMode('map')} style={toggleButtonStyle(viewMode === 'map')}><MapPin size={18} /> Bản đồ</button>
            <button onClick={() => { if (!routingMode) { setRoutingMode(true); setRouteStart(null); setRouteEnd(null); setRouteInfo(null); } else { handleClearRouting(); } }} style={toggleButtonStyle(routingMode)}>
              <Route size={18} /> {routingMode ? 'Đóng' : 'Tìm đường'}
            </button>
            <button onClick={handleGetUserLocation} style={toggleButtonStyle()}><Navigation size={18} /> Vị trí của tôi</button>
          </div>
        </div>
        <div style={filterBarStyle}>
          <div style={searchBoxStyle}>
            <Search size={18} color="#9ca3af" />
            <input type="text" placeholder="Tìm kiếm địa điểm..." value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} style={{ border: 'none', outline: 'none', marginLeft: 8, flex: 1 }} />
            {showSuggestions && suggestions.length > 0 && (
              <div style={suggestionsStyle}>
                {suggestions.map(s => (
                  <div key={s._id} style={suggestionItemStyle} onClick={() => { setSearch(s.name); setDebouncedSearch(s.name); setShowSuggestions(false); handlePlaceClick(s); }}>
                    <MapPin size={16} color="#f97316" /> <span>{s.name}</span> <span style={{ fontSize: 12, color: '#9ca3af' }}>{s.address}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => {
              const Icon = cat.icon;
              return <button key={cat.value} onClick={() => setCategory(cat.value)} style={categoryBtnStyle(category === cat.value)}><Icon size={16} /> {cat.label}</button>;
            })}
          </div>
        </div>
      </div>

      <div style={containerStyle}>
        {/* List */}
        <div style={listStyle}>
          {filteredPlaces.length === 0 ? <div style={{ textAlign: 'center', padding: 40 }}>Không tìm thấy địa điểm</div> :
            filteredPlaces.map(place => (
              <div key={place._id} id={`place-${place._id}`} style={cardStyle(selectedId === place._id)} onClick={() => handlePlaceClick(place)} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <img src={getImageUrl(place.image)} alt={place.name} style={cardImageStyle} />
                <div style={cardContentStyle}>
                  <div style={cardTitleStyle}>{place.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>{place.address}</div>
                  <div style={cardRatingStyle}><Star size={14} fill="#f97316" stroke="none" /> {place.rating || 0}</div>
                </div>
              </div>
            ))}
        </div>

        {/* Map */}
        <div style={mapStyle}>
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} whenCreated={map => mapRef.current = map}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' />
            {filteredPlaces.map(place => (
              <Marker key={place._id} position={[place.lat, place.lng]} eventHandlers={{ click: () => handleMarkerClick(place) }}>
                <Popup><div style={{ minWidth: 200 }}><img src={getImageUrl(place.image)} alt={place.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} /><div style={{ fontWeight: 'bold' }}>{place.name}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{place.address}</div><div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: '#f97316' }}><Star size={12} fill="#f97316" stroke="none" /> {place.rating || 0}</div><Link href={`/places/${place._id}`} style={{ display: 'block', marginTop: 8, textAlign: 'center', backgroundColor: '#f97316', color: 'white', padding: '4px 8px', borderRadius: 20, textDecoration: 'none', fontSize: 12 }}>Xem chi tiết</Link></div></Popup>
              </Marker>
            ))}
            <MapController center={mapCenter} zoom={mapZoom} />
            {userLocation && <Marker position={[userLocation.lat, userLocation.lng]}><Popup>Vị trí của bạn</Popup></Marker>}
            {routingMode && routeStart && routeEnd && <RoutingControl start={routeStart} end={routeEnd} onRouteReady={info => setRouteInfo(info)} />}
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>

          {/* Routing panel */}
          {routingMode && (
            <div style={routingPanelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><span style={{ fontWeight: 'bold' }}>Tìm đường đi</span><button onClick={handleClearRouting} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button></div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ width: 24, height: 24, backgroundColor: '#f97316', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>A</span><span>{routeStart ? (routeStart.name || `${routeStart.lat.toFixed(4)}, ${routeStart.lng.toFixed(4)}`) : 'Chọn điểm bắt đầu'}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 24, height: 24, backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>B</span><span>{routeEnd ? (routeEnd.name || `${routeEnd.lat.toFixed(4)}, ${routeEnd.lng.toFixed(4)}`) : 'Chọn điểm kết thúc'}</span></div>
              </div>
              {routeInfo && <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12, display: 'flex', gap: 16 }}><div><Car size={16} color="#f97316" /> {routeInfo.distance} km</div><div><Clock size={16} color="#f97316" /> {routeInfo.time} phút</div></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}