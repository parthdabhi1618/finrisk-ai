import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskMeterProps {
  probability: number;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ probability }) => {
  const data = [
    { value: probability },
    { value: 1 - probability },
  ];

  const getColor = (p: number) => {
    if (p < 0.25) return '#22c55e'; // Safe
    if (p < 0.5) return '#eab308'; // Warning
    if (p < 0.75) return '#f97316'; // High Risk
    return '#ef4444'; // Critical
  };

  const getLabel = (p: number) => {
    if (p < 0.25) return 'Safe';
    if (p < 0.5) return 'Stable';
    if (p < 0.75) return 'Vulnerable';
    return 'Critical';
  };

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor(probability)} />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: getColor(probability) }}>
          {(probability * 100).toFixed(1)}%
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>
          {getLabel(probability)}
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
