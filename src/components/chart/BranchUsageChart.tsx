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

interface BranchData {
  name: string;
  value: number;
}

interface BranchUsageChartProps {
  branchData: BranchData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltipContent
        payload={payload.map((item: any) => ({
          name: item.name,
          value: item.value,
        }))}
        label={label}
      />
    );
  }
  return null;
};

const BranchUsageChart: React.FC<BranchUsageChartProps> = ({ branchData }) => (
  <ChartContainer className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={branchData}>
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {branchData.map((entry, index) => {
            const hue = (index / branchData.length) * 360;
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

export default BranchUsageChart;
