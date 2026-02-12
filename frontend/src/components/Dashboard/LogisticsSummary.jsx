import React, { useMemo } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const LogisticsSummary = ({ shipments }) => {
  const stats = useMemo(() => {
    if (!shipments) return { pending: 0, transit: 0, delivered: 0 };

    const counts = {
      pending: 0,
      transit: 0,
      delivered: 0
    };

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
    <div className="glass-card rounded-3xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/10">
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          Logística
        </h3>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
      </div>

      <div className="space-y-3 flex-grow">
        {/* Items compactos */}
        {[
          { label: 'Pendiente', val: stats.pending, color: 'yellow', icon: Clock },
          { label: 'En Ruta', val: stats.transit, color: 'blue', icon: Truck },
          { label: 'Completado', val: stats.delivered, color: 'emerald', icon: CheckCircle }
        ].map((item, idx) => (
          <div key={idx} className="group p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-${item.color}-500/10 rounded-xl group-hover:bg-${item.color}-500/20 transition-colors`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                  <p className="text-xl font-bold text-white leading-none mt-0.5">{item.val}</p>
                </div>
              </div>
              <div className={`text-[10px] font-bold text-${item.color}-400/50 group-hover:text-${item.color}-400 px-1.5 py-0.5 bg-${item.color}-500/5 rounded-md border border-${item.color}-500/10`}>
                {Math.round((item.val / (shipments.length || 1)) * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total: <span className="text-white ml-1">{shipments.length}</span></p>
          <div className="flex -space-x-1.5">
            {[1, 2].map(i => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] text-gray-400`}>
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



export default LogisticsSummary;
