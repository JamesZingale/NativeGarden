"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    latitude: "",
    longitude: "",
    location_name: ""
  });

  const [gettingLocation, setGettingLocation] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 📍 AUTO LOCATION
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setForm((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));

        setGettingLocation(false);
      },
      (err) => {
        console.error(err);
        alert("Failed to get location");
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null
      })
    });

    const data = await res.json();

    if (data.message) {
      router.push("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          {/* LOCATION NAME */}
          <input
            name="location_name"
            placeholder="City (optional, e.g. Akron, Ohio)"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          {/* LAT/LNG MANUAL INPUT */}
          <div className="flex gap-2">
            <input
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-lg"
            />
            <input
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-lg"
            />
          </div>

          {/* AUTO LOCATION BUTTON */}
          <button
            type="button"
            onClick={handleGetLocation}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            {gettingLocation ? "Getting location..." : "Use My Location"}
          </button>

          {/* STATUS */}
          {(form.latitude && form.longitude) && (
            <p className="text-sm text-green-600 text-center">
              Location set ✓ ({form.latitude}, {form.longitude})
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
          >
            Sign Up
          </button>

        </form>
      </div>
    </div>
  );
}