import React from "react";

export function Range({ id, min, max, step = 1, value, onValueChange }) {
  return (
    <div className="flex flex-col">
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg accent-neutral-800 cursor-pointer"
      />
      <span className="text-sm mt-1 text-gray-700">{value}</span>
    </div>
  );
}
