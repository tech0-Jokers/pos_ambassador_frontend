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

// Snack型を修正
type Snack = {
  product_id: number; // 商品ID
  product_name: string; // 商品名
  incoming_quantity: number; // 入庫個数
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
  const [purchase_amount, setPurchaseAmount] = useState<number>(0); // 合計金額
  const [incoming_quantity, setIncomingQuantity] = useState<number>(0); // 入庫個数
  const [subView, setSubView] = useState<
    "none" | "dbSnackRegistration" | "newSnackRegistration"
  >("none");

  // 商品を追加する関数
  const addItem = () => {
    if (currentSnack && incoming_quantity > 0) {
      const product_id = getProductIdByName(currentSnack); // 商品IDを取得
      if (product_id === -1) {
        alert("無効な商品です。");
        return;
      }

      setSnacks([
        ...snacks,
        { product_id, product_name: currentSnack, incoming_quantity },
      ]);
      setCurrentSnack(""); // 初期化
      setIncomingQuantity(0); // 初期化
    }
  };

  // 商品名からproduct_idを取得する関数
  const getProductIdByName = (name: string): number => {
    const product = snacksData.find((snack) => snack.product_name === name); // snacksDataは商品リスト
    return product?.product_id || -1; // 該当しない場合は-1を返す
  };

  // 登録処理を実行する関数
  const handleRegister = async () => {
    try {
      // リクエストデータを準備
      const requestBody = {
        entryDate: new Date().toISOString(), // 現在日時
        purchase_amount, // 合計金額
        user_id: 1, // ユーザーID（固定）
        organization_id: 1, // 組織ID（固定）
        items: snacks.map((snack) => ({
          product_id: snack.product_id, // 商品ID
          incoming_quantity: snack.incoming_quantity, // 入庫個数
        })),
      };

      // FastAPIへPOSTリクエストを送信
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/receiving_register`,
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
        setPurchaseAmount(0);
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
                    value={purchase_amount}
                    onChange={(e) =>
                      setPurchaseAmount(parseInt(e.target.value))
                    }
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
                      value={incoming_quantity}
                      onChange={(e) =>
                        setIncomingQuantity(parseInt(e.target.value))
                      }
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
                            {snack.product_name}: {snack.incoming_quantity}個
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
        }
      })()}
    </Card>
  );

  // 削除ロジック
  const removeItem = (index: number) => {
    const updatedSnacks = snacks.filter((_, i) => i !== index);
    setSnacks(updatedSnacks);
  };

  const renderDbSnackRegistration = (): JSX.Element => (
    <DbSnackRegistration returnToCase1={() => setSubView("none")} />
  );

  const renderNewSnackRegistration = (): JSX.Element => (
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
