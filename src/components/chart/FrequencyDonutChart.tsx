// FrequencyDonutChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface FrequencyData {
  value: number;
  color: string;
  // その他必要なプロパティ
}

const CustomTooltip = (props: any) => {
  return props.payload ? (
    <ChartTooltipContent
      {...props}
      payload={props.payload as { name: string; value: number }[]}
      label={props.label || ""}
    />
  ) : null;
};

interface FrequencyDonutChartProps {
  frequencyData: FrequencyData[];
  average: number;
  averageDiff: number;
  weeklyUsagePercent: number;
  weeklyUsagePercentDiff: number;
}

export function FrequencyDonutChart({
  frequencyData,
  average,
  averageDiff,
  weeklyUsagePercent,
  weeklyUsagePercentDiff,
}: FrequencyDonutChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-900">
          一人あたりの週当たり利用回数
        </CardTitle>
      </CardHeader>
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
                {frequencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
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
}
