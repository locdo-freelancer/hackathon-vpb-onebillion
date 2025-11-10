"use client";

import React, { useEffect, useRef } from "react";
import type { OSDistribution } from "@/types/agents.types";
import { useTranslations } from "@/hooks/useTranslations";

interface OSDistributionChartProps {
  data: OSDistribution[];
}

export const OSDistributionChart: React.FC<OSDistributionChartProps> = ({
  data,
}) => {
  const { t } = useTranslations("agents");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    import("plotly.js-dist-min").then((Plotly) => {
      const chartData = [
        {
          type: "pie" as const,
          labels: data.map((d) => d.os),
          values: data.map((d) => d.count),
          marker: {
            colors: data.map((d) => d.color),
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
      <h3 className="text-lg font-semibold text-white mb-4">
        {t("OSDistribution")}
      </h3>
      <div ref={chartRef} style={{ height: "300px" }} />
    </div>
  );
};
