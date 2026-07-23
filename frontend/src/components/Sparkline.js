/**
 * Sparkline Component
 * Mini gráfico inline para mostrar tendencia de precio
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const Sparkline = ({ data, isPositive = true }) => {
  if (!data || data.length === 0) {
    return <div className="sparkline-empty">No data</div>;
  }

  const prices = data.map(d => d.price);
  const labels = data.map((d, idx) => idx);

  const chartData = {
    labels,
    datasets: [
      {
        data: prices,
        borderColor: isPositive ? '#10b981' : '#ef4444',
        backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="sparkline-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Sparkline;
