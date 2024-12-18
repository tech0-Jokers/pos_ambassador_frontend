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

export default function RegistrationApp() {
  const [currentView, setCurrentView] = useState("main");
  const [step, setStep] = useState(0);
  const [price, setPrice] = useState<number>(0); // 金額の状態
  const [items, setItems] = useState<Array<{ name: string; quantity: number }>>(
    []
  ); // アイテムリストの状態
  const [itemName, setItemName] = useState(""); // アイテム名の状態
  const [quantity, setQuantity] = useState<number>(0); // アイテム数の状態

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const addItem = () => {
    if (itemName && quantity > 0) {
      setItems([...items, { name: itemName, quantity: quantity }]);
      setItemName("");
      setQuantity(0);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recieving_register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: price,
            items: items,
            entryDate: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        alert("登録完了！");
        setCurrentView("main");
        setStep(0);
        setItems([]);
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
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-center text-3xl">
          やあ、アンバサダー！今回は何する？
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-16 text-xl justify-start px-6"
          onClick={() => setCurrentView("snackRegistration")}
        >
          お菓子入庫
        </Button>
      </CardContent>
    </Card>
  );

  const renderSnackRegistration = () => (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      {step === 0 ? (
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
              onClick={nextStep}
              className="text-xl px-6 py-3"
            >
              次へ
            </Button>
          </CardFooter>
        </>
      ) : step === 1 ? (
        <>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              お菓子登録画面
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mt-4 p-4 border rounded-md">
              <p className="text-lg font-semibold mb-2">
                登録するお菓子（個数を入力してください）:
              </p>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="お菓子の名前"
                className="text-xl h-16 px-6 w-full mb-2"
              />
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                placeholder="個数"
                className="text-xl h-16 px-6 w-full mb-2"
              />
              <Button onClick={addItem} className="text-xl w-full py-3">
                追加
              </Button>
            </div>
            <div className="mt-4 h-[200px] overflow-y-auto border p-4 rounded-md">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <p className="text-xl">
                      {item.name}: {item.quantity}個
                    </p>
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
              onClick={prevStep}
              className="text-xl px-6 py-3"
            >
              戻る
            </Button>
            <Button
              variant="outline"
              onClick={nextStep}
              className="text-xl px-6 py-3"
            >
              次へ
            </Button>
          </CardFooter>
        </>
      ) : step === 2 ? (
        <>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              これでよければ登録してくださいね！
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl">合計: {price}円</p>
            <div className="h-[200px] overflow-y-auto border p-4 text-xl">
              {items.map((item, index) => (
                <p key={index}>
                  {item.name}: {item.quantity}個
                </p>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              className="text-xl px-6 py-3"
            >
              戻る
            </Button>
            <Button onClick={handleRegister} className="text-xl px-6 py-3">
              登録
            </Button>
          </CardFooter>
        </>
      ) : (
        <div>別のステップ</div>
      )}
    </Card>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        {currentView === "main" ? renderMainView() : renderSnackRegistration()}
      </div>
    </div>
  );
}
