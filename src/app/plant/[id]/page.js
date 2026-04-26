"use client";
import { useEffect, useState } from "react";

export default function PlantPage({ params }) {
  const [plant, setPlant] = useState(null);
  const [plantId, setPlantId] = useState(null);

  useEffect(() => {
    async function load() {
      const resolvedParams = await params;
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
        <p className="text-gray-500 text-lg">Loading plant...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-3xl space-y-6">

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h1 className="text-3xl font-bold text-green-700">
            {plant.common_name}
          </h1>

          <p className="text-gray-500 italic mt-1">
            {plant.scientific_name}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <Info label="Plant Type" value={plant.plant_type} />
          <Info label="Family" value={plant.plant_family} />
          <Info label="State" value={plant.state} />
          <Info label="Sun Exposure" value={plant.sun_exposure} />
          <Info label="Soil Moisture" value={plant.soil_moisture} />
          <Info label="Growth Rate" value={plant.growth_rate} />
          <Info label="Flower Color" value={plant.flower_color} />

        </div>

      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}