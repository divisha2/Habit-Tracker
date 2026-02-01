import React, { memo } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { subMonths, format } from 'date-fns';

const HeatmapCalendar = memo(({ data = [], className = '' }) => {
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);

  const calendarData = data.map(item => ({
    day: item.day,
    value: item.value
  }));

  const theme = {
    background: 'transparent',
    text: {
      fontSize: 11,
      fill: '#6B7280',
      outlineWidth: 0,
      outlineColor: 'transparent'
    },
    tooltip: {
      container: {
        background: 'white',
        border: '1px solid #F5E6D3',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        color: '#243B4A',
        fontSize: '12px',
        padding: '8px 12px'
      }
    }
  };

  return (
    <div className={`${className}`}>
      <div className="h-40 w-full">
        {calendarData.length > 0 ? (
          <ResponsiveCalendar
            data={calendarData}
            from={format(sixMonthsAgo, 'yyyy-MM-dd')}
            to={format(today, 'yyyy-MM-dd')}
            emptyColor="#F5E6D3"
            colors={[
              '#dbeafe',
              '#bfdbfe', 
              '#93c5fd',
              '#60a5fa',
              '#3b82f6'
            ]}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            yearSpacing={40}
            monthBorderWidth={2}
            monthBorderColor="#E8D4C0"
            dayBorderWidth={1}
            dayBorderColor="#F5E6D3"
            dayRadius={3}
            theme={theme}
            tooltip={({ day, value, color }) => (
              <div className="text-center">
                <div className="font-medium">{format(new Date(day), 'MMM dd, yyyy')}</div>
                <div className="text-sm text-gray-600">
                  {value || 0} habit{(value || 0) !== 1 ? 's' : ''} completed
                </div>
              </div>
            )}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">No activity data yet</div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent">
        <div className="text-xs text-muted">Less</div>
        <div className="flex items-center gap-1">
          {['#dbeafe',
              '#bfdbfe',
              '#93c5fd',
              '#60a5fa',
              '#3b82f6'].map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="text-xs text-muted">More</div>
      </div>
    </div>
  );
};

export default memo(HeatmapCalendar);