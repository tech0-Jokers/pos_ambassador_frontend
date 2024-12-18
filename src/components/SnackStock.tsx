"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { userMap } from "@/utils/userMap";

type Snack = {
  product_id: number;
  product_name: string;
  product_explanation: string | null;
  product_image_url: string | null;
  stock_quantity: number;
  sales_amount: number;
};

export default function SnackStock({
  returnToMain,
}: {
  returnToMain: () => void;
}) {
  const { data: session } = useSession();
  const [snackName, setSnackName] = useState<string>("");
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [updatedPrices, setUpdatedPrices] = useState<{
    [product_id: number]: number;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const userData = session?.user?.name ? userMap[session.user.name] : null;
  const organization_id = session ? userData?.organization_id || 404 : 1;

  useEffect(() => {
    if (!organization_id || organization_id === 404) {
      console.error("組織IDが不明です。データを取得できません。");
      setLoading(false);
      return;
    }

    const fetchStockData = async () => {
      try {
        const response = await fetch("/api/snack-stock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ organization_id }),
        });

        if (!response.ok) {
          throw new Error("在庫データの取得に失敗しました");
        }

        const data: Snack[] = await response.json();
        setSnacks(data || []);
      } catch (error) {
        console.error("在庫データ取得エラー:", error);
        setSnacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [organization_id]);

  const handlePriceSubmit = async (product_id: number) => {
    const newPrice = updatedPrices[product_id];
    try {
      const response = await fetch("/api/snack-stock/update-price", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id,
          product_id,
          sales_amount: newPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("値段変更に失敗しました");
      }

      setSnacks((prev) =>
        prev.map((snack) =>
          snack.product_id === product_id
            ? { ...snack, sales_amount: newPrice }
            : snack
        )
      );
      setUpdatedPrices((prev) => {
        const updated = { ...prev };
        delete updated[product_id];
        return updated;
      });
    } catch (error) {
      console.error("値段変更エラー:", error);
    }
  };

  const filteredSnacks = snackName.trim()
    ? snacks.filter((snack) =>
        snack.product_name
          .toLowerCase()
          .includes(snackName.trim().toLowerCase())
      )
    : snacks;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">お菓子の在庫情報</h1>

      {organization_id === 404 ? (
        <p className="text-red-500 mb-4">
          組織IDが不明のため、データを表示できません。
        </p>
      ) : loading ? (
        <p className="text-gray-500">データを読み込んでいます...</p>
      ) : (
        <>
          <Input
            value={snackName}
            onChange={(e) => setSnackName(e.target.value)}
            placeholder="お菓子の名前を検索"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnacks.length > 0 ? (
              filteredSnacks.map((snack) => (
                <Card
                  key={snack.product_id}
                  className="flex flex-col items-center p-4 shadow-md transparent-container"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {snack.product_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center text-center pb-6">
                    <p className="text-gray-600">
                      {snack.product_explanation || "説明なし"}
                    </p>
                    <Image
                      src={
                        snack.product_image_url ||
                        "https://via.placeholder.com/150"
                      }
                      alt={snack.product_name}
                      width={160}
                      height={160}
                      className="mt-2 w-40 h-40 object-cover rounded-md"
                      unoptimized
                    />
                    <p className="mt-4 text-lg font-semibold text-gray-700">
                      在庫数: {snack.stock_quantity}個
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-700">
                      現在の値段: ¥{snack.sales_amount}
                    </p>
                    <Input
                      type="number"
                      placeholder="新しい値段を入力"
                      className="mt-2 p-2 border border-gray-300 rounded w-full"
                      value={updatedPrices[snack.product_id] || ""}
                      onChange={(e) =>
                        setUpdatedPrices({
                          ...updatedPrices,
                          [snack.product_id]: Number(e.target.value),
                        })
                      }
                    />
                    <Button
                      onClick={() => handlePriceSubmit(snack.product_id)}
                      className="bg-purple-700 text-white hover:bg-purple-800 mt-4"
                    >
                      値段変更確定
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">該当するデータがありません。</p>
            )}
          </div>
        </>
      )}
      <Button
        onClick={returnToMain}
        className="mt-4 bg-purple-700 text-white hover:bg-purple-800"
      >
        戻る
      </Button>
    </div>
  );
}
