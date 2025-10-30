import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LocationField({ value, onChange }) {
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        onChange?.({ target: { value: loc } });
      },
      () => alert("Unable to retrieve your location.")
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="location">Location</Label>

      <div className="flex items-center gap-2">
        <Input
          id="location"
          placeholder="Enter your city or region"
          value={value || ""}
          onChange={onChange}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleGetLocation}
          variant="outline"
          className="text-sm"
        >
          Use my location
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        You can type any location or detect automatically.
      </p>
    </div>
  );
}
