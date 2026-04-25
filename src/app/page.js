"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Native Garden App</h1>

        {user ? (
          <p className="text-green-600">Logged in as {user.username}</p>
        ) : (
          <p className="text-gray-500">Not logged in</p>
        )}
      </div>
    </div>
  );
}
