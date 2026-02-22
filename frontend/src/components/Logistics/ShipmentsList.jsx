import React from 'react';
import { Download } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const ShipmentsList = ({ shipments, darkMode = true }) => {
  const generateTicket = (shipment) => {
    const ticketContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                    PIXGOLF - TICKET DE ENVÍO
                                   Cámaras Solares Hikvision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TICKET: ${shipment.id}
📅 FECHA: ${shipment.date}
⏰ HORA: ${new Date().toLocaleTimeString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 INFORMACIÓN DE ENVÍO:

👤 DESTINATARIO: ${shipment.recipient}
📍 DESTINO: ${shipment.destination}
🏢 REMITENTE: ${shipment.sender}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📹 CÁMARAS SOLARES HIKVISION:

${shipment.cameras.map(cam => `   • ${cam} - Hikvision Solar`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  INSTRUCCIONES ESPECIALES:
• Verificar carga solar al recibir las cámaras
• Confirmar recepción vía sistema PixGolf
• Reportar cualquier daño inmediatamente
• Mantener paneles solares limpios
• Verificar funcionamiento de batería interna
• Posición óptima para captación solar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                           🎯 PIXGOLF - Seguros de Hole in One
                           📹 Especialistas en Cámaras Solares
                              📞 Contacto: (33) 1234-5678
                              🌐 www.pixgolf.mx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${shipment.id}.txt`;
    a.click();
  };

  return (
    <div className={`rounded-3xl border p-8 transition-all duration-500 ${
      darkMode ? 'bg-slate-900 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-slate-200'
    }`}>
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-1 h-6 rounded-full ${darkMode ? 'bg-emerald-500/50' : 'bg-emerald-500'}`}></div>
        <h3 className={`text-xl font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Envíos y Recolecciones</h3>
      </div>

      <div className="space-y-4">
        {shipments.map(shipment => (
          <div key={shipment.id} className={`rounded-2xl border transition-all duration-300 ${
            darkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/5' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
          } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <StatusBadge status={shipment.status} />
                <div>
                  <h4 className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>{shipment.id}</h4>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight mt-0.5">{shipment.date}</p>
                </div>
              </div>
              <button 
                onClick={() => generateTicket(shipment)}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2 shadow-lg ${
                  darkMode 
                    ? 'bg-emerald-500 border border-emerald-400 text-white hover:bg-emerald-400 shadow-emerald-500/20' 
                    : 'bg-emerald-500 border border-emerald-600 text-white hover:bg-emerald-600 shadow-emerald-500/10'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Generar Ticket</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Destinatario</p>
                <p className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{shipment.recipient}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Destino Final</p>
                <p className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{shipment.destination}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Equipamiento Pxg</p>
                <p className={`text-xs font-mono font-bold ${darkMode ? 'text-emerald-500/70' : 'text-emerald-600'}`}>
                  {shipment.cameras.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentsList;