import { useState } from "react";
import Masonry from "react-masonry-css";
import GiftCard from "../components/GiftCard";
import Filters from "../components/Filters";
import useGifts from "../hooks/useGifts";

const breakpointColumns = {
  default: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 2,
  480: 1,
};

function Explore() {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const { gifts, loading } = useGifts(filters);

  const filtered = gifts.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Explore Gifts 🎀
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Collect Your Choice....
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search gifts..."
          className="w-full max-w-md bg-white dark:bg-[#242424] border border-[#F26076]/20 dark:border-white/10 rounded-full px-5 py-3 text-sm outline-none focus:border-[#F26076] transition-colors dark:text-white placeholder:text-gray-400 shadow-sm"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Filters */}
        <div className="lg:w-64 shrink-0">
          <Filters filters={filters} setFilters={setFilters} />
        </div>

        {/* Grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-4">
            {filtered.length} gifts found
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-[#F26076] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎁</div>
              <p className="text-gray-500 dark:text-gray-400">
                Koi gift nahi mila!
              </p>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex gap-4"
              columnClassName="flex flex-col gap-4"
            >
              {filtered.map((gift) => (
                <GiftCard key={gift._id} gift={gift} />
              ))}
            </Masonry>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;