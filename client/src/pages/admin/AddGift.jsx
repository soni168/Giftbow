import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddGift() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "unisex",
    occasion: "birthday",
    buyLink: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (image) formData.append("image", image);

      await axios.post("/api/admin/gifts", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Add New Gift 🎁
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-[#242424] rounded-2xl p-6 border border-coral/10 dark:border-white/5 shadow-sm">

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 block">Gift Image</label>
          <div className="border-2 border-dashed border-coral/30 rounded-xl p-4 text-center cursor-pointer hover:border-coral transition-colors"
            onClick={() => document.getElementById("imageInput").click()}>
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <div className="py-8">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-400 text-sm">Click to upload image</p>
              </div>
            )}
          </div>
          <input id="imageInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral dark:text-white" />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral dark:text-white resize-none" />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Price (₹)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required
            className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral dark:text-white" />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral dark:text-white">
            <option value="men">Him 👨</option>
            <option value="women">Her 👩</option>
            <option value="unisex">Unisex ✨</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Occasion</label>
          <select name="occasion" value={form.occasion} onChange={handleChange}
            className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral dark:text-white">
            <option value="birthday">🎂 Birthday</option>
            <option value="anniversary">💑 Anniversary</option>
            <option value="festival">🎉 Festival</option>
            <option value="wedding">💍 Wedding</option>
            <option value="just because">💝 Just Because</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Buy Link</label>
          <input name="buyLink" value={form.buyLink} onChange={handleChange} required
            placeholder="https://amazon.in/..."
            className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral dark:text-white" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-coral text-white font-bold py-3 rounded-xl hover:bg-coral/90 transition-colors disabled:opacity-50">
          {loading ? "Adding..." : "Add Gift 🎁"}
        </button>
      </form>
    </div>
  );
}

export default AddGift;