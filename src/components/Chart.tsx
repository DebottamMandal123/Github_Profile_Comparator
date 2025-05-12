import { ChartOptions } from 'chart.js';
import React from 'react'
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


interface ChartProps {
  myName: string,
  comparerName: string
  user1Contributions: { [year: string]: number };
  user2Contributions: { [year: string]: number };
  startYear: number;
  endYear: number;
  maxYValue: number
}

export const Chart: React.FC<ChartProps> = ({ myName, comparerName, user1Contributions, user2Contributions, startYear, endYear, maxYValue }) => {

  console.log("Chart component received props:", {
    myName,
    comparerName,
    user1Contributions,
    user2Contributions,
    startYear,
    endYear,
    maxYValue
  });

  const labels = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());
  console.log("Generated labels:", labels);

  const data = {
    labels,
    datasets: [
      {
        label: `${myName}`,
        data: labels.map(year => user1Contributions[year] || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 1)",
        fill: false,
        pointRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(75, 192, 192, 1)",
        pointBorderWidth: 2
      },
      {
        label: `${comparerName}`,
        data: labels.map(year => user2Contributions[year] || 0),
        borderColor: "#FFA62B",
        backgroundColor: "#FFA62B",
        fill: false,
        pointRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(75, 192, 192, 1)",
        pointBorderWidth: 2
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    aspectRatio: 4,
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.15)', 
        }
      },
      y: {
        type: 'linear',
        min: 0,
        max: Math.ceil(maxYValue / 500) * 500,
        ticks: {
          stepSize: 500,
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.15)', 
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          boxHeight: 35,
          boxWidth: 35, 
          usePointStyle: false,
          padding: 30, 
          font: {
            size: 20
          },
          useBorderRadius: true,
          borderRadius: 3
        },
        align: 'start'
      },
      tooltip: {
        titleColor: 'white',
        bodyColor: 'white',
      },
    }
  };

  return (
    <div style={{ height: '500px', width: '900px' }}>
      <Line data={data} options={options} />
    </div>
  );
}