import { useEffect, useMemo, useState } from "react";
import ProgramCard from "@/components/PorgramCard";
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [goal, setGoal] = useState("all");
  const [sort, setSort] = useState("new");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/programs", {
          params: { page, limit, goal: goal === "all" ? undefined : goal, q: search, sort },
        });
        const list = Array.isArray(data) ? data : (data?.programs || data?.data || []);
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
  }, [page, limit, goal, search, sort]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const visible = useMemo(() => items, [items]);

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">All Programs</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by name or goal…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
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
        <div>Loading programs…</div>
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


