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

const LogisticsSummary = ({ shipments }) => {
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
    <div className="rounded-3xl p-5 h-full bg-gradient-to-br from-slate-900/90 to-[#0B1120] border border-white/5 shadow-lg relative overflow-hidden flex flex-col transform-gpu">
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-purple-500/5 to-transparent rounded-full opacity-40 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Logística</h3>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse border border-[#0B1120]"></div>
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
            <div key={idx} className={`p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all duration-300 hover:border-white/10 cursor-pointer shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl transition-colors duration-300 ${styles.iconBg} ${styles.border} ${styles.shadow}`}>
                    <item.icon className={`w-5 h-5 ${styles.iconText}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 lg:text-xs font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-2xl font-black text-white leading-none mt-1">{item.val}</p>
                  </div>
                </div>
                <div className={`text-[10px] font-black ${styles.badgeText} px-2 py-1 ${styles.badgeBg} rounded-lg border ${styles.border}`}>
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center bg-white/[0.02] px-4 py-3 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
            Total Registros
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-white">{shipments.length}</span>
            <div className="flex -space-x-2">
              {[1, 2, 3].slice(0, Math.min(3, shipments.length)).map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0B1120] bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 font-bold shadow-md">
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
