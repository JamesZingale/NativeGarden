"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const states = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export default function PlantsPage() {
  const router = useRouter();

  const [selectedState, setSelectedState] = useState("");
  const [plants, setPlants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [sun, setSun] = useState("");
  const [soil, setSoil] = useState("");
  const [growth, setGrowth] = useState("");
  const [color, setColor] = useState("");

  const fetchPlants = async (state, pageNum = 1) => {
    if (!state) return;

    const query = new URLSearchParams({
      state,
      page: pageNum,
      search,
      sun,
      soil,
      growth,
      color
    });

    const res = await fetch(`/api/plants/by-state?${query}`);
    const data = await res.json();

    setPlants(data.plants || []);
    setTotalPages(data.totalPages || 1);
    setPage(pageNum);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);

    if (!state) {
      setPlants([]);
      return;
    }

    fetchPlants(state, 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-7xl">

        {/* CONTROLS */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 space-y-4">

          <h1 className="text-2xl font-bold">Browse Native Plants</h1>

          {/* STATE */}
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          {/* SEARCH */}
          <input
            placeholder="Search plant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          {/* FILTERS */}
          <div className="grid grid-cols-4 gap-4">

            <select
              value={sun}
              onChange={(e) => setSun(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Sun Exposure</option>
              <option value="Sun">Sun</option>
              <option value="Part Shade">Part Shade</option>
              <option value="Shade">Shade</option>
            </select>

            <select
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Soil Moisture</option>
              <option value="Dry">Dry</option>
              <option value="Moist">Moist</option>
              <option value="Wet">Wet</option>
            </select>

            <select
              value={growth}
              onChange={(e) => setGrowth(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Growth Rate</option>
              <option value="Slow">Slow</option>
              <option value="Moderate">Moderate</option>
              <option value="Fast">Fast</option>
            </select>

            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Flower Color</option>
              <option value="Yellow">Yellow</option>
              <option value="White">White</option>
              <option value="Purple">Purple</option>
              <option value="Red">Red</option>
            </select>

          </div>

          {/* APPLY BUTTON */}
          <button
            onClick={() => fetchPlants(selectedState, 1)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Apply Filters
          </button>

        </div>

        {/* GRID */}
        {plants.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h2 className="text-xl font-semibold mb-6">
              Plants in {selectedState}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px"
              }}
            >
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  onClick={() => router.push(`/plant/${plant.id}`)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "transform 0.1s ease, box-shadow 0.1s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                >
                  <p style={{ fontWeight: "600", fontSize: "16px" }}>
                    {plant.common_name}
                  </p>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      fontStyle: "italic",
                      marginTop: "4px"
                    }}
                  >
                    {plant.scientific_name}
                  </p>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-6 mt-8">

              <button
                onClick={() => fetchPlants(selectedState, page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-lg font-medium">
                Page {page} / {totalPages}
              </span>

              <button
                onClick={() => fetchPlants(selectedState, page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}