import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, parseISO } from 'date-fns';

const TrendChart = ({ data = [], className = '', type = 'line' }) => {
  const chartData = data.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd'),
    fullDate: item.date
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-accent rounded-lg p-3 shadow-lg">
          <div className="font-semibold text-secondary">
            {format(parseISO(data.fullDate), 'MMMM dd, yyyy')}
          </div>
          <div className="text-sm text-muted mt-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              Completions: {payload[0].value}
            </div>
            <div className="text-xs text-muted mt-1">
              {data.percentage}% completion rate
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${className}`}>
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DA627D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#DA627D" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#F5E6D3"
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke="#DA627D"
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  dot={{ fill: '#DA627D', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#DA627D', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#F5E6D3"
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#DA627D"
                  strokeWidth={3}
                  dot={{ fill: '#DA627D', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#DA627D', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">No trend data available</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {chartData.length > 0 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent">
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">
              {Math.max(...chartData.map(d => d.completions))}
            </div>
            <div className="text-xs text-muted">Peak Day</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">
              {Math.round(chartData.reduce((sum, d) => sum + d.completions, 0) / chartData.length)}
            </div>
            <div className="text-xs text-muted">Avg/Day</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">
              {Math.round(chartData.reduce((sum, d) => sum + d.percentage, 0) / chartData.length)}%
            </div>
            <div className="text-xs text-muted">Avg Rate</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendChart;