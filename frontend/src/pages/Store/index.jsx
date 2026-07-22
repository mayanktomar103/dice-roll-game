import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';
import { ShoppingBagIcon, CurrencyDollarIcon, SparklesIcon, CheckIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Store = () => {
  const { user, updateUserState } = useAuth();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await paymentService.getPackages();
        if (res.success && res.data.packages) {
          setPacks(res.data.packages);
        }
      } catch (err) {
        console.error('Failed to load coin packs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  const handleRazorpayBuyPack = async (pack) => {
    setPurchasingId(pack._id || pack.name);
    try {
      // 1. Create order on backend
      const res = await paymentService.buyCoinPackOrder({
        amount: pack.price,
        coins: pack.coins,
        packageName: pack.name
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to create order');
      }

      const orderData = res.data;

      // 2. Configure Razorpay modal options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DiceRoll Gaming',
        description: `Purchase ${pack.name} (+${pack.coins?.toLocaleString()} Coins)`,
        order_id: orderData.orderId,
        prefill: {
          name: user?.username || '',
          email: user?.email || ''
        },
        theme: {
          color: '#8b5cf6'
        },
        handler: async function (response) {
          try {
            // 3. Verify signature on backend
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success) {
              toast.success(`🎉 Payment Verified! +${pack.coins?.toLocaleString()} Coins added to your account!`);
              updateUserState({
                coins: verifyRes.data.user.coins,
                walletBalance: verifyRes.data.user.walletBalance
              });
            }
          } catch (verifyErr) {
            toast.error(verifyErr.response?.data?.message || 'Payment verification failed!');
          }
        },
        modal: {
          ondismiss: function () {
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      // Check if Razorpay SDK is loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for environment without live checkout.js
        toast.error('Razorpay SDK not loaded. Verification pending.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Coin purchase failed');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center space-x-3">
          <ShoppingBagIcon className="w-10 h-10 text-amber-400" />
          <span>Coin <span className="text-amber-400">Store</span></span>
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Instant virtual coin credit supporting UPI, GPay, PhonePe, Paytm, Cards & NetBanking via Razorpay.
        </p>
      </div>

      {/* Coin Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packs.map((pack) => (
          <div
            key={pack._id || pack.name}
            className="glass-card glass-card-hover rounded-3xl p-8 border border-amber-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            {pack.badge && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                {pack.badge}
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
                <CurrencyDollarIcon className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{pack.name}</h3>
                <div className="text-3xl font-black text-amber-400 mt-2">
                  +{pack.coins?.toLocaleString()} <span className="text-sm text-amber-300 font-semibold">Coins</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Instant virtual coin credit. Use in all 3D dice rolls with up to 3x payout rewards.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase">Price:</span>
                <span className="text-2xl font-black text-white">₹{pack.price}</span>
              </div>

              <button
                onClick={() => handleRazorpayBuyPack(pack)}
                disabled={purchasingId === (pack._id || pack.name)}
                className="w-full glow-btn-gold text-slate-950 py-3.5 rounded-xl font-black text-base shadow-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{purchasingId === (pack._id || pack.name) ? 'Opening Razorpay...' : `Buy with UPI / Cards (₹${pack.price})`}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Security Disclaimer */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-center space-x-3 text-xs text-slate-400 max-w-2xl mx-auto text-center">
        <ShieldCheckIcon className="w-6 h-6 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Razorpay Secure Payments:</strong> Supports UPI, Google Pay, PhonePe, Paytm, Credit/Debit Cards & NetBanking. All signatures are cryptographically verified by backend.
        </span>
      </div>
    </div>
  );
};

export default Store;
