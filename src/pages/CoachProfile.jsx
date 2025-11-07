import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProgramCard from "@/components/ProgramCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Facebook, Instagram, Linkedin, Globe } from "lucide-react";

export default function CoachProfile() {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // UI state for search/filter/pagination
  const [search, setSearch] = useState("");
  const [goal, setGoal] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/coaches/${id}`);
        const c = data?.data || data?.coach || data;
        if (mounted) setCoach(c);
        // Try to get programs from coach, or fetch by coach id if supported
        const coachPrograms = c?.programs || c?.created_programs || [];
        if (Array.isArray(coachPrograms) && coachPrograms.length) {
          if (mounted) setPrograms(coachPrograms);
        } else {
          try {
            const { data: progsResp } = await api.get("/programs", { params: { coachId: id } });
            const list = Array.isArray(progsResp) ? progsResp : (progsResp?.records || progsResp?.data || []);
            if (mounted) setPrograms(list);
          } catch (_) {
            if (mounted) setPrograms([]);
          }
        }
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message || "Failed to load coach");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, [id]);

  // Reset to first page when filters change (must be declared before any early returns)
  useEffect(() => {
    setPage(1);
  }, [search, goal]);

  if (loading) return <div className="min-h-screen max-w-5xl mx-auto p-6">Loading coach...</div>;
  if (error) return <div className="min-h-screen max-w-5xl mx-auto p-6 text-destructive">{error}</div>;
  if (!coach) return null;

  const fullName = coach.name || coach.fullName || "Coach";
  const avatar = coach.image || coach.avatar;
  const specialty = coach.specialty || coach.expertise || "Fitness";
  const certs = coach.certifications || coach.certs || [];
  const socials = coach.socials || coach.links || coach.social_links || {};
  const goalsSet = Array.from(new Set(programs.flatMap((p) => Array.isArray(p.goals) ? p.goals : [])));

  // Filter + search programs
  const filtered = programs.filter((p) => {
    const matchesSearch = search.trim()
      ? (p.title || "").toLowerCase().includes(search.trim().toLowerCase())
      : true;
    const matchesGoal = goal === "all" ? true : Array.isArray(p.goals) && p.goals.includes(goal);
    return matchesSearch && matchesGoal;
  });
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const visible = filtered.slice((page - 1) * limit, (page - 1) * limit + limit);

  // (moved earlier to satisfy React hooks rules)

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatar} />
          <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold">{fullName}</h1>
          <p className="text-muted-foreground">{specialty}</p>
          {coach.bio && (
            <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{coach.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.isArray(certs) && certs.length > 0 ? (
              certs.map((cert, idx) => (
                <Badge key={idx} variant="secondary">{cert}</Badge>
              ))
            ) : (
              <Badge variant="outline">No certifications listed</Badge>
            )}
          </div>
          {/* Social links */}
          <div className="mt-4 flex items-center gap-3">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {socials.website && (
              <a href={socials.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
        <div>
          <Button asChild variant="outline">
            <Link to="/coaches">Back to Coaches</Link>
          </Button>
        </div>
      </div>

      {/* Personal details */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coach.email && (
          <Card><CardContent className="pt-6"><div className="text-sm"><span className="font-semibold">Email:</span> {coach.email}</div></CardContent></Card>
        )}
        {coach.years_of_experience != null && (
          <Card><CardContent className="pt-6"><div className="text-sm"><span className="font-semibold">Experience:</span> {coach.years_of_experience} years</div></CardContent></Card>
        )}
        {coach.gender && (
          <Card><CardContent className="pt-6"><div className="text-sm"><span className="font-semibold">Gender:</span> {coach.gender}</div></CardContent></Card>
        )}
      </div>

      {/* Programs with search/filter/pagination */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Programs</h2>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter goal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All goals</SelectItem>
              {goalsSet.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">No programs found for this coach.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p, i) => (
              <ProgramCard key={p._id || p.id || i} program={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6">
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
      </div>
    </div>
  );
}
