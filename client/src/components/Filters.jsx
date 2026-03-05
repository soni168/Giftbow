function Filters({ filters, setFilters }) {
  const occasions = ["all", "birthday", "anniversary", "festival", "wedding", "just because"];
  const categories = ["all", "men", "women", "unisex"];
  const budgets = [
    { label: "All", min: 0, max: 999999 },
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500–₹1500", min: 500, max: 1500 },
    { label: "₹1500–₹3000", min: 1500, max: 3000 },
    { label: "₹3000+", min: 3000, max: 999999 },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#242424] rounded-2xl p-5 shadow-sm border border-[#F26076]/10 dark:border-white/5">
      
      {/* For */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          For
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: cat === "all" ? "" : cat })}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                (filters.category === cat || (!filters.category && cat === "all"))
                  ? "bg-[#F26076] text-white"
                  : "bg-[#F26076]/10 text-[#F26076] hover:bg-[#F26076]/20"
              }`}
            >
              {cat === "all" ? "Everyone" : cat === "men" ? "👨 Him" : cat === "women" ? "👩 Her" : "✨ Unisex"}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Occasion
        </h3>
        <div className="flex flex-wrap gap-2">
          {occasions.map((occ) => (
            <button
              key={occ}
              onClick={() => setFilters({ ...filters, occasion: occ === "all" ? "" : occ })}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize ${
                (filters.occasion === occ || (!filters.occasion && occ === "all"))
                  ? "bg-[#FF9760] text-white"
                  : "bg-[#FF9760]/10 text-[#FF9760] hover:bg-[#FF9760]/20"
              }`}
            >
              {occ === "birthday" ? "🎂 Birthday"
                : occ === "anniversary" ? "💑 Anniversary"
                : occ === "festival" ? "🎉 Festival"
                : occ === "wedding" ? "💍 Wedding"
                : occ === "just because" ? "💝 Just Because"
                : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Budget
        </h3>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b.label}
              onClick={() => setFilters({ ...filters, minPrice: b.min, maxPrice: b.max })}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                filters.maxPrice === b.max
                  ? "bg-[#458B73] text-white"
                  : "bg-[#458B73]/10 text-[#458B73] hover:bg-[#458B73]/20"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Toggle */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Trending
        </h3>
        <button
          onClick={() => setFilters({ ...filters, trending: !filters.trending })}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            filters.trending
              ? "bg-[#FFD150] text-gray-800"
              : "bg-[#FFD150]/10 text-[#FFD150] hover:bg-[#FFD150]/20"
          }`}
        >
          🔥 Trending Only
        </button>
      </div>
    </div>
  );
}

export default Filters;