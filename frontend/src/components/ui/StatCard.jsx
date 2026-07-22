import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'purple' }) => {
  const colorMap = {
    purple: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    amber: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    rose: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl sm:text-3xl font-black text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.purple} flex items-center justify-center border shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
