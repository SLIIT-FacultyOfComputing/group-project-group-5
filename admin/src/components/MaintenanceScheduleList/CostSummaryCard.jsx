import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CostSummaryCard = ({ schedules, className = '' }) => {
  const [activeType, setActiveType] = useState(null);
  const [chartView, setChartView] = useState('donut');
  const canvasRef = useRef(null);
  const legendRef = useRef(null);

  const { totalCost, averageCost, highestCost, lowestCost } = schedules.reduce((acc, s) => {
    const cost = parseFloat(s.maintenanceCost || 0);
    return {
      totalCost: acc.totalCost + cost,
      averageCost: schedules.length ? (acc.totalCost + cost) / schedules.length : 0,
      highestCost: Math.max(acc.highestCost, cost),
      lowestCost: acc.lowestCost === -1 && cost > 0 ? cost : (cost > 0 ? Math.min(acc.lowestCost, cost) : acc.lowestCost)
    };
  }, { totalCost: 0, averageCost: 0, highestCost: 0, lowestCost: -1 });

  const { costByType, costByMonth } = schedules.reduce((acc, schedule) => {
    const type = schedule.maintenanceType || 'OTHER';
    if (!acc.costByType[type]) {
      acc.costByType[type] = { total: 0, count: 0, schedules: [] };
    }
    acc.costByType[type].total += parseFloat(schedule.maintenanceCost || 0);
    acc.costByType[type].count += 1;
    acc.costByType[type].schedules.push(schedule);

    const date = new Date(schedule.maintenanceDate);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc.costByMonth[monthYear] = (acc.costByMonth[monthYear] || 0) + parseFloat(schedule.maintenanceCost || 0);

    return acc;
  }, { costByType: {}, costByMonth: {} });

  const sortedMonths = Object.keys(costByMonth).sort();

  const colorPalette = {
    'PREVENTIVE': '#3B82F6',     // Blue
    'CORRECTIVE': '#EF4444',     // Red
    'PREDICTIVE': '#10B981',     // Green
    'ROUTINE': '#F59E0B',        // Amber
    'EMERGENCY': '#EC4899',      // Pink
    'CONDITION_BASED': '#8B5CF6', // Purple
    
    'PLANNED': '#0EA5E9',        // Sky blue
    'UNPLANNED': '#F43F5E',      // Rose
    'INSPECTION': '#14B8A6',     // Teal
    'REPAIR': '#F97316',         // Orange
    'SERVICE': '#8B5CF6',        // Violet
    'REPLACEMENT': '#6366F1',    // Indigo
    'OTHER': '#6B7280'           // Gray
  };
  
  const [typeColorMap] = useState(() => {
    const map = {};
    const types = Object.keys(costByType);
    
    const fallbackColors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Amber
      '#EC4899', // Pink
      '#8B5CF6', // Purple
      '#0EA5E9', // Sky
      '#F97316', // Orange
      '#6366F1', // Indigo
      '#14B8A6', // Teal
      '#84CC16', // Lime
      '#F43F5E', // Rose
      '#6B7280', // Gray
    ];

    types.forEach((type, i) => {
      const paletteKey = Object.keys(colorPalette).find(key => key.toUpperCase() === type.toUpperCase());
      map[type] = paletteKey ? colorPalette[paletteKey] : fallbackColors[i % fallbackColors.length];
    });

    return map;
  });

  const getTypeColor = type => typeColorMap[type] || '#6B7280';
  const getPercentage = value => totalCost ? Math.round((value / totalCost) * 100) : 0;

  useEffect(() => {
    if (!canvasRef.current || Object.keys(costByType).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (chartView === 'donut') {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 20;
      let startAngle = 0;

      Object.entries(costByType).forEach(([type, data]) => {
        const sliceAngle = (data.total / totalCost) * 2 * Math.PI;
        const isActive = activeType === type;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, isActive ? radius + 5 : radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = getTypeColor(type);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (data.total / totalCost > 0.05) {
          const labelAngle = startAngle + sliceAngle / 2;
          const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
          const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${Math.round(data.total / totalCost * 100)}%`, labelX, labelY);
        }
        startAngle += sliceAngle;
      });

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Rs${totalCost.toFixed(0)}`, centerX, centerY - 8);;
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('Total Cost', centerX, centerY + 12);
    }
    else if (chartView === 'bar') {
      const barWidth = (width - 40) / Object.keys(costByType).length;
      const maxBarHeight = height - 60;
      const maxCost = Math.max(...Object.values(costByType).map(data => data.total));

      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(20, height - 20);
      ctx.lineTo(width - 20, height - 20);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();

      let barX = 30;
      Object.entries(costByType).forEach(([type, data]) => {
        const barHeight = (data.total / maxCost) * maxBarHeight;
        const isActive = activeType === type;

        ctx.fillStyle = getTypeColor(type);
        ctx.fillRect(barX, height - 20 - barHeight, barWidth - 10, barHeight);

        if (isActive) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(barX - 2, height - 20 - barHeight - 2, barWidth - 10 + 4, barHeight + 4);
        }

        ctx.fillStyle = '#1F2937';
        ctx.font = '10px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Rs${data.total.toFixed(0)}`, barX + (barWidth - 10) / 2, height - 20 - barHeight - 8);;

        ctx.fillStyle = '#6B7280';
        ctx.textAlign = 'center';
        ctx.fillText(type.substring(0, 8), barX + (barWidth - 10) / 2, height - 8);

        barX += barWidth;
      });
    }
    else if (chartView === 'trend') {
      const padding = { top: 20, right: 20, bottom: 30, left: 40 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, height - padding.bottom);
      ctx.lineTo(width - padding.right, height - padding.bottom);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!sortedMonths.length) {
        ctx.fillStyle = '#6B7280';
        ctx.font = '14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No trend data available', width / 2, height / 2);
        return;
      }

      const maxValue = Math.max(...Object.values(costByMonth));
      const barWidth = chartWidth / sortedMonths.length * 0.6;
      const barSpacing = chartWidth / sortedMonths.length * 0.4;

      sortedMonths.forEach((month, index) => {
        const cost = costByMonth[month];
        const barHeight = (cost / maxValue) * chartHeight;
        const barX = padding.left + (index * (barWidth + barSpacing)) + barSpacing / 2;
        const barY = height - padding.bottom - barHeight;

        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const [year, monthNum] = month.split('-');
        const shortMonth = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });
        ctx.fillStyle = '#6B7280';
        ctx.font = '10px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(shortMonth, barX + barWidth / 2, height - padding.bottom + 15);

        ctx.fillStyle = '#1F2937';
        ctx.textAlign = 'center';
        ctx.fillText(`Rs${cost.toFixed(0)}`, barX + barWidth / 2, barY - 5);;
      });

      for (let i = 0; i <= 5; i++) {
        const value = (maxValue / 5) * i;
        const y = height - padding.bottom - (chartHeight / 5) * i;

        ctx.fillStyle = '#6B7280';
        ctx.font = '10px Inter, system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`Rs${value.toFixed(0)}`, padding.left - 5, y + 3);;

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }, [schedules, costByType, costByMonth, sortedMonths, totalCost, activeType, chartView, typeColorMap]);

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Maintenance Cost Summary</h3>
        <div className="flex space-x-1 text-xs">
          {['donut', 'bar', 'trend'].map(view => (
            <button
              key={view}
              onClick={() => setChartView(view)}
              className={`px-3 py-1.5 rounded-md ${
                chartView === view ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {view === 'donut' ? 'Breakdown' : view === 'bar' ? 'Comparison' : 'Trend'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fadeIn">
          {[
            { bg: 'blue', icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z", label: "Total Cost", value: totalCost },
            { bg: 'green', icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", label: "Average Cost", value: averageCost },
            { bg: 'amber', icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: "Highest Cost", value: highestCost },
            { bg: 'indigo', icon: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6", label: "Lowest Cost", value: lowestCost === -1 ? 0 : lowestCost }
          ].map(({ bg, icon, label, value }, i) => (
            <div key={i} className={`bg-${bg}-50 rounded-lg p-3 border border-${bg}-100`}>
              <p className={`text-xs text-${bg}-600 mb-1 flex items-center`}>
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
                {label}
              </p>
              <p className="text-xl font-bold text-gray-800">Rs:{value.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-grow flex justify-center items-center min-h-[240px] md:min-h-[280px]">
            <canvas
              ref={canvasRef}
              width="280"
              height="280"
              className={`animate-fadeIn mx-auto ${chartView === 'trend' ? 'max-w-full' : ''}`}
            />
          </div>

          <div
            ref={legendRef}
            className={`md:w-64 mt-4 md:mt-0 md:ml-4 ${chartView === 'trend' ? 'hidden md:block' : ''}`}
          >
            <h4 className="text-sm font-medium text-gray-700 mb-3">Cost Breakdown</h4>
            <div className="space-y-2.5">
              {Object.entries(costByType).map(([type, data]) => (
                <div
                  key={type}
                  className={`flex items-center justify-between text-sm p-2 rounded-md transition-colors duration-200 hover:bg-gray-50 ${activeType === type ? 'bg-gray-50 shadow-sm' : ''}`}
                  onMouseEnter={() => setActiveType(type)}
                  onMouseLeave={() => setActiveType(null)}
                >
                  <div className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2 animate-pulse"
                      style={{
                        backgroundColor: getTypeColor(type),
                        animationDuration: '3s'
                      }}
                    />
                    <span className="text-gray-700 font-medium">{type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Rs:{data.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {getPercentage(data.total)}% • {data.count} items
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 italic">
              Hover over items to highlight in chart
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CostSummaryCard.propTypes = {
  schedules: PropTypes.array.isRequired,
  className: PropTypes.string
};

export default CostSummaryCard;