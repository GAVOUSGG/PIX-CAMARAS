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
  darkMode = true
}) => {
  if (!isOpen) return null;
  
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 backdrop-blur-sm transition-colors duration-500 ${
          darkMode ? 'bg-slate-950/80' : 'bg-slate-900/40'
        }`} 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div 
        className={`w-full max-w-4xl relative z-10 shadow-2xl rounded-[2.5rem] border transition-all duration-500 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar ${
          darkMode 
            ? 'bg-slate-900 border-white/5' 
            : 'bg-white border-black/5 shadow-slate-300'
        }`}
        onClick={handleModalClick}
      >
        <TournamentForm
          tournament={tournament}
          onSave={(data) => onSave(data)}
          onCancel={onClose}
          workers={workers}
          cameras={cameras}
          darkMode={darkMode}
        />
      </div>
    </div>,
    document.body
  );
};

export default TournamentModal;
