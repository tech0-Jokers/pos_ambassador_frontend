"use client"; // クライアントサイドでレンダリングする必要がある場合に使用

import { useState, useEffect } from "react";
import "../globals.css"; // グローバルなCSSファイルをインポート
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FrequencyDonutChart from "@/components/chart/FrequencyDonutChart";
import AgeDistributionChart from "@/components/chart/AgeDistributionChart";
import BranchUsageChart from "@/components/chart/BranchUsageChart";

// モックデータ（APIからのデータがまだ準備されていない場合に使用）
const initialFrequencyData = [
  { name: "5回以上", value: 20 },
  { name: "4回", value: 25 },
  { name: "3回", value: 30 },
  { name: "2回", value: 15 },
  { name: "1回", value: 10 },
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

// APIデータを取得する汎用関数
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`
    );
    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("データの取得に失敗しました:", error);
    throw new Error("データ取得エラー");
  }
};

// バックエンドのAPIエンドポイントからMessage数を取得する関数
const fetchMessageCount = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`);

    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.total_messages;
  } catch (error) {
    console.error("メッセージ数の取得に失敗しました:", error);
    throw new Error(
      error instanceof Error ? error.message : "予期せぬエラーが発生しました"
    );
  }
};

export default function Component() {
  // ステート（Reactのコンポーネント内で変数を管理するためのもの）
  const [selectedMonth, setSelectedMonth] = useState("2023年4月");
  const [messageCount, setMessageCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [frequencyData, setFrequencyData] = useState(initialFrequencyData);
  const [ageData, setAgeData] = useState(initialAgeData);
  const [branchData, setBranchData] = useState(initialBranchData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // データ取得用の副作用（useEffectを使用）
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true); // ローディング状態を開始
        setError(null); // エラー状態をリセット

        // APIからデータを取得（タイムアウトを設定）
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("データ取得がタイムアウトしました")),
            10000
          )
        );

        const dataPromise = new Promise(
          (resolve) =>
            setTimeout(() => {
              resolve({
                messages: 470,
                totalUsers: 370,
                frequencyData: initialFrequencyData,
                ageData: initialAgeData,
                branchData: initialBranchData,
              });
            }, 2000) // 2秒後にデータを返す
        );

        const data = await Promise.race([dataPromise, timeoutPromise]); // タイムアウトとデータ取得の競合
        setMessageCount(data.messages);
        setTotalUsers(data.totalUsers);
        setFrequencyData(data.frequencyData);
        setAgeData(data.ageData);
        setBranchData(data.branchData);
        setLoading(false); // ローディング状態を終了
      } catch (err) {
        setError(err.message || "データ取得エラーが発生しました");
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedMonth]); // selectedMonthが変更されたときに再実行

  // ローディング中の表示
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-900"></div>
          <p className="mt-4 text-purple-900">データを読み込んでいます...</p>
        </div>
      </div>
    );

  // エラーが発生した場合の表示
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

  // メインのUI
  return (
    <div className="no-background">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-900">
            テクワン株式会社
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">管理者A</span>
          </div>
        </div>

        {/* セレクトボックス */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-purple-600">
            表示する年月をえらぶ！
          </span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-[300px] bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="2023年4月">2023年4月</option>
            <option value="2023年3月">2023年3月</option>
            <option value="2023年2月">2023年2月</option>
          </select>
        </div>

        {/* カードとチャートのグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* サマリーカード */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-purple-900">
                サマリー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="text-sm text-gray-600">メッセージ数</div>
                <div className="text-4xl font-bold text-purple-900">
                  {messageCount}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">総利用人数</div>
                <div className="text-4xl font-bold text-purple-900">
                  {fetchMessageCount} 数
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 利用回数チャート */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-purple-900">
                週当たり利用回数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FrequencyDonutChart frequencyData={frequencyData} />
            </CardContent>
          </Card>

          {/* 年代別利用率チャート */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-purple-900">
                年代別利用率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AgeDistributionChart ageData={ageData} />
            </CardContent>
          </Card>

          {/* 部署別利用食数チャート */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-purple-900">
                部署別利用食数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BranchUsageChart branchData={branchData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
