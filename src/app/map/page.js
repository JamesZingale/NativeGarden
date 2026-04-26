"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetch("/api/users/map");
    const data = await res.json();
    setUsers(data.users || []);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[39.8283, -98.5795]} // center of US
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {users.map(user => (
          <Marker
            key={user.id}
            position={[user.latitude, user.longitude]}
          >
            <Popup>
              <div>
                <strong>{user.username}</strong>
                <br />
                {user.location_name || "Unknown location"}
                <br />
                <button
                  style={{
                    marginTop: "6px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#16a34a",
                    color: "white",
                    cursor: "pointer"
                  }}
                  onClick={() => router.push(`/user/${user.id}`)}
                >
                  View Garden
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}