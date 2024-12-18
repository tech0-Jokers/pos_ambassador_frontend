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
import BarcodeScanner from "@/components/archive/BarcodeScanner"; // スキャナをインポート
import { useRouter } from "next/navigation";

export default function SnackRegistrationApp() {
  const router = useRouter(); // ルーターを初期化
  const [step, setStep] = useState(0);
  const [price, setPrice] = useState<number>(0); // priceは数値として扱う
  const [itemName, setItemName] = useState(""); // 品名手動入力用
  const [barcodeResult, setBarcodeResult] = useState(""); // 読み込み結果用
  const [quantity, setQuantity] = useState<number>(0); // quantityも数値として扱う
  const [items, setItems] = useState<Array<{ name: string; quantity: number }>>(
    []
  );
  const [showScanner, setShowScanner] = useState(false); // スキャナ表示管理

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const addItem = () => {
    setItems([
      ...items,
      { name: itemName || barcodeResult, quantity: quantity },
    ]);
    setItemName("");
    setQuantity(0); // quantityをリセット
    setBarcodeResult(""); // リセット
  };

  // アイテム削除関数
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // スキャン結果（商品名）を反映させる
  const handleScanResult = (productName: string) => {
    setItemName(productName); // 商品名を品名入力欄に反映
    setShowScanner(false); // スキャナを非表示にする
  };

  // データをFastAPIに送信する関数
  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recieving_register`, // 環境変数を使ったURL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: price, // priceは数値型で送信
            items: items,
            entryDate: new Date().toISOString(), // 入庫日として現在の日付を送信
          }),
        }
      );

      if (response.ok) {
        alert("登録完了！");
      } else {
        const errorData = await response.json();
        alert(`登録失敗: ${errorData.message}`);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラー発生しました");
    }
  };

  const renderStep = () => (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      {(() => {
        switch (step) {
          case 0:
            return (
              <>
                <CardHeader>
                  <CardTitle className="text-center text-3xl">
                    やあ、アンバサダー！今回は何する？
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="gray"
                    className="w-full h-16 text-xl justify-start px-6"
                    onClick={nextStep}
                  >
                    買ってきたお菓子を登録する
                  </Button>

                  <Button
                    variant="gray"
                    className="w-full h-16 text-xl justify-start px-6"
                    onClick={() => router.push("/dashboard")}
                  >
                    管理画面をみる
                  </Button>
                </CardContent>
              </>
            );
          case 1:
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
                    onChange={(e) => setPrice(parseFloat(e.target.value))} // 数値に変換してセット
                    placeholder="金額"
                    className="text-xl h-16 px-6 w-full"
                  />
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    variant="gray"
                    onClick={prevStep}
                    className="text-xl px-6 py-3"
                  >
                    戻る
                  </Button>
                  <Button
                    variant="gray"
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
                    バーコードスキャン
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="text-xl w-full py-3"
                  >
                    バーコードスキャン
                  </Button>

                  {showScanner && (
                    <>
                      <div className="mt-4">
                        <BarcodeScanner onScan={handleScanResult} />
                      </div>
                    </>
                  )}

                  <Input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="品名(手動入力も可能)"
                    className="text-xl h-16 px-6 w-full"
                  />

                  <Input
                    type="number"
                    value={quantity.toString()} // 数値型のまま扱う
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    placeholder="個数を手動で入力してください"
                    className="text-xl h-16 px-6 w-full"
                  />

                  <Button onClick={addItem} className="text-xl w-full py-3">
                    追加
                  </Button>

                  <div className="mt-4 h-[200px] overflow-y-auto border p-4 rounded-md">
                    <p className="text-lg font-semibold mb-2">リスト:</p>
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
                    variant="gray"
                    onClick={prevStep}
                    className="text-xl px-6 py-3"
                  >
                    戻る
                  </Button>
                  <Button
                    variant="gray"
                    onClick={nextStep}
                    className="text-xl px-6 py-3"
                  >
                    次へ
                  </Button>
                </CardFooter>
              </>
            );
          case 3:
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
                    variant="gray"
                    onClick={prevStep}
                    className="text-xl px-6 py-3"
                  >
                    戻る
                  </Button>
                  <Button
                    onClick={handleRegister} // 登録処理
                    className="text-xl px-6 py-3"
                  >
                    登録！
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
      <div className="w-full max-w-2xl">{renderStep()}</div>
    </div>
  );
}
