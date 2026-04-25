"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <div className="font-bold text-lg">Native Garden</div>

      <div className="space-x-4">
        {user ? (
          <>
            <span className="font-medium">{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="hover:underline">Login</a>
            <a href="/signup" className="hover:underline">Sign Up</a>
          </>
        )}
      </div>
    </div>
  );
}