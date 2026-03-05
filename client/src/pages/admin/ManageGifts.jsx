import { useEffect, useState } from "react";
import axios from "axios";

function ManageGifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const fetchGifts = async () => {
    try {
      const { data } = await axios.get("/api/admin/gifts", { withCredentials: true });
      setGifts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGifts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete karna hai?")) return;
    try {
      await axios.delete(`/api/admin/gifts/${id}`, { withCredentials: true });
      setGifts(gifts.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrending = async (id) => {
    try {
      const { data } = await axios.patch(`/api/admin/gifts/${id}/trending`, {}, { withCredentials: true });
      setGifts(gifts.map((g) => g._id === id ? { ...g, isTrending: data.isTrending } : g));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get("/api/products/refresh");
      alert(data.message);
      fetchGifts();
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Manage Gifts ⚙️
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Total: {gifts.length} gifts</p>
        </div>
        <button onClick={handleRefresh} disabled={fetching}
          className="bg-teal text-white font-bold px-5 py-2.5 rounded-full hover:bg-teal/90 transition-colors disabled:opacity-50">
          {fetching ? "Fetching..." : "🔄 Fetch New Gifts"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gifts.map((gift) => (
            <div key={gift._id} className="bg-white dark:bg-[#242424] rounded-2xl overflow-hidden border border-coral/10 dark:border-white/5 shadow-sm">
              <img src={gift.imageUrl} alt={gift.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-1">
                  {gift.title}
                </h3>
                <p className="text-teal font-bold text-sm mb-3">₹{gift.price.toLocaleString()}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleTrending(gift._id)}
                    className={`flex-1 text-xs font-bold py-2 rounded-full transition-colors ${
                      gift.isTrending ? "bg-yellow-400 text-gray-800" : "bg-yellow-400/10 text-yellow-500 hover:bg-yellow-400/20"
                    }`}>
                    {gift.isTrending ? "🔥 Trending" : "Set Trending"}
                  </button>
                  <button onClick={() => handleDelete(gift._id)}
                    className="flex-1 text-xs font-bold py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors dark:bg-red-900/20">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageGifts;