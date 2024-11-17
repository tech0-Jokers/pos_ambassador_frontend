"use client";

import { useState, useEffect } from "react";
import "../globals.css"; // CSSファイルのパスを指定
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import FrequencyDonutChart from "@/components/chart/FrequencyDonutChart";

// Mock data
const initialFrequencyData = [
  { name: "5回以上", value: 20, color: "hsl(var(--chart-1))" },
  { name: "4回", value: 25, color: "hsl(var(--chart-2))" },
  { name: "3回", value: 30, color: "hsl(var(--chart-3))" },
  { name: "2回", value: 15, color: "hsl(var(--chart-4))" },
  { name: "1回", value: 10, color: "hsl(var(--chart-5))" },
];

const initialAgeData = [
  { age: "20代", percentage: 15 },
  { age: "30代", percentage: 35 },
  { age: "40代", percentage: 20 },
  { age: "50代", percentage: 10 },
  { age: "60代以上", percentage: 20 },
];

const initialBranchData = [
  { name: "品川本社", value: 180 },
  { name: "札幌支社", value: 185 },
  { name: "静岡支社", value: 250 },
  { name: "名古屋支社", value: 300 },
  { name: "恵比寿支社", value: 250 },
  { name: "仙台支社", value: 190 },
  { name: "広島支社", value: 350 },
  { name: "福岡支社", value: 250 },
  { name: "浅草支社", value: 380 },
];

const UsageTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].name} : ${payload[0].value} 回`}</p>
      </div>
    );
  }
  return null;
};

const handleChange = (event) => {
  setSelectedMonth(event.target.value);
};

export default function Component() {
  const [selectedMonth, setSelectedMonth] = useState("2023年4月");
  const [totalMeals, setTotalMeals] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [frequencyData, setFrequencyData] = useState(initialFrequencyData);
  const [ageData, setAgeData] = useState(initialAgeData);
  const [branchData, setBranchData] = useState(initialBranchData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("データの取得を開始します...");

        // タイムアウトを設定
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("データ取得がタイムアウトしました")),
            10000
          )
        );

        // 実際のデータ取得（ここではモックデータを使用）
        const dataPromise = new Promise((resolve) => {
          setTimeout(() => {
            console.log("データを取得しました");
            resolve({
              totalMeals: 470,
              totalUsers: 370,
              frequencyData,
              ageData,
              branchData,
            });
          }, 2000); // 2秒後にデータを返す（実際のAPIコールに置き換えてください）
        });

        // データ取得とタイムアウトを競合
        const data = await Promise.race([dataPromise, timeoutPromise]);

        // データの更新
        setTotalMeals(data.totalMeals);
        setTotalUsers(data.totalUsers);
        setFrequencyData(data.frequencyData);
        setAgeData(data.ageData);
        setBranchData(data.branchData);

        setLoading(false);
        console.log("データの取得が完了しました");
      } catch (err) {
        console.error("エラーが発生しました:", err);
        setError(err.message || "データの取得中にエラーが発生しました。");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-900"></div>
          <p className="mt-4 text-purple-900">データを読み込んでいます...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p className="text-2xl font-bold mb-4">エラーが発生しました</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  return (
    <div className="no-background">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-900">
            テクワン株式会社
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">管理者A</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-purple-600">
            表示する年月をえらぶ！
          </span>
          <select
            value={selectedMonth}
            onChange={handleChange}
            className="w-[300px] bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="2023年4月">2023年4月</option>
            <option value="2023年3月">2023年3月</option>
            <option value="2023年2月">2023年2月</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-purple-900">
                サマリー
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">総利用食数</div>
                <div className="text-4xl font-bold text-purple-900">
                  {totalMeals} 食
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">総利用人数</div>
                <div className="text-4xl font-bold text-purple-900">
                  {totalUsers} 人
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frequency Donut Chart */}
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
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-center mt-4">
                平均 3.4 回（前月��� 0.1回）
                <br />
                週3回以上 72 %（前月比 0.3%）
              </div>
            </CardContent>
          </Card>

          {/* Age Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-purple-900">
                年代別利用率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} unit="%" />
                    <YAxis dataKey="age" type="category" width={50} />
                    <Bar
                      dataKey="percentage"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                    <ChartTooltip content={<UsageTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Branch Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-purple-900">
              部署別利用食数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchData}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
