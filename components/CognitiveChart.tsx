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
    id: "drawVerticalLines",
    afterDraw: (chart, args, options) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const separatorIndices = options.separatorIndices;

      const yOffset = chart.chartArea.bottom + 280;

      ctx.strokeStyle = "grey";
      ctx.lineWidth = 2;

      if (separatorIndices) {
        separatorIndices.forEach((index: number) => {
          const xPos = xAxis.getPixelForValue(index);
          ctx.beginPath();
          ctx.moveTo(xPos, chart.chartArea.top);
          ctx.lineTo(xPos, yOffset);
          ctx.stroke();
        });
      }
    },
  },
  {
    id: "customFunctionLabelDrawing",
    afterDraw: (chart, args, options) => {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const chartData: ChartData = options.data;
      const allIndices = options.allIndices;
      let lastSeparatorIndex = 0;

      ctx.fillStyle = "grey";
      ctx.textAlign = "center";
      ctx.font = "bold 24px Arial";

      const yOffset = chart.chartArea.bottom + 280;

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
          bottom: 100,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            font: {
              size: 16,
            },
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
