import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Admin Dashboard 👑
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome, {user?.name}! Yahan se sab manage karo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/add"
          className="bg-white dark:bg-[#242424] rounded-2xl p-6 border border-coral/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="text-4xl mb-4">🎁</div>
          <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-2">Add New Gift</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Naya gift add karo — image, details, buy link sab!</p>
        </Link>

        <Link to="/admin/manage"
          className="bg-white dark:bg-[#242424] rounded-2xl p-6 border border-coral/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="text-4xl mb-4">⚙️</div>
          <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-2">Manage Gifts</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gifts edit karo, delete karo, trending mark karo!</p>
        </Link>

        <Link to="/admin/fetch"
          className="bg-white dark:bg-[#242424] rounded-2xl p-6 border border-coral/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="text-4xl mb-4">🔄</div>
          <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-2">Fetch New Gifts</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Amazon se naye trending gifts fetch karo!</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;