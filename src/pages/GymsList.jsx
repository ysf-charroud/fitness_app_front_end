// page/GymsList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGyms } from "@/services/redux/slices/gymsSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GymsList() {
  const dispatch = useDispatch();
  const { items: gyms, loading, error } = useSelector((state) => state.gyms);

  const [search, setSearch] = useState("");
  const [activity, setActivity] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // Build activity options from loaded gyms
  const activityOptions = useMemo(() => {
    const set = new Set();
    (gyms || []).forEach((g) => (g.activities || []).forEach((a) => a && set.add(String(a))));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [gyms]);

  // Filter + search
  const filtered = useMemo(() => {
    let list = Array.isArray(gyms) ? gyms : [];
    if (activity !== "all") {
      list = list.filter((g) => Array.isArray(g.activities) && g.activities.includes(activity));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((g) =>
        (g.name || "").toLowerCase().includes(q) ||
        (g.location || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [gyms, activity, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const visible = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  useEffect(() => {
    // Reset to first page if filters change
    setPage(1);
  }, [activity, search]);

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">All Gyms</h1>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or location..."
          className="max-w-md"
        />
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by activity" />
          </SelectTrigger>
          <SelectContent>
            {activityOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt === "all" ? "All Activities" : opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="mt-6">Loading gyms…</div>
      ) : error ? (
        <div className="mt-6 text-red-600">Failed to load gyms</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {visible.map((gym, i) => (
              <div
                key={gym._id || i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={(gym.photos && gym.photos[0]) || "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={gym.name || "Gym"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {gym.name || "Gym"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {gym.location || ""}
                  </p>
                  {typeof gym.pricing !== "undefined" && (
                    <p className="text-gray-700 text-sm mt-1">
                      {`$${Number(gym.pricing).toFixed(2)}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((v) => Math.max(1, v - 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                  const p = idx + 1;
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext onClick={() => setPage((v) => Math.min(totalPages, v + 1))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}