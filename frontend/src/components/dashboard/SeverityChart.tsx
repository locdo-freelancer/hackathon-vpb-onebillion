"use client";

import React, { useEffect, useRef } from "react";
import type { ChartData } from "@/types/dashboard.types";
import { useTranslations } from "@/hooks/useTranslations";

interface SeverityChartProps {
  data: ChartData;
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ data }) => {
  const { t } = useTranslations("dashboard");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Dynamic import Plotly to avoid SSR issues
    import("plotly.js-dist-min").then((Plotly) => {
      const chartData = [
        {
          type: "pie" as const,
          labels: data.labels,
          values: data.values,
          marker: {
            colors: data.colors || ["#ef4444", "#eab308", "#3b82f6", "#22c55e"],
          },
          textinfo: "label+percent" as const,
          textfont: {
            color: "#fff",
            size: 12,
          },
          hovertemplate:
            "<b>%{label}</b><br>Count: %{value}<br>Percent: %{percent}<extra></extra>",
        },
      ];

      const layout = {
        margin: { t: 20, r: 20, b: 20, l: 20 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        showlegend: true,
        legend: {
          font: { color: "#9ca3af", size: 11 },
          orientation: "v" as const,
          x: 1,
          y: 0.5,
        },
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
  }, [data]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t("severityDistribution")}
          </h3>
          <p className="text-sm text-gray-400"> {t("threatBySeverityLevel")}</p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-ellipsis-v" />
        </button>
      </div>
      <div ref={chartRef} style={{ height: "350px" }} />
    </div>
  );
};
