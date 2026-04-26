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
    <div style={{
      width: "100%",
      background: "white",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    }}>

      {/* TOP ROW */}
      <div style={{
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div
          style={{ fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Native Garden
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {user ? (
            <>
              <span
                style={{ cursor: "pointer", fontWeight: "500" }}
                onClick={() => router.push(`/user/${user.id}`)}
              >
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  background: "#ef4444",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
            </>
          )}
        </div>
      </div>

      <div style={{
        borderTop: "1px solid #ddd",
        padding: "10px 20px",
        display: "flex",
        gap: "20px",
        background: "#f9fafb"
      }}>
        <button
          onClick={() => router.push("/feed")}
          style={{ cursor: "pointer" }}
        >
          Feed
        </button>

        <button
          onClick={() => router.push("/map")}
          style={{ cursor: "pointer" }}
        >
          Map
        </button>

        <button
          onClick={() => router.push("/plants")}
          style={{ cursor: "pointer" }}
        >
          Plants
        </button>
      </div>

    </div>
  );
}