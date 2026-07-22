import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CreditCardIcon, ChevronLeftIcon, ChevronRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await paymentService.getHistory({ page, limit: 10 });
      if (res.success && res.data) {
        setPayments(res.data.payments);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPayments(newPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <CreditCardIcon className="w-8 h-8 text-amber-400" />
          <span>Payment & Order History</span>
        </h1>
        <p className="text-sm text-slate-400">Track all your Razorpay orders, package purchases, and VIP activations</p>
      </div>

      {/* History Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <LoadingSpinner text="Fetching payment transactions..." />
        ) : payments.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-4xl">💳</div>
            <p className="text-lg font-bold text-white">No payment transactions yet</p>
            <p className="text-xs text-slate-400">Purchases of Coin Packs or VIP Pass will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase font-black text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Payment ID</th>
                  <th className="py-4 px-6">Item / Package</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Gateway</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/50 transition">
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-300">
                      {item.orderId}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-purple-400">
                      {item.paymentId || 'N/A'}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {item.packageName}
                      {item.coinsAdded > 0 && (
                        <span className="text-xs text-amber-400 block font-normal">
                          +{item.coinsAdded.toLocaleString()} Coins
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-black text-amber-300">
                      ₹{item.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                        {item.gateway || 'Razorpay'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {item.status === 'completed' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase flex items-center space-x-1 w-max">
                          <ShieldCheckIcon className="w-3.5 h-3.5" />
                          <span>COMPLETED</span>
                        </span>
                      )}
                      {item.status === 'created' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                          CREATED
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                          FAILED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total orders)
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

export default PaymentHistory;
