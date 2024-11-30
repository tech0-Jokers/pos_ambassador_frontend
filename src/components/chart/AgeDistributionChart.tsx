import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { ChartTooltipContent } from "@/components/ui/ChartTooltipContent";

interface AgeData {
  age: string;
  percentage: number;
}

interface AgeDistributionChartProps {
  ageData: AgeData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltipContent
        payload={payload.map((item: any) => ({
          name: item.age,
          value: item.value,
        }))}
        label={label}
      />
    );
  }
  return null;
};

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({
  ageData,
}) => (
  <ChartContainer className="h-[200px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={ageData} layout="vertical">
        <XAxis type="number" domain={[0, 100]} unit="%" />
        <YAxis dataKey="age" type="category" width={50} />
        <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
          {ageData.map((entry, index) => {
            const hue = (index / ageData.length) * 360;
            return (
              <Cell key={`cell-${index}`} fill={`hsl(${hue}, 70%, 50%)`} />
            );
          })}
        </Bar>
        <Tooltip content={<CustomTooltip />} />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

export default AgeDistributionChart;
