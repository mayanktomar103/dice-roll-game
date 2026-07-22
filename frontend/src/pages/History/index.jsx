import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';

const History = () => {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async (page = 1, resultFilter = filter) => {
    setLoading(true);
    try {
      const res = await gameService.getHistory({ page, limit: 10, result: resultFilter || undefined });
      if (res.success && res.data) {
        setHistory(res.data.history);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, filter);
  }, [filter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchHistory(newPage, filter);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <ClockIcon className="w-8 h-8 text-purple-400" />
            <span>Game History</span>
          </h1>
          <p className="text-sm text-slate-400">Review all your previous dice rolls and payout results</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === '' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('win')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'win' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wins
          </button>
          <button
            onClick={() => setFilter('return')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'return' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Returned
          </button>
          <button
            onClick={() => setFilter('lose')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'lose' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Losses
          </button>
        </div>
      </div>

      {/* History Table Container */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <LoadingSpinner text="Fetching game history..." />
        ) : history.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-4xl">🎲</div>
            <p className="text-lg font-bold text-white">No game history found</p>
            <p className="text-xs text-slate-400">Start playing the Dice Game to build your history log!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase font-black text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Bet</th>
                  <th className="py-4 px-6 text-center">Dice Rolled</th>
                  <th className="py-4 px-6">Outcome</th>
                  <th className="py-4 px-6">Reward</th>
                  <th className="py-4 px-6">XP Earned</th>
                  <th className="py-4 px-6">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/50 transition">
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {item.bet.toLocaleString()} Coins
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-purple-500/30 text-white font-black">
                        {item.dice}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {item.result === 'win' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          WIN ({item.dice === 6 ? '3X' : '2X'})
                        </span>
                      )}
                      {item.result === 'return' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                          RETURNED
                        </span>
                      )}
                      {item.result === 'lose' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                          LOSS
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-amber-300">
                      +{item.reward.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-purple-400 font-semibold text-xs">
                      +{item.xpEarned} XP
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-200">
                      {item.balanceAfter.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total games)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition"
              >
                <ChevronLeftIcon className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition"
              >
                <ChevronRightIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
