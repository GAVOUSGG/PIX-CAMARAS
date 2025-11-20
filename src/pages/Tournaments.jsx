import React, { useState } from "react";
import TournamentTable from "../components/Tournaments/TournamentTable";
import TournamentForm from "../components/Tournaments/TournamentForm";

const Tournaments = ({
  tournamentsData,
  workersData,
  camerasData,
  onCreateTournament,
  onUpdateTournament,
  onDeleteTournament,
  onSetSelectedTournament,
}) => {
  const [editingTournament, setEditingTournament] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const handleSaveTournament = async (tournamentData) => {
    console.log("💾 Guardando torneo:", tournamentData);
    try {
      if (editingTournament) {
        // Modo edición
        await onUpdateTournament(editingTournament.id, tournamentData);
        alert("Torneo actualizado correctamente");
      } else {
        // Modo creación
        await onCreateTournament(tournamentData);
        alert("Torneo creado correctamente");
      }
      setShowForm(false);
      setEditingTournament(null);
    } catch (error) {
      console.error("❌ Error guardando torneo:", error);
      alert("Error al guardar el torneo");
    }
  };

  const handleEditTournament = (tournament) => {
    console.log("✏️ Editando torneo:", tournament);
    setEditingTournament(tournament);
    setShowForm(true);
  };

  const handleDeleteTournament = async (tournamentId) => {
    console.log("🗑️ Eliminando torneo:", tournamentId);
    if (
      confirm(
        "¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await onDeleteTournament(tournamentId);
        alert("Torneo eliminado correctamente");
      } catch (error) {
        console.error("❌ Error eliminando torneo:", error);
        alert("Error al eliminar el torneo");
      }
    }
  };

  // En Tournaments.jsx - corregir handleUpdateStatus
  const handleUpdateStatus = async (tournamentId, newStatus) => {
    console.log("🔄 Actualizando estado:", tournamentId, newStatus);
    try {
      // Solo enviar el campo que queremos actualizar (status)
      await onUpdateTournament(tournamentId, { status: newStatus });
      alert(`Estado cambiado a: ${newStatus}`);
    } catch (error) {
      console.error("❌ Error cambiando estado:", error);
      alert("Error al cambiar el estado");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTournament(null);
  };

  const handleViewDetails = (tournament) => {
    setSelectedTournament(tournament);
    onSetSelectedTournament(tournament);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestión de Torneos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>+ Nuevo Torneo</span>
        </button>
      </div>

      <TournamentTable
        tournaments={tournamentsData}
        onViewDetails={handleViewDetails}
        onEditTournament={handleEditTournament}
        onDeleteTournament={handleDeleteTournament}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Formulario para crear/editar */}
      {(showForm || editingTournament) && (
        <TournamentForm
          onSave={handleSaveTournament}
          onCancel={handleCancelForm}
          workers={workersData}
          cameras={camerasData}
          tournament={editingTournament}
          isOpen={true}
        />
      )}
    </div>
  );
};

export default Tournaments;
