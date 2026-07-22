import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gameService } from '../../services/gameService';
import Dice3D from '../../components/ui/Dice3D';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyDollarIcon, SparklesIcon, TrophyIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const DiceGame = () => {
  const { user, updateUserState } = useAuth();
  const [bet, setBet] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [currentDice, setCurrentDice] = useState(1);
  const [lastResult, setLastResult] = useState(null);

  const handleQuickBet = (action) => {
    const userCoins = user?.coins || 0;
    if (action === 'min') setBet(10);
    else if (action === 'half') setBet(Math.max(1, Math.floor(userCoins / 2)));
    else if (action === 'double') setBet(Math.min(userCoins, bet * 2));
    else if (action === 'max') setBet(userCoins);
  };

  const handleRoll = async () => {
    if (isRolling) return;

    if (!bet || bet <= 0) {
      toast.error('Please enter a valid bet amount (> 0)');
      return;
    }

    if (bet > (user?.coins || 0)) {
      toast.error('Cannot bet more than your available coin balance!');
      return;
    }

    setIsRolling(true);
    setLastResult(null);

    try {
      const response = await gameService.play(bet);

      if (response.success && response.data) {
        const { game, user: updatedUser } = response.data;

        // Trigger 3D dice rolling animation time (1.6 seconds)
        setTimeout(() => {
          setCurrentDice(game.dice);
          setLastResult(game);
          setIsRolling(false);

          // Update Auth user state
          updateUserState({
            coins: updatedUser.coins,
            level: updatedUser.level,
            xp: updatedUser.xp,
            totalGames: updatedUser.totalGames,
            totalWins: updatedUser.totalWins,
            totalLosses: updatedUser.totalLosses
          });

          // Show Toast notification based on result
          if (game.result === 'win') {
            toast.success(`🎉 WINNER! Rolled ${game.dice} for +${game.netChange} Coins! (+20 XP)`);
          } else if (game.result === 'return') {
            toast('🤝 Bet Returned! Rolled 4 (+10 XP)', { icon: '🎲' });
          } else {
            toast.error(`❌ Lost ${game.bet} Coins. Rolled ${game.dice} (+10 XP)`);
          }
        }, 1600);
      }
    } catch (err) {
      setIsRolling(false);
      toast.error(err.response?.data?.message || 'Error executing dice roll');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          3D Virtual <span className="text-purple-400">Dice Roll</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Set your bet, roll the dice & collect up to 3x payout rewards.
        </p>
      </div>

      {/* Main Game Stage */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col items-center space-y-8">
        {/* Top Balance Bar */}
        <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 px-6 py-3 rounded-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-extrabold text-slate-400">Available Balance:</span>
            <div className="flex items-center space-x-1 text-amber-300 font-black text-lg">
              <CurrencyDollarIcon className="w-5 h-5 text-amber-400" />
              <span>{user?.coins?.toLocaleString() || 0}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-extrabold text-slate-400">Level:</span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-black text-xs border border-purple-500/30">
              Lvl {user?.level || 1}
            </span>
          </div>
        </div>

        {/* 3D Dice Display */}
        <div className="py-4">
          <Dice3D value={currentDice} isRolling={isRolling} />
        </div>

        {/* Result Payout Highlight Card */}
        <AnimatePresence mode="wait">
          {lastResult && !isRolling && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full p-4 rounded-2xl border text-center space-y-1 ${
                lastResult.result === 'win'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : lastResult.result === 'return'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="text-2xl font-black uppercase tracking-wider">
                {lastResult.result === 'win' && `🏆 YOU WON +${lastResult.reward} COINS!`}
                {lastResult.result === 'return' && `🤝 BET RETURNED (+${lastResult.reward})`}
                {lastResult.result === 'lose' && `💔 YOU LOST -${lastResult.bet} COINS`}
              </div>
              <p className="text-xs font-semibold opacity-80">
                Rolled a {lastResult.dice} | +{lastResult.xpEarned} XP Earned
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bet Controls & Input */}
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase text-slate-300 tracking-wider flex justify-between">
              <span>Enter Bet Amount</span>
              <span className="text-purple-400">Coins</span>
            </label>

            <div className="relative">
              <input
                type="number"
                min="1"
                max={user?.coins || 1000}
                value={bet}
                onChange={(e) => setBet(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isRolling}
                className="w-full bg-slate-950 border-2 border-purple-500/40 rounded-2xl px-5 py-4 text-2xl font-black text-amber-300 text-center focus:outline-none focus:border-purple-400 transition"
              />
            </div>
          </div>

          {/* Quick Bet Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleQuickBet('min')}
              disabled={isRolling}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-extrabold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              MIN (10)
            </button>
            <button
              onClick={() => handleQuickBet('half')}
              disabled={isRolling}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-extrabold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              1/2 HALF
            </button>
            <button
              onClick={() => handleQuickBet('double')}
              disabled={isRolling}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-extrabold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              2X DOUBLE
            </button>
            <button
              onClick={() => handleQuickBet('max')}
              disabled={isRolling}
              className="py-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-xs font-extrabold text-amber-400 hover:bg-amber-500/10 transition"
            >
              MAX
            </button>
          </div>

          {/* Roll Action Button */}
          <button
            onClick={handleRoll}
            disabled={isRolling || (user?.coins || 0) < 1}
            className="w-full glow-btn-purple text-white py-5 rounded-2xl font-black text-xl tracking-wider shadow-2xl flex items-center justify-center space-x-3 disabled:opacity-50 transition"
          >
            {isRolling ? (
              <>
                <ArrowPathIcon className="w-7 h-7 animate-spin" />
                <span>ROLLING DICE...</span>
              </>
            ) : (
              <>
                <span>ROLL DICE NOW</span>
                <span className="text-amber-300 text-lg">({bet} Coins)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rules Footer Guide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <span className="font-bold text-emerald-400 block text-sm">Dice 6</span>
          <span>3x Payout</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <span className="font-bold text-blue-400 block text-sm">Dice 5</span>
          <span>2x Payout</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <span className="font-bold text-amber-400 block text-sm">Dice 4</span>
          <span>Return Bet</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <span className="font-bold text-rose-400 block text-sm">Dice 1-3</span>
          <span>Lose Bet</span>
        </div>
      </div>
    </div>
  );
};

export default DiceGame;
