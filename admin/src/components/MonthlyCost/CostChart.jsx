import React, { useEffect, useRef } from 'react';

const CostChart = ({ 
  costs, 
  chartYear, 
  setChartYear, 
  groupCostsByYear, 
  generateGradient 
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && costs.length > 0) {
      drawChart();
    }
  }, [costs, chartYear]);

  // Draw chart using the canvas ref
  const drawChart = () => {
    if (!chartRef.current || costs.length === 0) return;
    
    // Filter costs by selected year if needed
    let costsToDisplay = costs;
    if (chartYear !== 'all') {
      costsToDisplay = costs.filter(cost => cost.month.startsWith(chartYear));
    }
    
    if (costsToDisplay.length === 0) return;
    
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Sort costs by month
    const sortedCosts = [...costsToDisplay].sort((a, b) => {
      return new Date(a.month + '-01') - new Date(b.month + '-01');
    });
    
    // Find max cost for scaling
    const maxCost = Math.max(...sortedCosts.map(c => Number(c.totalCost)));
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = Math.max(15, chartWidth / sortedCosts.length - 10);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#CBD5E0';
    ctx.stroke();
    
    // Draw y-axis labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#4A5568';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * chartHeight / 5);
      const value = (maxCost * i / 5).toFixed(2);
      ctx.fillText('$' + value, padding - 35, y + 5);
      
      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#EDF2F7';
      ctx.stroke();
    }
    
    // Draw bars and x-axis labels
    sortedCosts.forEach((cost, i) => {
      const x = padding + (i * (chartWidth / sortedCosts.length)) + (chartWidth / sortedCosts.length - barWidth) / 2;
      const costValue = Number(cost.totalCost);
      const barHeight = (costValue / maxCost) * chartHeight;
      const y = height - padding - barHeight;
      
      // Draw bar
      ctx.fillStyle = generateGradient(ctx, x, y, barWidth, barHeight);
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw bar value
      ctx.fillStyle = '#2D3748';
      ctx.font = '10px Arial';
      ctx.fillText('$' + costValue.toFixed(2), x, y - 5);
      
      // Draw year-month label (YYYY-MM format)
      ctx.fillStyle = '#4A5568';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      const label = cost.month; // Show full YYYY-MM format
      
      // Rotate the text if we have more than 6 months to display
      if (sortedCosts.length > 6) {
        ctx.save();
        ctx.translate(x + barWidth / 2, height - padding + 10);
        ctx.rotate(-Math.PI / 4); // Rotate -45 degrees
        ctx.fillText(label, 0, 10);
        ctx.restore();
      } else {
        ctx.fillText(label, x + barWidth / 2, height - padding + 15);
      }
    });
    
    // Reset text alignment
    ctx.textAlign = 'start';
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Monthly Cost Trends</h3>
        <select 
          value={chartYear} 
          onChange={(e) => setChartYear(e.target.value)}
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Years</option>
          {Object.keys(groupCostsByYear()).sort().reverse().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className="h-80 w-full relative">
        <canvas ref={chartRef} width="800" height="400" className="w-full h-full"></canvas>
      </div>
    </div>
  );
};

export default CostChart;