import React from "react";

import { lazy } from "react";
let Plot = lazy(() => import("react-plotly.js"));

export function HistoryGraph({ data }: any) {
  console.log("DATA: ", data);
  return (
    <>
      <Plot
        data={data || []}
        layout={{
          height: 320,
          width: 600,
          xaxis: {
            showticklabels: true,
            ticks: "",
            range: [-0.5, data[0]?.x.length + 1 || 20],
            showline: true,
          },
          yaxis: {
            showticklabels: true,
            ticks: "",
            showline: true,
            range: [0, data.biggerValue + 1 || 20],
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </>
  );
}
