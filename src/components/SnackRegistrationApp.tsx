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
import BarcodeScanner from "@/components/BarcodeScanner"; // スキャナをインポート

export default function SnackRegistrationApp() {
  const [step, setStep] = useState(0);
  const [price, setPrice] = useState("");
  const [itemName, setItemName] = useState(""); // 品名手動入力用
  const [barcodeResult, setBarcodeResult] = useState(""); // 読み込み結果用
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState<Array<{ name: string; quantity: number }>>(
    []
  );
  const [showScanner, setShowScanner] = useState(false); // スキャナ表示管理

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const addItem = () => {
    setItems([
      ...items,
      { name: itemName || barcodeResult, quantity: parseInt(quantity) },
    ]);
    setItemName("");
    setQuantity("");
    setBarcodeResult(""); // リセット
  };

  // アイテム削除関数
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleScanResult = (scannedCode: string) => {
    setBarcodeResult(scannedCode); // 読み込み結果に表示
    setShowScanner(false); // スキャナを非表示にする
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
                  >
                    みんなとチャットする
                  </Button>
                  <Button
                    variant="gray"
                    className="w-full h-16 text-xl justify-start px-6"
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
                    onChange={(e) => setPrice(e.target.value)}
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

                      <Input
                        value={barcodeResult}
                        readOnly
                        placeholder="読み込み結果がここに表示されます"
                        className="text-xl h-16 px-6 w-full"
                      />
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
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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
                    onClick={() => alert("登録完了！")}
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
