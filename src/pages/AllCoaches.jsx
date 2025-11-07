import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/services/api";

export default function AllCoaches() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/coaches", {
          params: { page, limit, specialty: specialty === "all" ? undefined : specialty, q: search },
        });
        const list = Array.isArray(data) ? data : (data?.coaches || data?.data || []);
        if (mounted) {
          setItems(list);
          setTotal(data?.total || data?.count || list.length);
        }
      } catch (e) {
        if (mounted) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, [page, limit, specialty, search]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const visible = useMemo(() => items, [items]);

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">All Coaches</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by name or expertise…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        </div>
        <Select value={specialty} onValueChange={(v) => { setPage(1); setSpecialty(v); }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter specialty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All specialties</SelectItem>
            <SelectItem value="Strength">Strength</SelectItem>
            <SelectItem value="Yoga">Yoga</SelectItem>
            <SelectItem value="Cardio">Cardio</SelectItem>
            <SelectItem value="Pilates">Pilates</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => { setSearch(""); setSpecialty("all"); setPage(1); }}>Reset</Button>
      </div>

      {loading ? (
        <div>Loading coaches…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((coach, i) => (
              <div key={coach._id || i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={coach.image || coach.avatar || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400"}
                    alt={coach.name || coach.fullName || "Coach"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{coach.name || coach.fullName || "Coach"}</h3>
                  <p className="text-gray-600 text-sm">{coach.specialty || coach.expertise || "Fitness"}</p>
                </div>
              </div>
            ))}
          </div>

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


