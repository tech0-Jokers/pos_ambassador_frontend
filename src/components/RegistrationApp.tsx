"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRegistration } from "@/context/RegistrationContext";
import DbSnackRegistration from "@/components/DbSnackRegistration";
import NewSnackRegistration from "@/components/NewSnackRegistration";

// Snack型を定義
type Snack = {
  productId: number; // 商品IDを追加
  name: string;
  quantity: number;
};

export default function RegistrationApp() {
  const { snacks, setSnacks, currentSnack, setCurrentSnack, snacksData } =
    useRegistration() as {
      snacks: Snack[];
      setSnacks: React.Dispatch<React.SetStateAction<Snack[]>>;
      currentSnack: string;
      setCurrentSnack: React.Dispatch<React.SetStateAction<string>>;
      snacksData: Snack[]; // snacksData の型も追加
    };
  const [currentView, setCurrentView] = useState("main");
  const [step, setStep] = useState(0);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [subView, setSubView] = useState<
    "none" | "dbSnackRegistration" | "newSnackRegistration"
  >("none");

  const addItem = () => {
    if (currentSnack && quantity > 0) {
      const productId = getProductIdByName(currentSnack); // 商品IDを取得（後述）
      if (productId === -1) {
        alert("無効な商品です。");
        return;
      }

      setSnacks([...snacks, { productId, name: currentSnack, quantity }]);
      setCurrentSnack(""); // 初期化
      setQuantity(0); // 初期化
    }
  };

  const getProductIdByName = (name: string): number => {
    const product = snacksData.find((snack) => snack.name === name); // snacksDataは商品リスト
    return product?.productId || -1; // 該当しない場合は-1を返す
  };

  const handleRegister = async () => {
    try {
      // リクエストデータを準備
      const requestBody = {
        entryDate: new Date().toISOString(), // 現在日時
        price: price, // 合計金額
        userId: 1, // ユーザーID（固定）
        organizationId: 1, // 組織ID（固定）
        items: snacks.map((snack) => ({
          productId: snack.productId, // 商品ID
          quantity: snack.quantity, // 入庫個数
        })),
      };

      // FastAPIへPOSTリクエストを送信
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recieving_register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        alert("登録完了！");
        setCurrentView("main");
        setStep(0);
        setSnacks([]);
        setPrice(0);
      } else {
        const errorData = await response.json();
        alert(`登録失敗: ${errorData.message}`);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラー発生しました");
    }
  };

  const renderMainView = () => (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg transparent-container">
      <CardHeader>
        <CardTitle className="text-center text-3xl">
          やあ、アンバサダー！今回は何する？
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-16 text-xl justify-start px-6"
          onClick={() => {
            setCurrentView("snackRegistration");
            setStep(0);
          }}
        >
          お菓子入庫
        </Button>
        <Button
          variant="outline"
          className="w-full h-16 text-xl justify-start px-6"
          onClick={() => alert("お菓子購入機能は準備中です")}
        >
          お菓子購入
        </Button>
        <Button
          variant="outline"
          className="w-full h-16 text-xl justify-start px-6"
          onClick={() => alert("管理画面は準備中です")}
        >
          管理画面
        </Button>
        <Button
          variant="outline"
          className="w-full h-16 text-xl justify-start px-6"
          onClick={() => alert("設定変更機能は準備中です")}
        >
          設定変更
        </Button>
      </CardContent>
    </Card>
  );

  const renderSnackRegistration = () => (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg transparent-container">
      {(() => {
        switch (step) {
          case 0:
            return (
              <>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    買い付けたお菓子の金額を入力しよう！
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    placeholder="金額"
                    className="text-xl h-16 px-6 w-full"
                  />
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentView("main")}
                    className="text-xl px-6 py-3"
                  >
                    戻る
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="text-xl px-6 py-3"
                  >
                    次へ
                  </Button>
                </CardFooter>
              </>
            );
          case 1:
            return (
              <>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    お菓子登録画面
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4 justify-center">
                    <Button
                      onClick={() => setSubView("dbSnackRegistration")}
                      className="text-xl py-3 h-auto whitespace-normal text-center bg-purple-700 text-white hover:bg-purple-800"
                    >
                      データベースから登録
                    </Button>
                    <Button
                      onClick={() => setSubView("newSnackRegistration")}
                      className="text-xl py-3 h-auto whitespace-normal text-center bg-purple-700 text-white hover:bg-purple-800"
                    >
                      新しく登録
                    </Button>
                  </div>
                  <div className="mt-4 p-4 border rounded-md">
                    <p className="text-lg font-semibold mb-2">
                      登録するお菓子（個数を入力してください）:
                    </p>
                    <Input
                      value={
                        typeof currentSnack === "string" ? currentSnack : ""
                      }
                      placeholder="お菓子の名前"
                      readOnly
                      className="text-xl h-16 px-6 w-full mb-2"
                    />
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      placeholder="個数"
                      className="text-xl h-16 px-6 w-full mb-2"
                    />
                    <Button
                      onClick={addItem}
                      className="text-xl w-full py-3 bg-purple-700 text-white hover:bg-purple-800"
                    >
                      追加
                    </Button>
                  </div>
                  <div className="mt-4 h-[200px] overflow-y-auto border p-4 rounded-md">
                    {snacks.length > 0 ? (
                      snacks.map((snack, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <p className="text-xl">
                            {snack.name}: {snack.quantity}個
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => removeItem(index)} // 削除処理を呼び出す
                            className="text-red-500 p-2 rounded-full flex items-center justify-center"
                            title="削除" // ボタンの説明をツールチップで表示
                          >
                            ✕
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">まだ追加されていません。</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(0)}
                    className="text-xl px-6 py-3"
                  >
                    戻る
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="text-xl px-6 py-3"
                  >
                    次へ
                  </Button>
                </CardFooter>
              </>
            );
          case 2:
            return (
              <>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    これでよければ登録してくださいね！
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl">合計: {price}円</p>
                  <div className="h-[200px] overflow-y-auto border p-4 text-xl">
                    {snacks.map((snack, index) => (
                      <p key={index}>
                        {snack.name}: {snack.quantity}個
                      </p>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="text-xl px-6 py-3"
                  >
                    戻る
                  </Button>
                  <Button
                    onClick={handleRegister}
                    className="text-xl px-6 py-3 bg-purple-700 text-white"
                  >
                    登録
                  </Button>
                </CardFooter>
              </>
            );
        }
      })()}
    </Card>
  );

  // 削除ロジック
  const removeItem = (index: number) => {
    const updatedSnacks = snacks.filter((_, i) => i !== index);
    setSnacks(updatedSnacks);
  };

  const renderDbSnackRegistration = () => (
    <DbSnackRegistration returnToCase1={() => setSubView("none")} />
  );

  const renderNewSnackRegistration = () => (
    <NewSnackRegistration returnToCase1={() => setSubView("none")} />
  );

  return (
    <div className="flex justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        {subView === "none" && currentView === "main" && renderMainView()}
        {subView === "none" &&
          currentView === "snackRegistration" &&
          renderSnackRegistration()}
        {subView === "dbSnackRegistration" && renderDbSnackRegistration()}
        {subView === "newSnackRegistration" && renderNewSnackRegistration()}
      </div>
    </div>
  );
}
