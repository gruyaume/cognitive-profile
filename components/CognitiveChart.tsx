import React from "react";
import Chart from "chart.js/auto";
import Annotation from "chartjs-plugin-annotation";

Chart.register(Annotation);
Chart.register({
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const ctx = chart.canvas.getContext("2d");
    const yScale = chart.scales.y;

    const colors = options.colors;
    const separations = options.separations;

    for (let i = 0; i < separations.length - 1; i++) {
      const start = yScale.getPixelForValue(separations[i]);
      const end = yScale.getPixelForValue(separations[i + 1]);
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, start, chart.width, end - start);
    }
  },
});

Chart.register({
  id: "drawVerticalLines",
  afterDraw: (chart, args, options) => {
    const ctx = chart.ctx;
    const xAxis = chart.scales.x;
    const separatorIndices = options.separatorIndices;

    const yOffset = chart.chartArea.bottom + 250;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    if (separatorIndices) {
      separatorIndices.forEach((index) => {
        const xPos = xAxis.getPixelForValue(index);
        ctx.beginPath();
        ctx.moveTo(xPos, chart.chartArea.top);
        ctx.lineTo(xPos, yOffset);
        ctx.stroke();
      });
    }
  },
});

Chart.register({
  id: "customFunctionLabelDrawing",
  afterDraw: (chart, args, options) => {
    const ctx = chart.ctx;
    const xAxis = chart.scales.x;
    const chartData = options.data;
    const allIndices = options.allIndices;
    let lastSeparatorIndex = 0;

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "bold 16px Arial";

    const yOffset = chart.chartArea.bottom + 250;

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
});

Chart.register({
  id: "drawGaussianCurve",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const yScale = chart.scales.y;

    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;

    const mean = 50;
    const stdDev = 15;
    const scaleFactor = 20;

    const gaussian = (x) => {
      return (
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) /
        (stdDev * Math.sqrt(2 * Math.PI))
      );
    };

    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const y = i;
      const x = gaussian(i) * scaleFactor;
      if (i === 0) {
        ctx.moveTo(x, yScale.getPixelForValue(y));
      } else {
        ctx.lineTo(x, yScale.getPixelForValue(y));
      }
    }
    ctx.stroke();
  },
});

interface ResultMapping {
  [functionName: string]: {
    [indexName: string]: number;
  };
}

interface CognitiveChartProps {
  data: ResultMapping;
}

const CognitiveChart: React.FC<CognitiveChartProps> = ({ data }) => {
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

  const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];
  const separations = [0, 2, 9, 25, 75, 91, 98, 100];

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
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
          },
        },
      },
      plugins: {
        customCanvasBackgroundColor: {
          colors: colors,
          separations: separations,
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
  };

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
