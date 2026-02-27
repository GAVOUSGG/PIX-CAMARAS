import React, { useMemo } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const colorStyles = {
  yellow: {
    iconText: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    badgeText: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/5',
    shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.15)]'
  },
  blue: {
    iconText: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    badgeText: 'text-blue-400',
    badgeBg: 'bg-blue-500/5',
    shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.15)]'
  },
  emerald: {
    iconText: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    badgeText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/5',
    shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.15)]'
  }
};

const LogisticsSummary = ({ shipments, darkMode }) => {
  const stats = useMemo(() => {
    if (!shipments) return { pending: 0, transit: 0, delivered: 0 };

    const counts = { pending: 0, transit: 0, delivered: 0 };

    shipments.forEach(s => {
      const status = s.status?.toLowerCase() || '';
      if (status === 'pendiente' || status === 'por enviar') {
        counts.pending++;
      } else if (status === 'en transito' || status === 'enviado' || status === 'en camino') {
        counts.transit++;
      } else if (status === 'entregado' || status === 'recibido') {
        counts.delivered++;
      }
    });

    return counts;
  }, [shipments]);

  if (!shipments) return null;

  return (
    <div className={`rounded-3xl p-5 h-full border shadow-lg relative overflow-hidden flex flex-col transition-all duration-500 transform-gpu ${
      darkMode 
        ? 'border-white/5' 
        : 'bg-white border-black/5 shadow-zinc-200 shadow-sm'
    }`}>
      <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full transition-opacity duration-500 pointer-events-none ${darkMode ? 'opacity-40' : 'opacity-10'}`}></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg border transition-all duration-500 ${
            darkMode 
              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
              : 'bg-purple-50 border-purple-100 text-purple-600'
          }`}>
            <Package className="w-4 h-4" />
          </div>
          <h3 className={`text-lg font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>LogÒ­stica</h3>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse border transition-colors duration-500 ${darkMode ? 'bg-purple-400 border-zinc-950' : 'bg-purple-500 border-white'}`}></div>
      </div>

      <div className="space-y-3 flex-grow relative z-10">
        {[
          { label: 'Pendiente', val: stats.pending, color: 'yellow', icon: Clock },
          { label: 'En Ruta', val: stats.transit, color: 'blue', icon: Truck },
          { label: 'Completado', val: stats.delivered, color: 'emerald', icon: CheckCircle }
        ].map((item, idx) => {
          const styles = colorStyles[item.color];
          const percentage = Math.round((item.val / (shipments.length || 1)) * 100);
          
          return (
            <div key={idx} className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm ${
              darkMode 
                ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 hover:border-white/10' 
                : 'bg-zinc-50 border-black/5 hover:border-black/10 hover:bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl transition-all duration-300 border ${darkMode ? styles.iconBg + ' ' + styles.border + ' ' + styles.shadow : 'bg-white border-zinc-100 shadow-sm'}`}>
                    <item.icon className={`w-5 h-5 transition-colors duration-300 ${darkMode ? styles.iconText : 'text-zinc-600'}`} />
                  </div>
                  <div>
                    <p className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{item.label}</p>
                    <p className={`text-2xl font-black leading-none mt-1 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{item.val}</p>
                  </div>
                </div>
                <div className={`text-[10px] font-black px-2 py-1 rounded-lg border transition-all duration-500 ${
                  darkMode 
                    ? styles.badgeText + ' ' + styles.badgeBg + ' ' + styles.border 
                    : 'text-zinc-600 bg-zinc-100 border-zinc-200'
                }`}>
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-6 pt-5 border-t relative z-10 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className={`flex justify-between items-center px-4 py-3 rounded-2xl border transition-all duration-500 ${
          darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-zinc-50 border-black/5'
        }`}>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">
            Total Registros
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{shipments.length}</span>
            <div className="flex -space-x-2">
              {[1, 2, 3].slice(0, Math.min(3, shipments.length)).map(i => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold shadow-md transition-all duration-500 ${
                  darkMode ? 'border-zinc-950 bg-zinc-800 text-zinc-400' : 'border-white bg-zinc-200 text-zinc-600'
                }`}>
                   {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsSummary;
