import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { vipService } from '../../services/vipService';
import toast from 'react-hot-toast';
import { SparklesIcon, CheckCircleIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const VIP = () => {
  const { user, updateUserState } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  const handleRazorpayBuyVip = async () => {
    setPurchasing(true);
    try {
      // 1. Create order on backend
      const res = await paymentService.buyVipOrder();
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to create Razorpay VIP order');
      }

      const orderData = res.data;

      // 2. Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DiceRoll Gaming',
        description: 'Lifetime VIP Membership Access',
        order_id: orderData.orderId,
        prefill: {
          name: user?.username || '',
          email: user?.email || ''
        },
        theme: {
          color: '#f59e0b'
        },
        handler: async function (response) {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success) {
              toast.success('🎉 Congratulations! Lifetime VIP Membership Activated!');
              updateUserState({
                vip: true,
                vipPurchasedAt: new Date()
              });
            }
          } catch (verifyErr) {
            toast.error(verifyErr.response?.data?.message || 'VIP verification failed!');
          }
        },
        modal: {
          ondismiss: function () {
            toast('VIP Checkout cancelled', { icon: 'ℹ️' });
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay SDK not available.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'VIP purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest">
          <StarIcon className="w-4 h-4 text-amber-400" />
          <span>Lifetime Membership</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          DiceRoll <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">VIP Pass</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Elevate your gameplay with exclusive perks, doubled daily rewards, and premium badges.
        </p>
      </div>

      {/* Main VIP Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden space-y-8">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* VIP Status Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30">
              <SparklesIcon className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Lifetime VIP Membership</h2>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                {user?.vip ? 'ACTIVE MEMBERSHIP' : 'ONE-TIME PURCHASE'}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            {user?.vip ? (
              <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-sm uppercase">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span>UNLOCKED FOREVER</span>
              </span>
            ) : (
              <div>
                <span className="text-3xl font-black text-white">₹999</span>
                <span className="text-xs text-slate-400 block">One-time payment</span>
              </div>
            )}
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
            Included VIP Benefits:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Glowing VIP Badge on Dashboard & Profile',
              '2X Daily Bonus Coins (500 coins every 24h)',
              'Unlimited Dice Gaming Access',
              'Exclusive Dark Themes & Micro-animations',
              '100% Ad-Free Gaming Experience',
              'Advanced Winner Statistics & Analytics'
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Action Button */}
        {!user?.vip && (
          <div className="pt-4 text-center">
            <button
              onClick={handleRazorpayBuyVip}
              disabled={purchasing}
              className="w-full sm:w-auto glow-btn-gold text-slate-950 px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-amber-500/20 disabled:opacity-50 transition"
            >
              {purchasing ? 'Opening Razorpay...' : 'Unlock Lifetime VIP (₹999 via Razorpay)'}
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Instant activation via UPI, GPay, PhonePe, Paytm or Cards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VIP;
