import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gameService } from '../../services/gameService';
import { walletService } from '../../services/walletService';
import StatCard from '../../components/ui/StatCard';
import toast from 'react-hot-toast';
import {
  CurrencyDollarIcon,
  TrophyIcon,
  SparklesIcon,
  ShoppingBagIcon,
  ClockIcon,
  GiftIcon,
  PlayIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user, updateUserState } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [walletInfo, setWalletInfo] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [transRes, walletRes] = await Promise.all([
          walletService.getTransactions({ page: 1, limit: 5 }),
          walletService.getBalance()
        ]);

        if (transRes.success && transRes.data.transactions) {
          setRecentTransactions(transRes.data.transactions);
        }
        if (walletRes.success && walletRes.data) {
          setWalletInfo(walletRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard wallet data:', err);
      }
    };
    fetchWalletData();
  }, []);

  // Level & XP calculations
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const currentLevelXp = xp % 100;
  const xpProgressPercent = currentLevelXp;

  // Stats calculation
  const totalGames = user?.totalGames || 0;
  const totalWins = user?.totalWins || 0;
  const totalLosses = user?.totalLosses || 0;
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  const handleClaimDaily = async () => {
    setClaiming(true);
    try {
      const res = await gameService.claimDailyReward();
      if (res.success) {
        toast.success(`Claimed +${res.data.coinsAdded} Daily Bonus Coins! 🎁`);
        updateUserState({
          coins: res.data.newBalance,
          dailyRewardClaimedAt: res.data.dailyRewardClaimedAt
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Daily reward not ready yet.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4">
      {/* Top Banner Profile Summary */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-purple-500/20">
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
            </div>
            {user?.vip && (
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase border border-slate-950 shadow">
                VIP
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.username}</h1>
              {user?.vip && (
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 uppercase shadow-md">
                  Lifetime VIP Badge
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </p>

            {/* Level & XP Progress bar */}
            <div className="pt-2 w-48 sm:w-64">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Level {level}</span>
                <span className="text-purple-400">{currentLevelXp} / 100 XP</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                  style={{ width: `${xpProgressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Bonus Claim Button */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-end space-y-2">
          <button
            onClick={handleClaimDaily}
            disabled={claiming}
            className="w-full md:w-auto glow-btn-gold text-slate-950 px-6 py-3.5 rounded-2xl font-black text-base flex items-center justify-center space-x-2 shadow-lg"
          >
            <GiftIcon className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>{user?.vip ? 'Claim 500 VIP Coins' : 'Claim 250 Daily Coins'}</span>
          </button>
          <span className="text-[11px] text-slate-400">Claimable once every 24 hours</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Virtual Coins"
          value={user?.coins?.toLocaleString() || 0}
          subtitle="Gaming Balance"
          icon={CurrencyDollarIcon}
          color="amber"
        />
        <StatCard
          title="Wallet Balance"
          value={`₹${walletInfo?.walletBalance || user?.walletBalance || 0}`}
          subtitle={`₹${walletInfo?.totalDeposits || user?.totalDeposits || 0} Total Paid`}
          icon={BanknotesIcon}
          color="emerald"
        />
        <StatCard
          title="Level & XP"
          value={`Lvl ${level}`}
          subtitle={`${xp} Total XP`}
          icon={TrophyIcon}
          color="purple"
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          subtitle={`${totalWins} Wins / ${totalGames} Games`}
          icon={SparklesIcon}
          color="blue"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/game"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-purple-500/40 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              🎲
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300">Play Dice Game</h3>
              <p className="text-xs text-slate-400 mt-1">Roll for up to 3x payout rewards</p>
            </div>
          </Link>

          <Link
            to="/store"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <ShoppingBagIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300">Coin Store</h3>
              <p className="text-xs text-slate-400 mt-1">Buy 5,000+ coins via Razorpay</p>
            </div>
          </Link>

          <Link
            to="/vip"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition">
              <SparklesIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-yellow-300">VIP Pass</h3>
              <p className="text-xs text-slate-400 mt-1">Unlock 2x Daily Coins & Badges</p>
            </div>
          </Link>

          <Link
            to="/payment-history"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <CreditCardIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300">Payment History</h3>
              <p className="text-xs text-slate-400 mt-1">View orders & transaction receipts</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Ledger Transactions Summary */}
      {recentTransactions.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Transactions Log</h2>
            <Link to="/payment-history" className="text-xs font-extrabold text-amber-400 hover:underline">
              View All Payments &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-slate-500 uppercase font-extrabold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Reference</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-bold text-white">{tx.type}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">₹{tx.amount}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{tx.reference || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
