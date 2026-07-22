import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import StatCard from '../../components/ui/StatCard';
import { UserCircleIcon, TrophyIcon, SparklesIcon, CalendarIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim() || username.length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }

    setUpdating(true);
    try {
      const res = await authService.updateProfile({ username: username.trim() });
      if (res.success && res.data.user) {
        toast.success('Profile updated successfully!');
        updateUserState(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const totalGames = user?.totalGames || 0;
  const totalWins = user?.totalWins || 0;
  const totalLosses = user?.totalLosses || 0;
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-8">
        {/* Header Avatar & Details */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-purple-500/30">
            {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <h1 className="text-3xl font-black text-white">{user?.username}</h1>
              {user?.vip && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 uppercase shadow">
                  VIP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1 pt-1">
              <CalendarIcon className="w-4 h-4 text-purple-400 inline" />
              <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4 max-w-md border-t border-slate-800 pt-6">
          <h2 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider">Account Settings</h2>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className="glow-btn-purple text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:opacity-50"
          >
            {updating ? 'Saving...' : 'Update Username'}
          </button>
        </form>

        {/* Lifetime Statistics */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <h2 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider">Lifetime Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Games Played" value={totalGames} subtitle={`${totalWins} Wins / ${totalLosses} Losses`} icon={TrophyIcon} color="purple" />
            <StatCard title="Win Rate" value={`${winRate}%`} subtitle="Percentage ratio" icon={SparklesIcon} color="emerald" />
            <StatCard title="Total XP" value={user?.xp || 0} subtitle={`Level ${user?.level || 1}`} icon={UserCircleIcon} color="blue" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
