import React from "react";
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay - cierra al hacer clic */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal - previene que el clic cierre */}
      <div 
        className="bg-slate-900 p-6 rounded-lg w-full max-w-3xl relative z-50"
        onClick={handleModalClick}
      >
        <TournamentForm
          tournament={tournament}
          onSave={(data) => onSave(data)}
          onCancel={onClose}
          workers={workers}
          cameras={cameras}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default TournamentModal;
