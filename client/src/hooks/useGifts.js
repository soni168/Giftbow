import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API = "/api";

const useGifts = (filters = {}) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  // Reset when filters change
  useEffect(() => {
    setGifts([]);
    setPage(1);
    setHasMore(true);
  }, [filters.category, filters.occasion, filters.minPrice, filters.maxPrice, filters.trending]);

  // Fetch gifts whenever page or filters change
  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.occasion) params.append("occasion", filters.occasion);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.trending) params.append("trending", true);
        params.append("page", page);
        params.append("limit", 20);

        const { data } = await axios.get(`${API}/gifts?${params}`, {
          withCredentials: true,
        });

        setGifts((prev) => {
          if (page === 1) return data.gifts;
          const existingIds = new Set(prev.map((g) => g._id));
          const newGifts = data.gifts.filter((g) => !existingIds.has(g._id));
          return [...prev, ...newGifts];
        });
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [page, filters.category, filters.occasion, filters.minPrice, filters.maxPrice, filters.trending]);

  // Infinite scroll — observe last element
  const lastGiftRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  return { gifts, loading, error, hasMore, lastGiftRef };
};

export default useGifts;