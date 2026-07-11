"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";

type MapSelection = {
  lat: number;
  lon: number;
  province?: string;
  district?: string;
  subDistrict?: string;
  postalCode?: string;
  addressLine1?: string;
  displayName?: string;
};

type AddressMapPickerProps = {
  value: { lat: number; lng: number } | null;
  selectedLabel?: string;
  onChange: (selection: MapSelection) => void;
};

const DEFAULT_CENTER = { lat: 7.8804, lng: 98.3923 };

export function AddressMapPicker({
  value,
  selectedLabel,
  onChange,
}: AddressMapPickerProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const [selectionLabel, setSelectionLabel] = useState(
    "คลิกบนแผนที่เพื่อเลือกตำแหน่ง"
  );

  useEffect(() => {
    let mounted = true;

    const setupMap = async () => {
      if (!mapNodeRef.current || mapRef.current) {
        return;
      }

      const L = await import("leaflet");
      leafletRef.current = L;

      if (!mounted || !mapNodeRef.current) {
        return;
      }

      const map = L.map(mapNodeRef.current, {
        center: value ? [value.lat, value.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        zoom: value ? 15 : 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const marker = L.marker(
        value ? [value.lat, value.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        {
          draggable: true,
          icon: L.divIcon({
            className: "pg-map-pin-wrapper",
            html: '<span class="pg-map-pin"></span>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        }
      ).addTo(map);

      marker.on("dragend", () => {
        const latLng = marker.getLatLng();
        void resolveSelection(latLng.lat, latLng.lng);
      });

      map.on("click", (event: any) => {
        marker.setLatLng(event.latlng);
        void resolveSelection(event.latlng.lat, event.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
      setMapReady(true);
    };

    const resolveSelection = async (lat: number, lng: number) => {
      setReverseLoading(true);
      setSelectionLabel(`พิกัด ${lat.toFixed(5)}, ${lng.toFixed(5)}`);

      try {
        const response = await fetch(
          `/api/reverse-geocode?lat=${lat}&lon=${lng}`
        );

        if (!response.ok) {
          throw new Error("Reverse geocoding failed");
        }

        const payload = (await response.json()) as MapSelection;
        setSelectionLabel(
          payload.displayName || `พิกัด ${lat.toFixed(5)}, ${lng.toFixed(5)}`
        );
        onChange(payload);
      } catch {
        onChange({ lat, lon: lng });
      } finally {
        setReverseLoading(false);
      }
    };

    void setupMap();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [onChange, value]);

  useEffect(() => {
    if (!value || !mapRef.current || !markerRef.current) {
      return;
    }

    const nextLatLng = [value.lat, value.lng];
    markerRef.current.setLatLng(nextLatLng);
    mapRef.current.setView(nextLatLng, 15);
  }, [value]);

  useEffect(() => {
    if (!selectedLabel) {
      return;
    }

    setSelectionLabel(selectedLabel);
  }, [selectedLabel]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSelectionLabel("เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง");
      return;
    }

    setReverseLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
        }

        try {
          const response = await fetch(
            `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) {
            throw new Error("Reverse geocoding failed");
          }
          const payload = (await response.json()) as MapSelection;
          setSelectionLabel(
            payload.displayName ||
              `พิกัด ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
          );
          onChange(payload);
        } catch {
          onChange({ lat: latitude, lon: longitude });
        } finally {
          setReverseLoading(false);
        }
      },
      () => {
        setReverseLoading(false);
        setSelectionLabel("ไม่สามารถอ่านตำแหน่งปัจจุบันได้");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">{selectionLabel}</span>
          </div>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-primary"
          >
            <LocateFixed className="h-4 w-4" />
            ใช้ตำแหน่งปัจจุบัน
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden border border-slate-200">
        {!mapReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-sm text-slate-500">
            กำลังโหลดแผนที่...
          </div>
        )}
        {reverseLoading && (
          <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs text-slate-600 shadow">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            กำลังค้นหาที่อยู่...
          </div>
        )}
        <div ref={mapNodeRef} className="h-56 w-full bg-slate-100" />
      </div>
    </div>
  );
}
