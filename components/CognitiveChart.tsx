import React, { useEffect } from "react";

import Chart from "chart.js/auto";
import Annotation from "chartjs-plugin-annotation";
import { ChartConfiguration } from "chart.js";

const COLORS = [
  "#ff6384", // red
  "#ff9f40", // orange
  "#ffcd56", // yellow
  "#66cc66", // green
  "#36a2eb", // blue
  "#9966ff", // purple
  "#ff80b3", // pink
];

type FunctionMap = {
  [functionName: string]: {
    [indexName: string]: number;
  };
};

const SEPARATION_POINTS = [1, 5.5, 17, 50, 83, 94.5, 99, 100];

const PERCENTILE_LABELS = [
  { from: 0, to: 2, label: "Extrêmement bas" },
  { from: 2, to: 9, label: "Inférieur à la moyenne" },
  { from: 9, to: 25, label: "Basse Moyenne" },
  { from: 25, to: 75, label: "Moyenne" },
  { from: 75, to: 91, label: "Haute Moyenne" },
  { from: 91, to: 98, label: "Supérieur à la moyenne" },
  { from: 98, to: 100, label: "Exceptionnellement élevé" },
];

type ChartData = {
  [functionName: string]: {
    [indexName: string]: number;
  };
};

const createGradient = (
  ctx: CanvasRenderingContext2D,
  yScale: any
): CanvasGradient => {
  const gradient = ctx.createLinearGradient(
    0,
    yScale.getPixelForValue(0),
    0,
    yScale.getPixelForValue(100)
  );

  SEPARATION_POINTS.forEach((value, index, array) => {
    if (index < array.length - 1) {
      const position = value / 100;
      gradient.addColorStop(position, COLORS[index]);
    }
  });

  return gradient;
};

Chart.register(
  Annotation,
  {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart, args, options) => {
      const ctx = chart.canvas.getContext("2d");
      if (!ctx) return;
      const yScale = chart.scales.y;
      const gradient = createGradient(ctx, yScale);

      ctx.fillStyle = gradient;
      ctx.fillRect(
        chart.chartArea.left,
        yScale.getPixelForValue(0),
        chart.chartArea.width,
        yScale.getPixelForValue(100) - yScale.getPixelForValue(0)
      );
    },
  },
  {
    id: "customFunctionLabelDrawing",
    beforeDatasetsDraw: (chart, args, options) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const chartData: ChartData = options.data;
      const allIndices = options.allIndices;
      let lastSeparatorIndex = 0;

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "bold 40px Arial";
      ctx.globalAlpha = 0.5;

      const yOffset =
        chart.chartArea.top +
        (chart.chartArea.bottom - chart.chartArea.top) / 2;

      for (const [functionName, functionData] of Object.entries(chartData)) {
        const functionLength = Object.keys(functionData).length;
        const startingLabel = allIndices[lastSeparatorIndex];
        const endingLabel = allIndices[lastSeparatorIndex + functionLength - 1];

        const startingPosition = xAxis.getPixelForValue(startingLabel);
        const endingPosition = xAxis.getPixelForValue(endingLabel);
        const centerPosition = (startingPosition + endingPosition) / 2;

        ctx.fillText(functionName, centerPosition, yOffset);

        lastSeparatorIndex += functionLength;
      }

      ctx.globalAlpha = 1.0;
    },
  },
  {
    id: "customYLabels",
    afterDraw: (chart) => {
      const ctx = chart.canvas.getContext("2d");
      if (!ctx) return;

      const yScale = chart.scales.y;

      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.5;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.font = "14px Arial";

      PERCENTILE_LABELS.forEach((entry) => {
        const yPos = yScale.getPixelForValue(entry.from);
        ctx.fillText(entry.label, chart.chartArea.left + 5, yPos);
      });

      ctx.globalAlpha = 1.0;
    },
  }
);

interface CognitiveChartProps {
  data: FunctionMap;
  age: number | null;
  caseNumber: string;
}

const populateDataArrays = (data: ChartData) => {
  const allIndices: string[] = [];
  const percentiles: number[] = [];
  const separatorIndices: number[] = [];
  let currentCount = 0;

  for (const functionName in data) {
    currentCount += Object.keys(data[functionName]).length;
    separatorIndices.push(currentCount - 0.5);
    for (const index in data[functionName]) {
      allIndices.push(index);
      percentiles.push(data[functionName][index]);
    }
  }
  return { allIndices, percentiles, separatorIndices };
};

const CognitiveChart: React.FC<CognitiveChartProps> = ({
  data,
  age,
  caseNumber,
}) => {
  const { allIndices, percentiles, separatorIndices } = React.useMemo(
    () => populateDataArrays(data),
    [data]
  );

  const config = {
    type: "line",
    data: {
      labels: allIndices,
      datasets: [
        {
          label: "Percentile",
          data: percentiles,
          fill: false,
          borderColor: "black",
          tension: 0.1,
        },
      ],
    },
    options: {
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: {
            color: function (ctx) {
              const specificValues = [2, 9, 25, 75, 91, 98];
              const value = ctx.tick.value;
              if (specificValues.includes(value)) {
                return "rgba(128,128,128,1)";
              }
              return "transparent";
            },
            drawTicks: false,
            drawOnChartArea: true,
          },
          ticks: {
            font: {
              size: 16,
            },
          },
          afterBuildTicks: function (scale) {
            const specificValues = [2, 9, 25, 75, 91, 98];
            scale.ticks = specificValues.map((value) => ({
              value: value,
              label: value.toString(),
            }));
          },
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
            font: {
              size: 16,
            },
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: age !== null ? `#${caseNumber} (${age} ans)` : `#${caseNumber}`,
          font: {
            size: 32,
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        annotation: {
          annotations: separatorIndices.map((index) => ({
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: index,
            borderColor: "rgba(128,128,128,1)",
            borderWidth: 2,
            yMin: 0,
            yMax: "max",
          })),
        },

        customCanvasBackgroundColor: {},
        customFunctionLabelDrawing: {
          data: data,
          allIndices: allIndices,
        },
        drawVerticalLines: {
          separatorIndices: separatorIndices,
        },
        legend: {
          display: false,
        },
      },
    },
  } as ChartConfiguration;

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartRef = React.useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, config);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [config]);

  return <canvas ref={canvasRef} />;
};

export default CognitiveChart;
