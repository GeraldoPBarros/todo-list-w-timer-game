import React, { useEffect, useState } from "react";

import { lazy } from "react";
let Plot = lazy(() => import("react-plotly.js"));

export function HistoryGraph({ data }: any) {
  const [graphData, setGraphData] = useState<any>(data || []);
  useEffect(() => {
    setGraphData(data);
  }, [data]);

  return (
    <>
      {graphData.length !== 0 && (
        <Plot
          data={[graphData]}
          layout={{
            height: 320,
            width: 500,
            xaxis: {
              showticklabels: true,
              ticks: "",
              range: [-0.5, data[0]?.x?.length + 1 || 20],
              showline: true,
              tickangle: 55,
            },
            yaxis: {
              showticklabels: true,
              ticks: "",
              showline: true,
              range: [0, data?.biggerValue + 1 || 20],
            },
          }}
          config={{ responsive: true, displayModeBar: false }}
        />
      )}
    </>
  );
}
