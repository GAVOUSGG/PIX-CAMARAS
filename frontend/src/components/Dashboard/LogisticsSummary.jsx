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
    <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
            <Truck className="w-5 h-5 text-blue-400" />
          </div>
          Logística
        </h3>
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
      </div>

      <div className="space-y-4 flex-grow">
        {/* Por Enviar */}
        <div className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500/20 transition-colors">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pendiente</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
            </div>
            <div className="text-xs font-bold text-yellow-400/50 group-hover:text-yellow-400 transition-colors px-2 py-1 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
              {Math.round((stats.pending / (shipments.length || 1)) * 100)}%
            </div>
          </div>
        </div>

        {/* En Camino */}
        <div className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">En Ruta</p>
                <p className="text-2xl font-bold text-white">{stats.transit}</p>
              </div>
            </div>
            <div className="text-xs font-bold text-blue-400/50 group-hover:text-blue-400 transition-colors px-2 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10">
              {Math.round((stats.transit / (shipments.length || 1)) * 100)}%
            </div>
          </div>
        </div>

        {/* Entregados */}
        <div className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Completado</p>
                <p className="text-2xl font-bold text-white">{stats.delivered}</p>
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-400/50 group-hover:text-emerald-400 transition-colors px-2 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
              {Math.round((stats.delivered / (shipments.length || 1)) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Volumen Total</p>
            <p className="text-lg font-bold text-white mt-1">{shipments.length} <span className="text-sm font-normal text-gray-500">Unidades</span></p>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-gray-400`}>
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
