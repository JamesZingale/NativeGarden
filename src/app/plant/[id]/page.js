"use client";
import { useEffect, useState } from "react";

export default function PlantPage({ params }) {
  const [plant, setPlant] = useState(null);
  const [plantId, setPlantId] = useState(null);

  useEffect(() => {
    async function load() {
      const resolvedParams = await params; // <-- FIX HERE
      setPlantId(resolvedParams.id);
    }

    load();
  }, [params]);

  useEffect(() => {
    if (!plantId) return;

    fetch(`/api/plants/${plantId}`)
      .then(res => res.json())
      .then(data => setPlant(data));
  }, [plantId]);

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-2">
          {plant.common_name}
        </h1>

        <p className="text-gray-600 italic mb-6">
          {plant.scientific_name}
        </p>

        <div className="space-y-2">
          <p><strong>Plant Type:</strong> {plant.plant_type}</p>
          <p><strong>Family:</strong> {plant.plant_family}</p>
          <p><strong>State:</strong> {plant.state}</p>
          <p><strong>Sun Exposure:</strong> {plant.sun_exposure}</p>
          <p><strong>Soil Moisture:</strong> {plant.soil_moisture}</p>
          <p><strong>Growth Rate:</strong> {plant.growth_rate}</p>
          <p><strong>Flower Color:</strong> {plant.flower_color}</p>
        </div>

      </div>
    </div>
  );
}