import React, { useEffect, useRef } from 'react';

const CostChart = ({ 
  costs,
  generateGradient,
  groupCostsByYear 
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && costs.length > 0) {
      drawChart();
    }
  }, [costs]);

  const drawChart = () => {
    if (!chartRef.current || costs.length === 0) return;
    
    const getFullYearMonths = () => {
      const year = costs.length > 0 && costs[0].month ? 
        costs[0].month.substring(0, 4) : 
        new Date().getFullYear().toString();
      
      const allMonths = [];
      for (let i = 1; i <= 12; i++) {
        allMonths.push({
          month: `${year}-${String(i).padStart(2, '0')}`,
          totalCost: 0
        });
      }
      
      costs.forEach(cost => {
        if (cost.month && typeof cost.month === 'string') {
          const monthIndex = parseInt(cost.month.substring(5, 7), 10) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            allMonths[monthIndex].totalCost = cost.totalCost;
          }
        }
      });
      
      return allMonths;
    };
    
    let costsToDisplay = getFullYearMonths();
    
    if (costsToDisplay.length === 0) return;
    
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const sortedCosts = [...costsToDisplay].sort((a, b) => {
      return new Date(a.month + '-01') - new Date(b.month + '-01');
    });
    
    const maxCost = Math.max(...sortedCosts.map(c => Number(c.totalCost)));
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = Math.max(15, chartWidth / sortedCosts.length - 10);
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#CBD5E0';
    ctx.stroke();
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#4A5568';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * chartHeight / 5);
      const value = (maxCost * i / 5).toFixed(2);
      ctx.fillText('Rs' + value, padding - 35, y + 5);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#EDF2F7';
      ctx.stroke();
    }
    
    sortedCosts.forEach((cost, i) => {
      const x = padding + (i * (chartWidth / sortedCosts.length)) + (chartWidth / sortedCosts.length - barWidth) / 2;
      const costValue = Number(cost.totalCost);
      const barHeight = (costValue / maxCost) * chartHeight;
      const y = height - padding - barHeight;
      
      ctx.fillStyle = generateGradient(ctx, x, y, barWidth, barHeight);
      ctx.fillRect(x, y, barWidth, barHeight);
      
      ctx.fillStyle = '#2D3748';
      ctx.font = '10px Arial';
      ctx.fillText('Rs' + costValue.toFixed(2), x, y - 5);
      
      ctx.fillStyle = '#4A5568';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      
      const label = typeof cost.month === 'string' && cost.month.includes('-') 
          ? cost.month.substring(0, 7)
          : cost.month;
      
      if (sortedCosts.length > 6) {
        ctx.save();
        ctx.translate(x + barWidth / 2, height - padding + 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(label, 0, 10);
        ctx.restore();
      } else {
        ctx.fillText(label, x + barWidth / 2, height - padding + 15);
      }
    });
    
    ctx.textAlign = 'start';
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Monthly Cost Trends</h3>
      </div>
      <div className="h-80 w-full relative">
        <canvas ref={chartRef} width="800" height="400" className="w-full h-full"></canvas>
      </div>
    </div>
  );
};

export default CostChart;