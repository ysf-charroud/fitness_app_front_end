import api from "@/services/axios/axiosClient";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";

const useFetchPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [periodMin, setPeriodMin] = useState("");
  const [periodMax, setPeriodMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const filtersRef = useRef({ searchQuery, periodMin, periodMax, priceMin, priceMax, activeFilter });

  useEffect(() => {
    filtersRef.current = { searchQuery, periodMin, periodMax, priceMin, priceMax, activeFilter };
  }, [searchQuery, periodMin, periodMax, priceMin, priceMax, activeFilter]);

  const fetchPrograms = useCallback(
    async (pageNum, filter, search, periodMinVal, periodMaxVal, priceMinVal, priceMaxVal) => {
      if (!user?._id) return;

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          creator: user._id,
          page: pageNum.toString(),
          limit: limit.toString(),
        });

        if (search?.trim()) {
          params.append("search", search.trim());
        }

        if (filter !== "all") {
          params.append("active", filter === "active" ? "true" : "false");
        }

        const periodMin = periodMinVal ? parseInt(periodMinVal, 10) : null;
        const periodMax = periodMaxVal ? parseInt(periodMaxVal, 10) : null;

        if (periodMin !== null && !isNaN(periodMin)) {
          params.append("period[gt]", periodMin.toString());
        }
        if (periodMax !== null && !isNaN(periodMax)) {
          params.append("period[lt]", periodMax.toString());
        }

        const priceMin = priceMinVal ? parseInt(priceMinVal, 10) : null;
        const priceMax = priceMaxVal ? parseInt(priceMaxVal, 10) : null;

        if (priceMin !== null && !isNaN(priceMin)) {
          params.append("price[gt]", priceMin.toString());
        }
        if (priceMax !== null && !isNaN(priceMax)) {
          params.append("price[lt]", priceMax.toString());
        }

        const response = await api.get(`/api/programs?${params.toString()}`);
        const { data } = response;

        setPrograms(data.records || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setStartIndex(data.startIndex || 0);
        setEndIndex(data.endIndex || 0);
        setPage(data.page || pageNum);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError(err.message);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    },
    [user?._id, limit]
  );

  useEffect(() => {
    if (!user?._id) return;
    const { searchQuery: sq, periodMin: pMin, periodMax: pMax, priceMin: prMin, priceMax: prMax, activeFilter: af } = filtersRef.current;
    fetchPrograms(page, af, sq, pMin, pMax, prMin, prMax);
  }, [page, activeFilter, user?._id, fetchPrograms]);

  useEffect(() => {
    if (!user?._id) return;
    
    const timer = setTimeout(() => {
      const currentPage = page;
      if (currentPage !== 1) {
        setPage(1);
      } else {
        const { searchQuery: sq, periodMin: pMin, periodMax: pMax, priceMin: prMin, priceMax: prMax, activeFilter: af } = filtersRef.current;
        fetchPrograms(1, af, sq, pMin, pMax, prMin, prMax);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, periodMin, periodMax, priceMin, priceMax]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      goToPage(page - 1);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handlePeriodChange = (min, max) => {
    setPeriodMin(min);
    setPeriodMax(max);
  };

  const handlePriceChange = (min, max) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  const createProgram = async (data) => {
    try {
      const { data: program } = await api.postForm("/api/programs", data);
      await fetchPrograms(page, activeFilter, searchQuery, periodMin, periodMax, priceMin, priceMax);
      return program;
    } catch (e) {
      console.error("Error creating program:", e);
      throw e;
    }
  };
  
  const updateProgram = async (id, data) => {
    try {
      const { data: program } = await api.put(`/api/programs/${id}`, data);
      setPrograms((prev) => prev.map((p) => (p._id === id || p.id === id) ? program : p));
      return program;
    } catch (e) {
      console.error("Error updating program:", e);
      throw e;
    }
  };
  const deleteProgram = async (id) => {
    try {
      await api.delete(`/api/programs/${id}`);
      setPrograms((prev) => prev.filter((p) => (p._id || p.id) !== id));
      setTotal((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (e) {
      console.error("Error deleting program:", e);
      throw e;
    }
  };

  return {
    programs,
    searchQuery,
    activeFilter,
    page,
    limit,
    total,
    totalPages,
    startIndex,
    endIndex,
    loading,
    error,
    setSearchQuery: handleSearchChange,
    setActiveFilter: handleFilterChange,
    goToPage,
    nextPage,
    previousPage,
    refetch: () => fetchPrograms(page, activeFilter, searchQuery, periodMin, periodMax, priceMin, priceMax).catch(() => {}),
    periodMin,
    periodMax,
    setPeriodMin,
    setPeriodMax,
    onPeriodChange: handlePeriodChange,
    priceMin,
    priceMax,
    setPriceMin,
    setPriceMax,
    onPriceChange: handlePriceChange,
    createProgram,
    updateProgram,
    deleteProgram,
  };
};

export default useFetchPrograms;
