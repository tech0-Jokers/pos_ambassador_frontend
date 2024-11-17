"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { userMap } from "@/utils/userMap";

// Props型
type DbSnackRegistrationProps = {
  returnToCase1: () => void;
};

// APIレスポンスの型（バックエンドの生データ型）
type ApiSnack = {
  product_id: number; // 商品ID
  product_name: string; // 商品名
  product_explanation: string | null; // 商品説明
  product_image_url: string | null; // 商品画像URL
};

// APIレスポンス型
type ApiResponse = {
  products: ApiSnack[]; // 商品リスト
};

export default function DbSnackRegistration({
  returnToCase1,
}: DbSnackRegistrationProps) {
  const [snackName, setSnackName] = useState("");
  const { setCurrentSnack, setSnacksData } = useRegistration(); // snacksDataを取得・更新
  const [snacks, setSnacks] = useState<ApiSnack[]>([]);
  const { data: session } = useSession(); // useSession から session を取得

  // サンプルデータ
  const sampleSnacks: ApiSnack[] = useMemo(
    () => [
      {
        product_id: 101,
        product_name: "ポテトチップス",
        product_explanation: "サクサクのポテトチップス",
        product_image_url:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788728/potechi_veyabd.webp",
      },
      {
        product_id: 102,
        product_name: "チョコレート",
        product_explanation: "濃厚なチョコレート",
        product_image_url:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788236/chocolate_na6lsh.webp",
      },
      {
        product_id: 103,
        product_name: "グミキャンディー",
        product_explanation: "フルーティーなグミ",
        product_image_url:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788535/fruitgumi_hd5flb.webp",
      },
      {
        product_id: 104,
        product_name: "ポップコーン",
        product_explanation: "甘いポッポコーン",
        product_image_url:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788850/carapop_njcrsq.webp",
      },
    ],
    []
  );

  // データ取得ロジック
  useEffect(() => {
    const fetchSnacks = async () => {
      const userData = session?.user?.name ? userMap[session.user.name] : null;
      const organization_id = session ? userData?.organization_id || 404 : 1;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/snacks/?organization_id=${organization_id}`
        );

        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const data: ApiResponse = await response.json();
        const mergedSnacks = [...sampleSnacks, ...data.products];
        setSnacks(mergedSnacks);
        setSnacksData(mergedSnacks);
      } catch (error) {
        console.error("Error fetching snacks:", error);
        setSnacks(sampleSnacks);
        setSnacksData(sampleSnacks);
      }
    };

    fetchSnacks();
  }, [sampleSnacks, setSnacksData]);

  // 検索機能
  const filteredSnacks = snackName.trim()
    ? snacks.filter((snack) =>
        snack.product_name
          .toLowerCase()
          .includes(snackName.trim().toLowerCase())
      )
    : [];

  // 登録処理
  const handleRegister = (snack: ApiSnack) => {
    console.log("Registered snack object:", snack);
    console.log("Registered snack name:", snack.product_name);

    // snack データを currentSnack にセット
    setCurrentSnack({
      product_name: snack.product_name,
      product_id: snack.product_id, // ApiSnack の product_id を利用
    });

    // 遷移を遅らせて、state の反映を確実にする
    setTimeout(() => {
      returnToCase1();
    }, 200); // 適宜調整
  };

  // JSX
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">データベースからお菓子を登録</h1>
      <Input
        value={snackName}
        onChange={(e) => setSnackName(e.target.value)}
        placeholder="お菓子の名前を入力"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      {snackName.trim() && filteredSnacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSnacks.map((snack, index) => (
            <Card
              key={index}
              className="flex flex-col items-center p-4 shadow-md transparent-container"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {snack.product_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center text-center pb-6">
                <p>{snack.product_explanation || "説明なし"}</p>
                <Image
                  src={
                    snack.product_image_url || "https://via.placeholder.com/150"
                  }
                  alt={snack.product_name}
                  width={160}
                  height={160}
                  className="mt-2 w-40 h-40 object-cover rounded-md"
                />
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  onClick={() => handleRegister(snack)}
                  className="bg-purple-700 text-white hover:bg-purple-800"
                >
                  登録
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : snackName.trim() ? (
        <p className="text-gray-500">該当するお菓子が見つかりません。</p>
      ) : null}
      <Button
        onClick={returnToCase1}
        className="mt-4 bg-purple-700 text-white hover:bg-purple-800"
      >
        戻る
      </Button>
    </div>
  );
}
