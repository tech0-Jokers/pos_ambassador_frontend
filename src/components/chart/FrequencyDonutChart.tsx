import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltipContent } from "@/components/ui/ChartTooltipContent";

interface FrequencyData {
  value: number;
  color: string;
  // その他必要なプロパティ
}

interface FrequencyDonutChartProps {
  frequencyData: FrequencyData[];
  average: number;
  averageDiff: number;
  weeklyUsagePercent: number;
  weeklyUsagePercentDiff: number;
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

const FrequencyDonutChart: React.FC<FrequencyDonutChartProps> = ({
  frequencyData,
  average,
  averageDiff,
  weeklyUsagePercent,
  weeklyUsagePercentDiff,
}) => (
  <Card>
    <CardContent>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={frequencyData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {frequencyData.map((entry, index) => {
                const hue = (index / frequencyData.length) * 360; // 色相を計算
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${hue}, 70%, 50%)`} // HSL色空間で色を指定
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-center mt-4">
        平均 {average} 回（前月比 {averageDiff}回）
        <br />
        週3回以上 {weeklyUsagePercent} %（前月比 {weeklyUsagePercentDiff}%）
      </div>
    </CardContent>
  </Card>
);

export default FrequencyDonutChart;
