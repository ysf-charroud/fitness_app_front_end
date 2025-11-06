import { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/services/api";
import SearchBar from "@/components/SearchBar";

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
          params: {
            page,
            limit,
            q: search,
            specialty: specialty === "all" ? undefined : specialty,
          },
        });
        const list = Array.isArray(data) ? data : data?.coaches || [];
        if (mounted) {
          setItems(list);
          setTotal(data?.total || list.length);
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
    return () => (mounted = false);
  }, [page, limit, search, specialty]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const visible = useMemo(() => items, [items]);

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">All Coaches</h1>

      {/* ✅ Connected SearchBar */}
      <SearchBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onCategorySelect={(cat) => {
          setSpecialty(cat);
          setPage(1);
        }}
      />

      {loading ? (
        <div>Loading coaches…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {visible.map((coach, i) => (
              <div
                key={coach._id || i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      coach.image ||
                      coach.avatar ||
                      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400"
                    }
                    alt={coach.name || "Coach"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {coach.name || "Coach"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {coach.specialty || "Fitness"}
                  </p>
                  <div className="mt-4">
                    <a
                      href={`/coaches/${coach._id || coach.id}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      View Profile
                    </a>
                  </div>
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
