import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

const exportCSV = (data, filename = "shipments-monthly.csv") => {
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

const colorByStatus = {
  enviado: "#10B981",
  pendiente: "#F59E0B",
  preparando: "#F97316",
  entregado: "#60A5FA",
};

const ShipmentsChart = ({ shipments = [] }) => {
  const [byStatus, setByStatus] = useState(true);

  const statuses = useMemo(() => {
    return Array.from(new Set(shipments.map((s) => s.status))).sort();
  }, [shipments]);

  const data = useMemo(() => {
    const map = new Map();

    shipments.forEach((s) => {
      if (!s.date) return;
      const key = monthKey(s.date);
      if (!map.has(key)) map.set(key, { month: key });
      const entry = map.get(key);
      if (byStatus) {
        entry[s.status] = (entry[s.status] || 0) + 1;
      } else {
        entry.count = (entry.count || 0) + 1;
      }
    });

    const arr = Array.from(map.values()).sort((a, b) =>
      a.month < b.month ? -1 : 1
    );

    // ensure continuous months
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
      out.push(found || { month: k });
      cur.setMonth(cur.getMonth() + 1);
    }

    return out;
  }, [shipments, byStatus]);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold">Envíos (mensual)</h3>
        <div className="flex items-center space-x-2">
          <label className="text-gray-400 text-sm">Por estado</label>
          <input
            type="checkbox"
            checked={byStatus}
            onChange={(e) => setByStatus(e.target.checked)}
            className="rounded"
          />
          <button
            onClick={() => exportCSV(data, "shipments-monthly.csv")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-3 py-1 text-sm"
          >
            Exportar
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
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
            <Legend />
            {byStatus ? (
              statuses.map((s) => (
                <Bar
                  key={s}
                  dataKey={s}
                  stackId="a"
                  fill={colorByStatus[s] || "#94A3B8"}
                />
              ))
            ) : (
              <Bar dataKey="count" fill="#10B981" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShipmentsChart;
