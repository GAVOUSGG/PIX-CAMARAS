import React from "react";
import { createPortal } from "react-dom";
import { XCircle } from "lucide-react";
import StatusBadge from "../UI/StatusBadge";
import TournamentForm from "./TournamentForm";

const TournamentModal = ({
  isOpen,
  onClose,
  tournament,
  onSave,
  workers,
  cameras,
}) => {
  if (!isOpen) return null;
  
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Overlay - cierra al hacer clic */}
      <div className="fixed inset-0 bg-slate-950/80" onClick={onClose} />
      
      {/* Modal - previene que el clic cierre */}
      <div 
        className="bg-slate-900 border border-white/5 p-6 rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        <TournamentForm
          tournament={tournament}
          onSave={(data) => onSave(data)}
          onCancel={onClose}
          workers={workers}
          cameras={cameras}
        />
      </div>
    </div>,
    document.body
  );
};

export default TournamentModal;
