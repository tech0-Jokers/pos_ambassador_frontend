import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  TooltipProps,
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

// RechartsのTooltipPropsを使用して型定義を追加
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltipContent
        payload={payload.map((item) => ({
          name: item.payload.age, // payloadの正確なプロパティを指定
          value: item.payload.percentage,
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
