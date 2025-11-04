import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GymProfile() {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/gyms/${id}`);
        if (mounted) setGym(data);
      } catch (e) {
        if (mounted) setError("Failed to load gym");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [id]);

  if (loading) return <div className="p-6">Loading gym...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!gym) return <div className="p-6">Gym not found.</div>;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{gym.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(gym.photos) && gym.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {gym.photos.slice(0, 4).map((src, i) => (
                  <img key={i} src={src} alt={`photo-${i}`} className="w-full h-56 object-cover rounded-xl" />
                ))}
              </div>
            )}
            <div className="space-y-2">
              {gym.location && <p><span className="font-semibold">Location:</span> {gym.location}</p>}
              {typeof gym.pricing !== "undefined" && <p><span className="font-semibold">Price:</span> ${Number(gym.pricing).toFixed(2)}</p>}
              {Array.isArray(gym.activities) && gym.activities.length > 0 && (
                <p><span className="font-semibold">Activities:</span> {gym.activities.join(", ")}</p>
              )}
              {typeof gym.mix === "boolean" && <p><span className="font-semibold">Mixed:</span> {gym.mix ? "Yes" : "No"}</p>}
              {gym.schedule && <p><span className="font-semibold">Schedule:</span> {gym.schedule}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


