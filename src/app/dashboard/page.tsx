"use client";

import { useState, useEffect } from "react";
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
  send_date: string;
  sender_name: string;
  receiver_name: string;
  message_content: string;
}

interface MessageCountData {
  sender_name: string; // 送信者名
  receiver_name: string; // 受信者名
  message_count: number; // メッセージ数
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  const userData = session?.user?.name ? userMap[session.user.name] : null;
  const organization_id = session ? userData?.organization_id || 404 : 1;

  const [salesData] = useState<SalesData>({
    sales: 120000,
    expense: 50000,
  });

  const defaultSendData = [
    { name: "佐藤", value: 150 },
    { name: "田中", value: 100 },
    { name: "ジョーカー", value: 90 },
    { name: "山田", value: 80 },
    { name: "中山", value: 50 },
  ];

  const defaultReceiveData = [
    { name: "ジョーカー", value: 180 },
    { name: "太田", value: 140 },
    { name: "田中", value: 120 },
    { name: "鈴木", value: 100 },
    { name: "高橋", value: 60 },
  ];

  const defaultRankingData = [
    { product_name: "おっかねえおかし", purchase_count: 50 },
    { product_name: "こちょこちょチョコ", purchase_count: 40 },
    { product_name: "あぶないクッキー", purchase_count: 30 },
  ];

  const defaultMessages: Message[] = [
    {
      send_date: "12/8 10:00",
      sender_name: "山田",
      receiver_name: "佐藤",
      message_content: "いつも本当に助かっています。ありがとう！",
    },
    {
      send_date: "12/8 09:50",
      sender_name: "田中",
      receiver_name: "鈴木",
      message_content: "お菓子がめっちゃ美味しくて家族の分も買っちゃいました♡",
    },
    {
      send_date: "12/8 09:00",
      sender_name: "佐藤",
      receiver_name: "高橋",
      message_content: "おい、聞いたか？田中さん異動らしいよ。",
    },
  ];

  const [sendData, setSendData] = useState<MessageCountData[]>([]);
  const [receiveData, setReceiveData] = useState<MessageCountData[]>([]);
  const [rankingData, setRankingData] = useState(defaultRankingData);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      try {
        console.log("Fetching data...");

        // ダッシュボードAPIのデータ取得
        const dashboardResponse = await fetch(
          `/api/dashboard?organization_id=${organization_id}`
        );
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log("Dashboard API Response:", dashboardData);
          setSendData(dashboardData.messageSendData || defaultSendData);
          setReceiveData(
            dashboardData.messageReceiveData || defaultReceiveData
          );
          setRankingData(dashboardData.snackRankingData || defaultRankingData);
        } else {
          console.error("Dashboard API Error:", await dashboardResponse.text());
        }

        // メッセージAPIのデータ取得
        const messagesResponse = await fetch(
          `/api/messages?organization_id=${organization_id}`
        );
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          console.log("Messages API Response:", messagesData);
          setMessages(messagesData || defaultMessages);
        } else {
          console.error("Messages API Error:", await messagesResponse.text());
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false);
        console.log("Fetch complete.");
      }
    }

    fetchDashboardData();
  }, [organization_id]);

  // マッピングしてトップ5を抽出
  const top5SendData = [...sendData]
    .map((item) => ({
      name: item.sender_name,
      value: item.message_count,
    }))
    .slice(0, 5);

  const top5ReceiveData = [...receiveData]
    .map((item) => ({
      name: item.receiver_name,
      value: item.message_count,
    }))
    .slice(0, 5);

  console.log("Messages being passed to MessageList:", messages);
  console.log(
    "Mapped Messages:",
    messages.map((message) => ({
      date: message.send_date,
      sender: message.sender_name,
      receiver: message.receiver_name,
      text: message.message_content,
    }))
  );
  console.log("Top 5 Send Data:", top5SendData);
  console.log("Top 5 Receive Data:", top5ReceiveData);
  console.log("Ranking Data being passed to RankingList:", rankingData);
  console.log("Default Send Data:", defaultSendData);
  console.log("Default Receive Data:", defaultReceiveData);
  console.log("Default Ranking Data:", defaultRankingData);
  console.log("Default Messages:", defaultMessages);

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
        <SalesExpenseCard sales={salesData.sales} expense={salesData.expense} />
        <BarChartComponent title="メッセージ送信数(top5)" data={top5SendData} />
        <BarChartComponent
          title="メッセージ受信数(top5)"
          data={top5ReceiveData}
        />
        <RankingList data={rankingData} title="お菓子購入数ランキング" />

        {loading ? (
          <p className="text-center">データを読み込み中...</p>
        ) : (
          // ログをここに追加
          <>
            <MessageList
              data={messages.map((message) => ({
                date: message.send_date,
                sender: message.sender_name,
                receiver: message.receiver_name,
                text: message.message_content,
              }))}
              className="col-span-2"
            />
          </>
        )}
      </div>
    </div>
  );
}
