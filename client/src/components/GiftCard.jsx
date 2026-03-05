import { useState } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const API = "/api";

function GiftCard({ gift }) {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(
    user?.savedGifts?.includes(gift._id) || false
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data } = await axios.post(
        `${API}/gifts/${gift._id}/save`,
        {},
        { withCredentials: true }
      );
      setSaved(data.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBuyClick = async () => {
    try {
      await axios.post(`${API}/gifts/${gift._id}/click`, {});
    } catch (err) {
      console.error(err);
    }
    window.open(gift.buyLink, "_blank");
  };

  return (
    <div className="group relative bg-white dark:bg-[#242424] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#F26076]/10 dark:border-white/5">

      {/* Image — fixed height */}
      <div className="relative overflow-hidden h-44 sm:h-48">
        <img
          src={gift.imageUrl}
          alt={gift.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Trending Badge */}
        {gift.isTrending && (
          <span className="absolute top-3 left-3 bg-[#F26076] text-white text-xs font-bold px-2 py-1 rounded-full">
            🔥 Trending
          </span>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !user}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 flex items-center justify-center hover:scale-110 transition-transform"
        >
          {saved ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-display font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-1">
          {gift.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
          {gift.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-[#458B73] text-sm">
            ₹{gift.price.toLocaleString()}
          </span>
          <button
            onClick={handleBuyClick}
            className="text-xs font-bold bg-[#F26076] text-white px-3 py-1.5 rounded-full hover:bg-[#e04f65] transition-colors"
          >
            Buy Now
          </button>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <span className="text-xs bg-[#FF9760]/10 text-[#FF9760] px-2 py-0.5 rounded-full capitalize">
            {gift.occasion}
          </span>
          <span className="text-xs bg-[#458B73]/10 text-[#458B73] px-2 py-0.5 rounded-full capitalize">
            {gift.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GiftCard;