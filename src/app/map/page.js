"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// 🚨 THIS FIXES "window is not defined"
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false
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
      <MapView users={users} router={router} />
    </div>
  );
}