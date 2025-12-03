import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const monthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const formatMonthLabel = (monthString) => {
  if (!monthString) return "";
  const [year, month] = monthString.split("-");
  const d = new Date(year, month - 1);
  return d.toLocaleDateString("es-MX", { month: "short", year: "numeric" });
};

const exportCSV = (data, filename = "chart-data.csv") => {
  if (!data || data.length === 0) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(","),
    ...data.map((row) => keys.map((k) => row[k]).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const TournamentChart = ({ tournaments = [] }) => {
  const [chartType, setChartType] = useState("bar"); // 'bar'|'line'
  const [daysFilter, setDaysFilter] = useState("all");
  const [holeFilter, setHoleFilter] = useState("any");

  const holeOptions = useMemo(() => {
    const setH = new Set();
    tournaments.forEach((t) => {
      if (Array.isArray(t.holes)) t.holes.forEach((h) => setH.add(h));
    });
    return Array.from(setH).sort((a, b) => a - b);
  }, [tournaments]);

  const data = useMemo(() => {
    const map = new Map();

    tournaments.forEach((t) => {
      if (!t.date) return;

      const daysCount = t.days ? t.days.length : t.durationDays || 1;
      if (daysFilter !== "all") {
        if (daysFilter === "3+" && daysCount < 3) return;
        if (daysFilter !== "3+" && Number(daysFilter) !== daysCount) return;
      }

      if (holeFilter !== "any") {
        const holeNumber = Number(holeFilter);
        if (!Array.isArray(t.holes) || !t.holes.includes(holeNumber)) return;
      }

      const key = monthKey(t.date);
      map.set(key, (map.get(key) || 0) + 1);
    });

    const arr = Array.from(map.entries())
      .map(([k, v]) => ({ month: k, count: v }))
      .sort((a, b) => (a.month < b.month ? -1 : 1));

    // ensure continuous months between min/max
    if (arr.length === 0) return [];
    const first = new Date(arr[0].month + "-01");
    const last = new Date(arr[arr.length - 1].month + "-01");
    const out = [];
    const cur = new Date(first);
    while (cur <= last) {
      const k = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const found = arr.find((r) => r.month === k);
      out.push({ month: k, count: found ? found.count : 0 });
      cur.setMonth(cur.getMonth() + 1);
    }

    return out;
  }, [tournaments, daysFilter, holeFilter]);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold">Torneos (por mes)</h3>
        <div className="flex items-center space-x-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-black/20 text-white rounded px-2 py-1"
          >
            <option value="bar">Barras</option>
            <option value="line">Línea</option>
          </select>
          <button
            onClick={() => exportCSV(data, "tournaments-monthly.csv")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-3 py-1 text-sm"
          >
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-gray-400 text-xs">Días</label>
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(e.target.value)}
            className="w-full bg-black/20 text-white rounded px-2 py-1 mt-1"
          >
            <option value="all">Todos</option>
            <option value="1">1 día</option>
            <option value="2">2 días</option>
            <option value="3+">3+ días</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs">Hole</label>
          <select
            value={holeFilter}
            onChange={(e) => setHoleFilter(e.target.value)}
            className="w-full bg-black/20 text-white rounded px-2 py-1 mt-1"
          >
            <option value="any">Cualquiera</option>
            {holeOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-end">
          <div className="text-gray-400 text-sm">
            Total meses: {data.length}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          {chartType === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthLabel}
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthLabel}
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TournamentChart;
