"use client";

import L from "leaflet";
import { Navigation } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import "leaflet/dist/leaflet.css";

import { colors } from "@/design/tokens";

import type { Coordinates, RecyclePoint } from "../types";

// Lucide "leaf" path, inlined so the marker can be built as a Leaflet divIcon.
const LEAF_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
       fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>`;

// Marker icons use inline styles (not Tailwind) because Leaflet injects the
// HTML outside of React, and the icon must be self-contained.
const pointIcon = L.divIcon({
  className: "",
  html: `<div style="width:30px;height:30px;border-radius:15px;background:${colors.primary};
    display:flex;align-items:center;justify-content:center;border:2px solid #fff;
    box-shadow:0 2px 4px rgba(0,0,0,0.3);">${LEAF_SVG}</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:8px;background:${colors.info};
    border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface Props {
  center: Coordinates;
  user: Coordinates | null;
  points: RecyclePoint[];
  onSelect: (point: RecyclePoint) => void;
  centerOnUserLabel: string;
  /** Overlays (count badge, loading pill, point card) rendered above the map. */
  children?: ReactNode;
}

/**
 * Vanilla Leaflet with an explicit lifecycle: the map is created on mount and
 * destroyed on unmount. react-leaflet's MapContainer breaks under Next.js Fast
 * Refresh ("Map container is being reused by another instance" on every save);
 * owning the init/cleanup ourselves makes hot reloads tear down cleanly.
 */
export default function RecycleMap({
  center,
  user,
  points,
  onSelect,
  centerOnUserLabel,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pointsLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // The map centers on `center` once at creation; afterwards the user pans
  // freely and we never snap back behind their back.
  const initialCenter = useRef(center);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: [initialCenter.current.lat, initialCenter.current.lng],
      zoom: 14,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    pointsLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      pointsLayerRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  // Keep the user-location dot in sync with the coords.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !user) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([user.lat, user.lng]);
    } else {
      userMarkerRef.current = L.marker([user.lat, user.lng], {
        icon: userIcon,
        interactive: false,
      }).addTo(map);
    }
  }, [user]);

  // Re-render point markers whenever the data changes.
  useEffect(() => {
    const layer = pointsLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const point of points) {
      L.marker([point.lat, point.lon], { icon: pointIcon })
        .on("click", () => onSelect(point))
        .addTo(layer);
    }
  }, [points, onSelect]);

  function centerOnUser() {
    if (!user) return;
    mapRef.current?.flyTo([user.lat, user.lng], 15, { duration: 0.5 });
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* Center-on-me button */}
      {user && (
        <button
          type="button"
          onClick={centerOnUser}
          aria-label={centerOnUserLabel}
          title={centerOnUserLabel}
          className="border-border-light bg-surface hover:bg-background-secondary absolute right-4 bottom-6 z-1000 flex size-11 items-center justify-center rounded-full border shadow-md transition-colors"
        >
          <Navigation size={20} strokeWidth={2} className="text-primary" />
        </button>
      )}

      {children}
    </div>
  );
}
