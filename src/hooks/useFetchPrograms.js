import api from "@/services/axios/axiosClient";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

const useFetchPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const fetchPrograms = useCallback(async (pageNum, filter, search) => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        creator: user._id,
        page: pageNum.toString(),
        limit: limit.toString(),
      });

      // Add search query if provided
      if (search?.trim()) {
        params.append("search", search.trim());
      }

      // Add active filter if not "all"
      if (filter !== "all") {
        params.append("active", filter === "active" ? "true" : "false");
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
  }, [user?._id, limit]);

  useEffect(() => {
    fetchPrograms(page, activeFilter, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeFilter, user?._id, fetchPrograms]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1); // Reset to first page on search
      } else {
        fetchPrograms(1, activeFilter, searchQuery);
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
    refetch: () => fetchPrograms(page, activeFilter, searchQuery),
  };
};

export default useFetchPrograms;
