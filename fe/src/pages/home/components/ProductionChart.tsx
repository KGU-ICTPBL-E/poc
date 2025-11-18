import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProductionChartProps {
  data: Array<{ hour: string; production: number; defect: number }>;
}

export default function ProductionChart({ data }: ProductionChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">시간별 생산량</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 11 }}
            interval={2}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="production" fill="#14B8A6" name="정상품" radius={[4, 4, 0, 0]} />
          <Bar dataKey="defect" fill="#F97316" name="불량품" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}