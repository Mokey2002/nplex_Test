"use client";

import dynamic from "next/dynamic";
import { useUmaSetPoints, useUmaSetPointsWithMetadata, useSignals } from "@/lib/dataset";
import { useState, useEffect } from "react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Page() {
  const [filter, setFilter] = useState<string>(""); // Filter for Donor
  const [selectedSignal, setSelectedSignal] = useState<string>(""); // Selected Signal
  const [chartData, setChartData] = useState<any[]>([]);
  const [primaryVisible, setPrimaryVisible] = useState(false);
  const [secondaryVisible, setSecondaryVisible] = useState(false);

  const primaryId = 3;
  const secondaryId = 4;

  // Fetch primary and secondary datasets
  const { datasets: primaryData } = useUmaSetPoints(primaryId);
  const { datasets: filteredPrimaryData } = useUmaSetPointsWithMetadata(
    primaryId,
    filter ? { donor: filter } : {}
  );
  const { datasets: secondaryData } = useUmaSetPoints(secondaryId);

  // Fetch signals dynamically based on the selected signal and donor filter
  const { cdataset: primarySignals } = useSignals(
    primaryId,
    selectedSignal,
    filter ? { donor: filter } : {}
  );
  const { cdataset: secondarySignals } = useSignals(
    secondaryId,
    selectedSignal,
    filter ? { donor: filter } : {}
  );

  useEffect(() => {
    const updatedChartData = [];

    // Add Primary Data
    if (primaryVisible) {
      const data = ((filter ? filteredPrimaryData : primaryData) || []) as any[];
      const trace = {
        x: data.map((point) => point.x_coor),
        y: data.map((point) => point.y_coor),
        type: "scatter",
        mode: "markers",
        marker: {
          color: selectedSignal
            ? primarySignals?.map((point) => point.signal)
            : "green",
          size: 6,
          colorscale: selectedSignal ? "Viridis" : undefined,
          colorbar: selectedSignal ? { title: `${selectedSignal} Signal` } : undefined,
        },
        name: "Primary Data",
      };
      updatedChartData.push(trace);
    }

    // Add Secondary Data
    if (secondaryVisible) {
      const data = (secondaryData || []) as any[];
      const trace = {
        x: data.map((point) => point.x_coor),
        y: data.map((point) => point.y_coor),
        type: "scatter",
        mode: "markers",
        marker: {
          color: selectedSignal
            ? secondarySignals?.map((point) => point.signal)
            : "blue",
          size: 6,
          colorscale: selectedSignal ? "Viridis" : undefined,
          colorbar: selectedSignal ? { title: `${selectedSignal} Signal` } : undefined,
        },
        name: "Secondary Data",
      };
      updatedChartData.push(trace);
    }

    setChartData(updatedChartData);
  }, [
    primaryVisible,
    secondaryVisible,
    selectedSignal,
    filter,
    primaryData,
    filteredPrimaryData,
    secondaryData,
    primarySignals,
    secondarySignals,
  ]);

  return (
    <div>
      {/* Donor Filter Dropdown */}
      <select
        onChange={(e) => setFilter(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Select Donor</option>
        <option value="Donor 1">Donor 1</option>
        <option value="Donor 2">Donor 2</option>
      </select>

      {/* Signal Selection Dropdown */}
      <select
        onChange={(e) => setSelectedSignal(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Select Signal</option>
        <option value="April">April</option>
        <option value="BAFF">BAFF</option>
        <option value="CCL1">CCL1</option>
        <option value="CNTF">CNTF</option>
        <option value="IFN gamma">IFN gamma</option>
        <option value="Mesothelin">Mesothelin</option>
        <option value="PDGF-BB">PDGF-BB</option>
        <option value="TWEAK">TWEAK</option>
        <option value="uPA">uPA</option>
        <option value="PD-1">PD-1</option>
      </select>

      {/* Primary Data Button */}
      <button
        onClick={() => setPrimaryVisible((prev) => !prev)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: primaryVisible ? "darkgreen" : "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        {primaryVisible ? "Remove Primary Data" : "Plot Primary Data"}
      </button>

      {/* Secondary Data Button */}
      <button
        onClick={() => setSecondaryVisible((prev) => !prev)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: secondaryVisible ? "darkblue" : "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        {secondaryVisible ? "Remove Secondary Data" : "Plot Secondary Data"}
      </button>

      {/* Plotly Visualization */}
      <Plot
        data={chartData}
        layout={{
          title: "Dynamic UMAP Scatter Plot",
          xaxis: { title: "X Coordinate" },
          yaxis: { title: "Y Coordinate" },
          height: 600,
        }}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
}
