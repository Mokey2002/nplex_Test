"use client";

import { useUmaSetPoints } from "@/lib/dataset";
import Plot from 'react-plotly.js';


export default function Page() {
  const { datasets } = useUmaSetPoints();
  console.log(datasets)
  const xCoordinates = datasets?.map((point) => point.x_coor);
  const yCoordinates = datasets?.map((point) => point.y_coor);
  console.log(xCoordinates);
  console.log(yCoordinates);
  return (
    <>
     <Plot
      data={[
        {
          x: xCoordinates,
          y: yCoordinates,
          type: "scatter",
          mode: "markers",
          marker: { color: "green", size: 6 },
        },
      ]}
      layout={{
        title: "UMAP Scatter Plot",
        xaxis: { title: "X Coordinate" },
        yaxis: { title: "Y Coordinate" },
      }}
      style={{ width: "100%", height: "400px" }}
    />
      <p>Add your UMAP code here</p>
    </>
  );
}
