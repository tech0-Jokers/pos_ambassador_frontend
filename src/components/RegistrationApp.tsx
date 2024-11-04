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
  const [price, setPrice] = useState<number>(0);
  const [items, setItems] = useState<Array<{ name: string; quantity: number }>>(
    []
  );
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const addItem = () => {
    if (itemName && quantity > 0) {
      setItems([...items, { name: itemName, quantity: quantity }]);
      setItemName("");
      setQuantity(0);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
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
          onClick={() => setCurrentView("snackRegistration")}
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
                    onClick={nextStep}
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
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() =>
                        alert("Meitex商品または履歴からの登録機能は準備中です")
                      }
                      className="text-xl py-3 h-auto whitespace-normal text-center"
                    >
                      Meitex商品またはこれまでの履歴から登録
                    </Button>
                    <Button
                      onClick={() =>
                        alert("新しいお菓子の登録・選択機能は準備中です")
                      }
                      className="text-xl py-3 h-auto whitespace-normal text-center"
                    >
                      新しくお菓子を登録・選択
                    </Button>
                  </div>
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
                          <Button
                            variant="destructive"
                            onClick={() => removeItem(index)}
                          >
                            削除
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
                  <Button
                    onClick={handleRegister}
                    className="text-xl px-6 py-3"
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

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        {currentView === "main" ? renderMainView() : renderSnackRegistration()}
      </div>
    </div>
  );
}
