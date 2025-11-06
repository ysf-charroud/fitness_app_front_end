import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProgramCard from "@/components/ProgramCard";
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

export default function AllPrograms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const uiPageSize = 9;
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [goal, setGoal] = useState("all");
  const [sort, setSort] = useState("new");
  const requestSeq = useRef(0);
  const initializedFromURL = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Initialize state from URL once
  useEffect(() => {
    if (initializedFromURL.current) return;
    initializedFromURL.current = true;
    const p = Number(searchParams.get("page")) || 1;
    const g = searchParams.get("goal") || "all";
    const s = searchParams.get("sort") || "new";
    const q = searchParams.get("q") || "";
    setPage(Math.max(1, p));
    setGoal(g);
    setSort(s);
    setSearch(q);
    setDebouncedSearch(q.trim());
  }, [searchParams]);

  // Persist filters to URL when they change
  useEffect(() => {
    if (!initializedFromURL.current) return;
    const params = new URLSearchParams();
    if (page && page !== 1) params.set("page", String(page));
    if (goal && goal !== "all") params.set("goal", goal);
    if (sort && sort !== "new") params.set("sort", sort);
    if (debouncedSearch) params.set("q", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [page, goal, sort, debouncedSearch, setSearchParams]);

  useEffect(() => {
    let mounted = true;
    const seq = ++requestSeq.current;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/programs", {
          // Fetch a large chunk and handle filters client-side for consistency
          params: { page: 1, limit: 1000, search: debouncedSearch || undefined },
        });
        const raw = Array.isArray(data) ? data : (data?.records || []);
        // Client-side filter by goal
        const filtered = raw.filter((p) => {
          const byGoal = goal === "all" ? true : Array.isArray(p.goals) && p.goals.includes(goal);
          return byGoal;
        });
        // Client-side sort
        const sorted = [...filtered].sort((a, b) => {
          if (sort === "price_asc") return (a.price ?? 0) - (b.price ?? 0);
          if (sort === "price_desc") return (b.price ?? 0) - (a.price ?? 0);
          // default newest by createdAt desc
          const ad = new Date(a.createdAt || 0).getTime();
          const bd = new Date(b.createdAt || 0).getTime();
          return bd - ad;
        });
        if (mounted && seq === requestSeq.current) {
          setItems(sorted);
          setTotal(sorted.length);
        }
      } catch (e) {
        if (mounted && seq === requestSeq.current) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (mounted && seq === requestSeq.current) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, [goal, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(total / uiPageSize));

  const visible = useMemo(() => {
    const start = (page - 1) * uiPageSize;
    return items.slice(start, start + uiPageSize);
  }, [items, page]);

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">All Programs</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by name or goal…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground px-2"
              onClick={() => { setSearch(""); setDebouncedSearch(""); setPage(1); }}
            >
              ×
            </button>
          )}
        </div>
        <Select value={goal} onValueChange={(v) => { setPage(1); setGoal(v); }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter goal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All goals</SelectItem>
            <SelectItem value="Strength">Strength</SelectItem>
            <SelectItem value="Endurance">Endurance</SelectItem>
            <SelectItem value="Cardio">Cardio</SelectItem>
            <SelectItem value="Weight Loss">Weight Loss</SelectItem>
            <SelectItem value="Flexibility">Flexibility</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => { setPage(1); setSort(v); }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => { setSearch(""); setGoal("all"); setSort("new"); setPage(1); }}>Reset</Button>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border p-4 animate-pulse">
                <div className="h-40 w-full rounded-lg bg-muted mb-4" />
                <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                <div className="h-4 w-1/3 bg-muted rounded mb-4" />
                <div className="h-10 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p, i) => (
              <ProgramCard key={p._id || i} program={p} />
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


