"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { userMap } from "@/utils/userMap";
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
import SnackStock from "@/components/SnackStock";

// Snack型を修正
type Snack = {
  product_id: number; // 商品ID
  product_name: string; // 商品名
  incoming_quantity: number; // 入庫個数
};

export default function RegistrationApp() {
  const router = useRouter(); // ルーターを初期化
  const { data: session } = useSession();
  const {
    snacks,
    setSnacks,
    currentSnack,
    setCurrentSnack,
    snacksData,
    setSnacksData,
  } = useRegistration() as {
    snacks: Snack[];
    setSnacks: React.Dispatch<React.SetStateAction<Snack[]>>;
    currentSnack: { product_name: string; product_id: number }; // 修正
    setCurrentSnack: React.Dispatch<
      React.SetStateAction<{ product_name: string; product_id: number }>
    >; // 修正
    snacksData: Snack[];
    setSnacksData: React.Dispatch<React.SetStateAction<Snack[]>>;
  };

  const [currentView, setCurrentView] = useState("main");
  const [step, setStep] = useState(0);
  const [purchase_amount, setPurchaseAmount] = useState<number>(0);
  const [incoming_quantity, setIncomingQuantity] = useState<number>(0);
  const [subView, setSubView] = useState<
    "none" | "dbSnackRegistration" | "newSnackRegistration"
  >("none");

  // 商品を追加する関数
  const addItem = () => {
    console.log("currentSnack:", currentSnack);
    console.log("snacksData:", snacksData); // snacksDataの中身を確認

    if (currentSnack && incoming_quantity > 0) {
      const product_id = getProductIdByName(currentSnack.product_name); // 商品IDを取得
      console.log("product_id:", product_id); // product_idの値を確認
      if (product_id === -1) {
        alert("無効な商品です。");
        return;
      }

      setSnacks([
        ...snacks,
        {
          product_id,
          product_name: currentSnack.product_name,
          incoming_quantity,
        },
      ]);

      setIncomingQuantity(0); // 初期化

      // currentSnackをリセットする
      setCurrentSnack({ product_name: "", product_id: -1 });
    }
  };

  // 商品名からproduct_idを取得する関数
  const getProductIdByName = (name: string): number => {
    const product = snacksData.find((snack) => snack.product_name === name);
    return product?.product_id || -1;
  };

  // 登録処理を実行する関数
  const handleRegister = async () => {
    const userData = session?.user?.name ? userMap[session.user.name] : null;
    // 未ログインの場合は 1、ログイン済みで userMap に存在しない場合は 404
    const user_id = session ? userData?.user_id || 404 : 1;
    const organization_id = session ? userData?.organization_id || 404 : 1;

    const requestBody = {
      entryDate: new Date().toISOString(),
      purchase_amount,
      user_id,
      organization_id,
      items: snacks.map((snack) => ({
        product_id: snack.product_id,
        incoming_quantity: snack.incoming_quantity,
      })),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/receiving_register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const responseData = await response.json(); // APIから返されるレスポンスを取得
        console.log("Response data from API:", responseData); // APIからのレスポンスを確認

        // snacksDataに新しい商品を追加
        if (responseData.product_id && responseData.product_name) {
          setSnacksData((prevSnacksData) => {
            const updatedSnacksData = [
              ...prevSnacksData,
              {
                product_id: responseData.product_id, // 新しく登録された商品ID
                product_name: responseData.product_name, // 新しく登録された商品名
                incoming_quantity: 0, // 初期値を設定
              },
            ];
            console.log("Updated snacksData:", updatedSnacksData); // 更新されたsnacksDataを確認
            return updatedSnacksData;
          });
        }

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
          onClick={() => setCurrentView("snackRegistration")}
        >
          お菓子入庫
        </Button>
        <Button
          variant="outline"
          className="w-full h-16 text-xl justify-start px-6"
          onClick={() => setCurrentView("snackStock")} // 新しいビューを指定
        >
          在庫情報
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
          onClick={() => router.push("/snack-registration")}
        >
          開発中（お菓子登録機能）
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
                      value={currentSnack.product_name} // product_nameを指定
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
          case 2:
            return (
              <>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    これでよければ登録してくださいね！
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl">合計: {purchase_amount}円</p>
                  <div className="h-[200px] overflow-y-auto border p-4 text-xl">
                    {snacks.map((snack, index) => (
                      <p key={index}>
                        {snack.product_name}: {snack.incoming_quantity}個
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
        {subView === "none" && currentView === "snackStock" && (
          <SnackStock returnToMain={() => setCurrentView("main")} />
        )}
        {subView === "dbSnackRegistration" && renderDbSnackRegistration()}
        {subView === "newSnackRegistration" && renderNewSnackRegistration()}
      </div>
    </div>
  );
}
