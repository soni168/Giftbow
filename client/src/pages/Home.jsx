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

function Home() {
  const [filters, setFilters] = useState({});
  const { gifts, loading, error, hasMore, lastGiftRef } = useGifts(filters);
  const { gifts: trending } = useGifts({ trending: true });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
          Find the{" "}
          <span className="text-coral">perfect</span>{" "}
          gift 🎁
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg">
          Confuse about what to gift... Visit GiftBow!!
        </p>
      </div>

      {/* Trending Strip */}
      {trending.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-4">
            🔥 Trending Right Now
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {trending.slice(0, 6).map((gift) => (
              <div key={gift._id} className="min-w-50">
                <GiftCard gift={gift} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Filters Sidebar */}
        <div className="lg:w-64 shrink-0">
          <Filters filters={filters} setFilters={setFilters} />
        </div>

        {/* Gift Grid */}
        <div className="flex-1">
          {error ? (
            <div className="text-center text-red-500 py-20">
              Kuch error aa gaya 😅 Dobara try karo!
            </div>
          ) : gifts.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎁</div>
              <p className="text-gray-500 dark:text-gray-400">
                Koi gift nahi mila — filters change karo!
              </p>
            </div>
          ) : (
            <>
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex gap-4"
                columnClassName="flex flex-col gap-4"
              >
                {gifts.map((gift, index) => {
                  const isLast = index === gifts.length - 1;
                  return (
                    <div key={gift._id} ref={isLast ? lastGiftRef : null}>
                      <GiftCard gift={gift} />
                    </div>
                  );
                })}
              </Masonry>

              {/* Loading spinner — neeche scroll karne par */}
              {loading && (
                <div className="flex justify-center items-center py-10">
                  <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Sab gifts load ho gaye */}
              {!hasMore && !loading && gifts.length > 0 && (
                <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm">
                  🎁 Choose Filter For Your choice...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;