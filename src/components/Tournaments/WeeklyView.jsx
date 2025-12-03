import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Camera,
  Clock,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";

// StatusBadge Component actualizado con colores del proyecto
const StatusBadge = ({ status, small = false }) => {
  const statusConfig = {
    activo: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      label: "Activo",
    },
    pendiente: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      label: "Pendiente",
    },
    terminado: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
      label: "Terminado",
    },
    cancelado: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
      label: "Cancelado",
    },
  };

  const config = statusConfig[status] || statusConfig.pendiente;

  return (
    <span
      className={`inline-flex items-center ${
        small ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } rounded-full border ${config.bg} ${config.text} ${
        config.border
      } font-medium`}
    >
      <span
        className={`${
          small ? "w-1.5 h-1.5" : "w-2 h-2"
        } rounded-full ${config.text.replace("text-", "bg-")} mr-1.5`}
      ></span>
      {config.label}
    </span>
  );
};

const WeeklyView = ({
  tournaments = [],
  onViewDetails = () => {},
  onEditTournament = () => {},
  onDeleteTournament = () => {},
  onUpdateStatus = () => {},
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Obtener los días de la semana (Lunes a Domingo)
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentWeek]);

  // Función auxiliar para obtener la fecha como string YYYY-MM-DD en hora local
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Función para obtener torneos que ocurren en un día específico (incluyendo multi-día)
  const getTournamentsForDay = (day) => {
    // Obtener la fecha como string YYYY-MM-DD en hora local (sin conversión a UTC)
    const dayString = getLocalDateString(day);

    return tournaments.filter((tournament) => {
      if (!tournament.date || !tournament.endDate) return false;

      // Extraer solo la parte de la fecha (YYYY-MM-DD) de las fechas del torneo
      const tournamentStart = tournament.date.split("T")[0];
      const tournamentEnd = tournament.endDate.split("T")[0];

      // El torneo ocurre en este día si el día está entre startDate y endDate (inclusive)
      // Comparación de strings funciona correctamente para fechas en formato YYYY-MM-DD
      return dayString >= tournamentStart && dayString <= tournamentEnd;
    });
  };

  // Navegación entre semanas
  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
    setSelectedDay(null);
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
    setSelectedDay(null);
  };

  // Agrupar torneos por día (ahora incluye multi-día)
  const tournamentsByDay = useMemo(() => {
    const grouped = {};

    weekDays.forEach((day) => {
      const dateString = day.toISOString().split("T")[0];
      grouped[dateString] = getTournamentsForDay(day);
    });

    return grouped;
  }, [tournaments, weekDays]);

  const formatDate = (date) => {
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return getLocalDateString(date) === getLocalDateString(today);
  };

  // Función para obtener el color del torneo basado en su estado
  const getTournamentColor = (tournament) => {
    switch (tournament.status) {
      case "activo":
        return "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
      case "pendiente":
        return "bg-yellow-500/20 border-yellow-500/40 text-yellow-400";
      case "terminado":
        return "bg-blue-500/20 border-blue-500/40 text-blue-400";
      case "cancelado":
        return "bg-red-500/20 border-red-500/40 text-red-400";
      default:
        return "bg-gray-500/20 border-gray-500/40 text-gray-400";
    }
  };

  // Función para ver si un torneo es multi-día
  const isMultiDayTournament = (tournament) => {
    if (!tournament.date || !tournament.endDate) return false;
    const start = new Date(tournament.date);
    const end = new Date(tournament.endDate);
    return end > start;
  };

  // Función para obtener la duración en días
  const getTournamentDuration = (tournament) => {
    if (!tournament.date || !tournament.endDate) return 1;
    const start = new Date(tournament.date);
    const end = new Date(tournament.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // +1 para incluir ambos días
  };

  const totalTournaments = Object.values(tournamentsByDay).flat().length;
  const activeTournaments = Object.values(tournamentsByDay)
    .flat()
    .filter((t) => t.status === "activo").length;
  const pendingTournaments = Object.values(tournamentsByDay)
    .flat()
    .filter((t) => t.status === "pendiente").length;
  const multiDayTournaments = tournaments.filter(isMultiDayTournament).length;

  return (
    <div className="space-y-6">
      {/* Header con navegación y stats */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-slate-800/20 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:scale-105 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-bold text-white">
                {weekDays[0].toLocaleDateString("es-MX", { month: "long" })}
              </h3>
              <p className="text-sm text-gray-400">
                {weekDays[0].toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                -{" "}
                {weekDays[6].toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              onClick={goToNextWeek}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:scale-105 text-gray-400 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all hover:scale-105 font-medium shadow-lg shadow-emerald-500/20"
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Hoy
          </button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-white mb-1">
              {totalTournaments}
            </div>
            <div className="text-sm text-gray-400">Torneos esta semana</div>
          </div>
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {activeTournaments}
            </div>
            <div className="text-sm text-gray-400">Activos</div>
          </div>
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {pendingTournaments}
            </div>
            <div className="text-sm text-gray-400">Pendientes</div>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {multiDayTournaments}
            </div>
            <div className="text-sm text-gray-400">Multi-día</div>
          </div>
        </div>
      </div>

      {/* Vista de Calendario Mejorada */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dateString = day.toISOString().split("T")[0];
          const dayTournaments = tournamentsByDay[dateString] || [];
          const isSelected = selectedDay === dateString;
          const today = isToday(day);

          return (
            <div
              key={dateString}
              className={`relative group cursor-pointer transition-all duration-300 ${
                isSelected ? "scale-105 z-10" : "hover:scale-102"
              }`}
              onClick={() => setSelectedDay(isSelected ? null : dateString)}
            >
              <div
                className={`rounded-2xl border transition-all ${
                  today
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 shadow-lg shadow-emerald-500/20"
                    : isSelected
                    ? "border-blue-500 bg-gradient-to-br from-blue-500/20 to-blue-600/10 shadow-lg shadow-blue-500/20"
                    : "border-white/10 bg-slate-800/50 hover:border-white/20 hover:bg-slate-700/50"
                } ${dayTournaments.length > 0 ? "pb-2" : "pb-4"}`}
              >
                {/* Header del día */}
                <div
                  className={`p-4 rounded-t-2xl ${
                    today
                      ? "bg-emerald-500/20"
                      : isSelected
                      ? "bg-blue-500/20"
                      : "bg-white/5"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-xs uppercase font-semibold tracking-wider mb-1 ${
                        today
                          ? "text-emerald-400"
                          : isSelected
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`}
                    >
                      {day.toLocaleDateString("es-MX", { weekday: "short" })}
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        today
                          ? "text-emerald-300"
                          : isSelected
                          ? "text-blue-300"
                          : "text-white"
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    {today && (
                      <div className="mt-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-semibold">
                        HOY
                      </div>
                    )}
                  </div>
                </div>

                {/* Lista de torneos del día */}
                {dayTournaments.length > 0 && (
                  <div className="px-3 py-2 space-y-2 max-h-32 overflow-y-auto">
                    {dayTournaments.map((tournament) => {
                      const isMultiDay = isMultiDayTournament(tournament);
                      const duration = getTournamentDuration(tournament);

                      return (
                        <div
                          key={tournament.id}
                          className={`p-2 rounded-lg border text-xs ${getTournamentColor(
                            tournament
                          )} ${isMultiDay ? "border-dashed" : ""}`}
                        >
                          <div className="font-semibold truncate">
                            {tournament.name}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="truncate flex-1 mr-2">
                              {tournament.field}
                            </span>
                            {isMultiDay && (
                              <Clock className="w-3 h-3 flex-shrink-0" />
                            )}
                          </div>
                          {isMultiDay && (
                            <div className="text-xs opacity-75 mt-1">
                              {duration}d
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {dayTournaments.length === 0 && (
                  <div className="px-3 py-4 text-center text-gray-500 text-xs">
                    Sin torneos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel de detalles del día seleccionado */}
      {selectedDay &&
        tournamentsByDay[selectedDay] &&
        tournamentsByDay[selectedDay].length > 0 && (
          <div className="bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-purple-500/10 rounded-2xl border border-blue-500/30 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                {formatDate(new Date(selectedDay + "T12:00:00"))}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-sm">Cerrar</span>
              </button>
            </div>

            <div className="grid gap-4">
              {tournamentsByDay[selectedDay].map((tournament) => {
                const isMultiDay = isMultiDayTournament(tournament);
                const duration = getTournamentDuration(tournament);

                return (
                  <div
                    key={tournament.id}
                    className="bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-200 overflow-hidden group"
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                              {tournament.name}
                            </h4>
                            {isMultiDay && (
                              <div className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{duration} días</span>
                              </div>
                            )}
                          </div>
                          <StatusBadge status={tournament.status} />
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-400 mb-0.5">
                              Ubicación
                            </div>
                            <div className="text-sm text-white font-medium truncate">
                              {tournament.field}
                            </div>
                            <div className="text-xs text-gray-400">
                              {tournament.state}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <Users className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-400 mb-0.5">
                              Trabajador
                            </div>
                            <div className="text-sm text-white font-medium truncate">
                              {tournament.worker || "Por asignar"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <Camera className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400 mb-0.5">
                              Cámaras
                            </div>
                            <div className="text-sm text-white font-medium">
                              {tournament.cameras &&
                              tournament.cameras.length > 0
                                ? `${tournament.cameras.length} asignadas`
                                : "Por asignar"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400 mb-0.5">
                              Hoyos
                            </div>
                            <div className="text-sm text-white font-medium">
                              {tournament.holes && tournament.holes.length > 0
                                ? `${tournament.holes.length} hoyos`
                                : "Por definir"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fechas para torneos multi-día */}
                      {isMultiDay && (
                        <div className="mb-4 inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-sm">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            {new Date(tournament.date).toLocaleDateString(
                              "es-MX"
                            )}{" "}
                            -{" "}
                            {new Date(tournament.endDate).toLocaleDateString(
                              "es-MX"
                            )}
                          </span>
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                        <button
                          onClick={() => onViewDetails(tournament)}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2.5 rounded-lg transition-all font-medium flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver Detalles</span>
                        </button>
                        <button
                          onClick={() => onEditTournament(tournament)}
                          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2.5 rounded-lg transition-all font-medium flex items-center justify-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => onDeleteTournament(tournament.id)}
                          className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

export default WeeklyView;
