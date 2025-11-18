import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ZoneChartProps {
  data: Array<{ time: string; value: number }>;
  zoneName: string;
  color: string;
}

export default function ZoneChart({ data, zoneName, color }: ZoneChartProps) {
  return (
    <div className="bg-white rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{zoneName}</h4>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 50]}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}