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

// フロントエンドで使用する型
type Snack = {
  productId: number; // 商品ID
  name: string; // 商品名
  description: string; // 商品説明
  imageUrl: string; // 商品画像URL
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
  const [snacks, setSnacks] = useState<Snack[]>([]);

  // サンプルデータ
  const sampleSnacks: Snack[] = useMemo(
    () => [
      {
        productId: 101,
        name: "ポテトチップス",
        description: "サクサクのポテトチップス",
        imageUrl:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788728/potechi_veyabd.webp",
      },
      {
        productId: 102,
        name: "チョコレート",
        description: "濃厚なチョコレート",
        imageUrl:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788236/chocolate_na6lsh.webp",
      },
      {
        productId: 103,
        name: "グミキャンディー",
        description: "フルーティーなグミ",
        imageUrl:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788535/fruitgumi_hd5flb.webp",
      },
      {
        productId: 104,
        name: "ポップコーン",
        description: "甘いポッポコーン",
        imageUrl:
          "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788850/carapop_njcrsq.webp",
      },
    ],
    []
  );

  // データ取得ロジック
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const organizationId = 1;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/snacks/?organization_id=${organizationId}`
        );

        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const data: ApiResponse = await response.json();

        const databaseSnacks: Snack[] = data.products.map((snack) => ({
          productId: snack.product_id,
          name: snack.product_name,
          description: snack.product_explanation || "説明なし",
          imageUrl:
            snack.product_image_url || "https://via.placeholder.com/150",
        }));

        const mergedSnacks = [...sampleSnacks, ...databaseSnacks];
        setSnacks(mergedSnacks);
        setSnacksData(mergedSnacks);
      } catch (error) {
        console.error("Error fetching snacks:", error);
        setSnacks(sampleSnacks);
        setSnacksData(sampleSnacks);
      }
    };

    fetchSnacks();
  }, [sampleSnacks, setSnacksData]); // 依存関係を追加

  // 検索機能
  const filteredSnacks = snackName.trim()
    ? snacks.filter((snack) =>
        snack.name.toLowerCase().includes(snackName.trim().toLowerCase())
      )
    : [];

  // 登録処理
  const handleRegister = (snack: Snack) => {
    console.log("Registered snack object:", snack); // snackオブジェクトを確認
    console.log("Registered snack name:", snack.name); // snack.nameを確認
    setCurrentSnack(snack.name); // snack全体ではなく、名前だけをセット
    returnToCase1();
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
      {filteredSnacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSnacks.map((snack, index) => (
            <Card
              key={index}
              className="flex flex-col items-center p-4 shadow-md transparent-container"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {snack.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center text-center pb-6">
                <p>{snack.description}</p>
                <Image
                  src={snack.imageUrl}
                  alt={snack.name}
                  width={160} // 必要な幅
                  height={160} // 必要な高さ
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
      ) : (
        <p className="text-gray-500">該当するお菓子が見つかりません。</p>
      )}
      <Button
        onClick={returnToCase1}
        className="mt-4 bg-purple-700 text-white hover:bg-purple-800"
      >
        戻る
      </Button>
    </div>
  );
}
