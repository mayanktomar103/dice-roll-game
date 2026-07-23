import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Dice3D from '../../components/ui/Dice3D';
import {
  SparklesIcon,
  ShieldCheckIcon,
  TrophyIcon,
  BoltIcon,
  ArrowRightIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              <SparklesIcon className="w-4 h-4 text-purple-400" />
              <span>100% Free Virtual Dice Gaming Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Roll the Dice.{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                Win Big Coins.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Experience the thrill of virtual dice rolling with 3x payout rewards, daily bonuses, level-ups, and lifetime VIP status. Zero real-world money risks.
            </p>

            {/* Disclaimer pill */}
            <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-400">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
              <span>Virtual coins only. No real money gambling.</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              {isAuthenticated ? (
                <Link
                  to="/game"
                  className="w-full sm:w-auto glow-btn-purple text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 shadow-xl shadow-purple-500/30"
                >
                  <span>Play Dice Game Now</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto glow-btn-purple text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 shadow-xl shadow-purple-500/30"
                  >
                    <span>Claim 1,000 Free Coins</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto glass-card hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg border border-slate-700 text-center"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Right 3D Interactive Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center relative"
          >
            <div className="relative glass-card rounded-3xl p-8 border border-purple-500/30 shadow-2xl shadow-purple-900/40">
              <div className="absolute -top-6 -right-6 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg">
                Dice 6 = 3X Payout
              </div>
              <Dice3D value={6} isRolling={false} />
              <div className="text-center mt-4">
                <p className="text-xs uppercase tracking-widest font-bold text-purple-400">
                  Fair 3D Physics Engine
                </p>
                <p className="text-sm text-slate-400 mt-1">Roll 5 or 6 for Multiplier Wins!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Play <span className="text-purple-400">DiceRoll</span>?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Everything you need for an immersive, rewarding, and fun virtual gaming experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <TrophyIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Multiplied Payouts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Roll a 6 to win 3x your bet. Roll a 5 to win 1.5x. Roll 4 to get your bet back. High risk, higher virtual rewards!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <GiftIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">24-Hour Daily Bonus</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Claim 250 free coins every single day. Upgrade to VIP to double your daily rewards to 500 coins every 24 hours.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BoltIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Level Progression</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Earn XP on every single game (20 XP for wins, 10 XP for losses). Level up every 100 XP to flex your status.
            </p>
          </div>
        </div>
      </section>

      {/* Rules Breakdown */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 text-center sm:text-left">
          <h3 className="text-2xl font-black text-white text-center">Game Rules & Multipliers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="text-2xl font-black text-emerald-400">Dice 6</div>
              <div className="text-xs text-slate-300 font-bold mt-1">WIN 3X BET</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
              <div className="text-2xl font-black text-blue-400">Dice 5</div>
              <div className="text-xs text-slate-300 font-bold mt-1">WIN 1.5X BET</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
              <div className="text-2xl font-black text-amber-400">Dice 4</div>
              <div className="text-xs text-slate-300 font-bold mt-1">RETURN BET</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
              <div className="text-2xl font-black text-rose-400">Dice 1 - 3</div>
              <div className="text-xs text-slate-300 font-bold mt-1">LOSE BET</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
