import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Masonry from "react-masonry-css";
import GiftCard from "../components/GiftCard";

const API = "/api";

const breakpointColumns = {
  default: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 2,
  480: 1,
};

function Wishlist() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/me`, {
          withCredentials: true,
        });
        setGifts(data.savedGifts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-2">
          My Wishlist ❤️
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Saved gifts — {gifts.length} items
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin" />
        </div>
      ) : gifts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🤍</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            Wishlist Empty..
          </p>
          <Link
            to="/explore"
            className="bg-coral text-white font-bold px-6 py-3 rounded-full hover:bg-coral/90 transition-colors"
          >
            Explore Gifts
          </Link>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          {gifts.map((gift) => (
            <GiftCard key={gift._id} gift={gift} />
          ))}
        </Masonry>
      )}
    </div>
  );
}

export default Wishlist;