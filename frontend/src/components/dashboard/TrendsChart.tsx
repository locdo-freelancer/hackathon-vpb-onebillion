"use client";

import React, { useEffect, useRef, useState } from "react";
import type { TimeSeriesData } from "@/types/dashboard.types";
import { useTranslations } from "@/hooks/useTranslations";

interface TrendsChartProps {
  data: TimeSeriesData[];
}

type TimeRange = "7D" | "30D";

export const TrendsChart: React.FC<TrendsChartProps> = ({ data }) => {
  const {t} = useTranslations("dashboard")
  const chartRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7D");

  useEffect(() => {
    if (!chartRef.current) return;

    // Dynamic import Plotly to avoid SSR issues
    import("plotly.js-dist-min").then((Plotly) => {
      const chartData = data.map((series) => ({
        type: "scatter" as const,
        mode: "lines" as const,
        name: series.name,
        x: series.data.map((d) => d.x),
        y: series.data.map((d) => d.y),
        line: { color: series.color, width: 3 },
        hovertemplate: `<b>${series.name}</b><br>%{x}: %{y} incidents<extra></extra>`,
      }));

      const layout = {
        margin: { t: 20, r: 20, b: 40, l: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: {
          gridcolor: "#1a2332",
          color: "#9ca3af",
        },
        yaxis: {
          gridcolor: "#1a2332",
          color: "#9ca3af",
          title: { text: "Incidents" },
        },
        showlegend: true,
        legend: {
          font: { color: "#9ca3af", size: 11 },
          orientation: "h" as const,
          x: 0,
          y: 1.1,
        },
        hovermode: "x unified" as const,
      };

      const config = {
        responsive: true,
        displayModeBar: false,
        displaylogo: false,
      };

      if (chartRef.current) {
        Plotly.newPlot(chartRef.current, chartData, layout, config);
      }
    });

    return () => {
      if (chartRef.current) {
        // @ts-ignore
        window.Plotly?.purge(chartRef.current);
      }
    };
  }, [data, timeRange]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{t("attackTrends")}</h3>
          <p className="text-sm text-gray-400">Last 7 days activity</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeRange("7D")}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              timeRange === "7D"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setTimeRange("30D")}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              timeRange === "30D"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            30D
          </button>
        </div>
      </div>
      <div ref={chartRef} style={{ height: "350px" }} />
    </div>
  );
};
