import React from "react";
import Chart from "chart.js/auto";
import Annotation from "chartjs-plugin-annotation";
import { ChartConfiguration } from "chart.js";

const COLORS = [
  "#ff6384",
  "#ff9f40",
  "#ffcd56",
  "#4bc0c0",
  "#36a2eb",
  "#9966ff",
  "#ff80b3",
];
const SEPARATIONS = [0, 2, 9, 25, 75, 91, 98, 100];

type ChartData = {
  [functionName: string]: {
    [indexName: string]: number;
  };
};

Chart.register(
  Annotation,
  {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart, args, options) => {
      const ctx = chart.canvas.getContext("2d");
      if (!ctx) return;

      const yScale = chart.scales.y;

      const colors = options.colors;
      const separations = options.separations;

      for (let i = 0; i < separations.length - 1; i++) {
        const start = yScale.getPixelForValue(separations[i]);
        const end = yScale.getPixelForValue(separations[i + 1]);
        ctx.fillStyle = colors[i];
        ctx.fillRect(
          chart.chartArea.left,
          start,
          chart.chartArea.width,
          end - start
        );
      }
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

interface ResultMapping {
  [functionName: string]: {
    [indexName: string]: number;
  };
}

interface CognitiveChartProps {
  data: ResultMapping;
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

const CognitiveChart: React.FC<CognitiveChartProps> = ({ data }) => {
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
        customCanvasBackgroundColor: {
          colors: COLORS,
          separations: SEPARATIONS,
        },
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
        annotation: {
          annotations: separatorIndices.map((index) => ({
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: index,
            borderColor: "black",
            yMin: 0,
            yMax: "max",
          })),
        },
      },
    },
  } as ChartConfiguration;

  return (
    <canvas
      ref={(canvas) => {
        if (canvas) {
          new Chart(canvas, config);
        }
      }}
    />
  );
};

export default CognitiveChart;
