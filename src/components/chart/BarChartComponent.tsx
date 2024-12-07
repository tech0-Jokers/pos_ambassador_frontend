import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartComponentProps {
  title: string;
  data: { name: string; value: number }[];
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  title,
  data,
}) => {
  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-bold text-center mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 5, bottom: 70 }}
        >
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" barSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(${(index / data.length) * 360}, 70%, 50%)`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
