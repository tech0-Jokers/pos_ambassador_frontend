"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SalesExpenseCard from "@/components/chart/SalesExpenseCard";
import BarChartComponent from "@/components/chart/BarChartComponent";
import RankingList from "@/components/chart/RankingList";
import MessageList from "@/components/chart/MessageList";
import { userMap } from "@/utils/userMap";

interface SalesData {
  sales: number;
  expense: number;
}

interface Message {
  date: string;
  sender: string;
  receiver: string;
  text: string;
}

export default function Dashboard() {
  const router = useRouter(); // ルーターを取得
  const { data: session } = useSession(); // セッション情報を取得

  // ユーザー名から user_id と organization_id を取得
  const userData = session?.user?.name ? userMap[session.user.name] : null;
  const organization_id = userData?.organization_id || (session ? 404 : 1); // ログイン中にデータがなければ404、未ログインなら1
  // ここで organization_id を使用（UIやロジックで利用）
  console.log("Organization ID:", organization_id); // デバッグ用の出力

  const [salesData] = useState<SalesData>({
    sales: 120000,
    expense: 50000,
  });
  const [sendData] = useState<{ name: string; value: number }[]>([
    { name: "品川本社", value: 150 },
    { name: "札幌支社", value: 200 },
    { name: "名古屋支社", value: 300 },
    { name: "福岡支社", value: 180 },
    { name: "大阪支社", value: 250 },
    { name: "仙台支社", value: 120 },
  ]);
  const [receiveData] = useState<{ name: string; value: number }[]>([
    { name: "品川本社", value: 130 },
    { name: "札幌支社", value: 220 },
    { name: "名古屋支社", value: 310 },
    { name: "福岡支社", value: 200 },
    { name: "大阪支社", value: 240 },
    { name: "仙台支社", value: 180 },
  ]);
  const [rankingData] = useState<{ name: string; value: number }[]>([
    { name: "チョコレート", value: 50 },
    { name: "キャンディ", value: 40 },
    { name: "クッキー", value: 30 },
  ]);
  const [messages] = useState<Message[]>([
    {
      date: "12/8 10:00",
      sender: "山田",
      receiver: "佐藤",
      text: "いつも本当に助かっています。ありがとう！",
    },
    {
      date: "12/8 09:50",
      sender: "田中",
      receiver: "鈴木",
      text: "お菓子がめっちゃ美味しくて家族の分も買っちゃいました♡",
    },
    {
      date: "12/8 09:00",
      sender: "佐藤",
      receiver: "高橋",
      text: "おい、聞いたか？田中さん異動らしいよ。",
    },
  ]);

  // 上位5件を抽出
  const top5SendData = [...sendData]
    .sort((a, b) => b.value - a.value) // 値で降順ソート
    .slice(0, 5); // 上位5件のみ抽出

  const top5ReceiveData = [...receiveData]
    .sort((a, b) => b.value - a.value) // 値で降順ソート
    .slice(0, 5); // 上位5件のみ抽出

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold text-black">テクワン株式会社</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800 ml-8"
        >
          戻る
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 売り上げ / 費用 */}
        <SalesExpenseCard sales={salesData.sales} expense={salesData.expense} />

        {/* メッセージ送信数・受信数（上位5件） */}
        <BarChartComponent title="メッセージ送信数(top5)" data={top5SendData} />
        <BarChartComponent
          title="メッセージ受信数(top5)"
          data={top5ReceiveData}
        />

        {/* お菓子購入数ランキング */}
        <RankingList data={rankingData} title="お菓子購入数ランキング" />

        {/* 新着メッセージ */}
        <MessageList data={messages} className="col-span-2" />
      </div>
    </div>
  );
}
