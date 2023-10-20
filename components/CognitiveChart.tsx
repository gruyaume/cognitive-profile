import React, { useEffect } from "react";

import Chart from "chart.js/auto";
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
  {
    id: "drawVerticalLinesManually",
    beforeDatasetsDraw: (chart, args, options) => {
      console.log("Executing drawVerticalLinesManually plugin...");

      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;

      const separatorIndices = options.separatorIndices;
      const allIndices = options.allIndices;
      console.log("All indices: ", allIndices);

      ctx.strokeStyle = "rgba(128,128,128,1)";
      ctx.lineWidth = 2;

      separatorIndices.forEach((index: number) => {
        const startLabel = allIndices[Math.floor(index)];
        const endLabel = allIndices[Math.ceil(index)];

        const startXPos = xAxis.getPixelForValue(startLabel);
        const endXPos = xAxis.getPixelForValue(endLabel);
        const middleXPos = (startXPos + endXPos) / 2;

        console.log(
          `Trying to draw line between ${startLabel} and ${endLabel} at position: ${middleXPos}`
        );

        ctx.beginPath();
        ctx.moveTo(middleXPos, yAxis.getPixelForValue(0));
        ctx.lineTo(middleXPos, yAxis.getPixelForValue(100));
        ctx.stroke();
      });
    },
  },
  {
    id: "customYLabels",
    beforeDatasetsDraw: (chart, args, options) => {
      const ctx = chart.canvas.getContext("2d");
      if (!ctx) return;

      const yScale = chart.scales.y;

      ctx.fillStyle = "#333";
      ctx.globalAlpha = 0.8;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.font = `${options.fontSize}px Arial`;

      const xOffset = chart.chartArea.left - 25;

      PERCENTILE_LABELS.forEach((entry) => {
        const middleValue = (entry.from + entry.to) / 2;
        const yPos = yScale.getPixelForValue(middleValue);
        ctx.fillText(entry.label, xOffset, yPos);
      });

      ctx.globalAlpha = 1.0;
    },
  },
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
      ctx.globalAlpha = 0.5;

      const yOffset =
        chart.chartArea.top +
        (chart.chartArea.bottom - chart.chartArea.top) / 2;

      const fontSizeFunctionNames = options.fontSize * 2;
      ctx.font = `bold ${fontSizeFunctionNames}px Arial`;

      lastSeparatorIndex = 0;
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
  const [fontSize, setFontSize] = React.useState(16); // default value

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
          left: 200,
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
            minRotation: 50,
            font: {
              size: fontSize,
            },
          },
          grid: {
            drawOnChartArea: false,
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
        drawVerticalLinesManually: {
          separatorIndices: separatorIndices,
          allIndices: allIndices,
        },
        customCanvasBackgroundColor: {},
        customFunctionLabelDrawing: {
          data: data,
          allIndices: allIndices,
          fontSize: fontSize,
        },
        customYLabels: {
          fontSize: fontSize,
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
  }, [config, fontSize]);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      let newSize = 16;
      if (width <= 480) newSize = 10;
      else if (width <= 768) newSize = 12;
      else if (width <= 1200) newSize = 14;
      setFontSize(newSize);
    };
    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return <canvas ref={canvasRef} />;
};

export default CognitiveChart;
