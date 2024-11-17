"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { userMap } from "@/utils/userMap";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewSnackRegistrationProps = {
  returnToCase1: () => void;
};

export default function NewSnackRegistration({
  returnToCase1,
}: NewSnackRegistrationProps) {
  const [snackProductName, setSnackProductName] = useState(""); // 修正: snackName → snackProductName
  const [snackDescription, setSnackDescription] = useState("");
  const [snackImage, setSnackImage] = useState<File | null>(null);
  const { setSnacksData, setCurrentSnack } = useRegistration();
  const { data: session } = useSession(); // セッション情報を取得

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSnackImage(e.target.files[0]);
    }
  };

  const handleRegister = async () => {
    if (!snackProductName || !snackDescription || !snackImage) {
      alert("すべてのフィールドを入力してください");
      return;
    }

    // ユーザー情報を取得
    const userData = session?.user?.name ? userMap[session.user.name] : null;
    const organization_id = userData?.organization_id || (session ? 404 : 1);

    const formData = new FormData();
    formData.append("organization_id", organization_id.toString());
    formData.append("name", snackProductName); // 修正: name → product_name
    formData.append("description", snackDescription);
    formData.append("image", snackImage);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsnacks/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("登録成功:", data);

        // 新しく登録された商品をsnacksDataに追加
        setSnacksData(
          (
            prevSnacksData: {
              product_id: number;
              product_name: string;
              incoming_quantity: number;
            }[]
          ) => [
            ...prevSnacksData,
            {
              product_id: data.product_id,
              product_name: data.product_name,
              incoming_quantity: 0, // 初期値
            },
          ]
        );

        // 登録されたお菓子名を即座にセット
        setCurrentSnack({
          product_name: data.product_name,
          product_id: data.product_id,
        });

        alert("お菓子の登録が成功しました！");

        // 遷移を少し遅らせる
        setTimeout(() => {
          returnToCase1();
        }, 200); // 200ms遅延
      } else {
        const errorData = await response.json();
        alert(`エラー: ${errorData.message}`);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("お菓子の登録中にエラーが発生しました");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新しくお菓子を登録</h1>
      <Input
        value={snackProductName} // 修正: snackName → snackProductName
        onChange={(e) => setSnackProductName(e.target.value)} // 修正: snackName → snackProductName
        placeholder="お菓子の名前を入力"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      <Input
        value={snackDescription}
        onChange={(e) => setSnackDescription(e.target.value)}
        placeholder="お菓子の説明を入力"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          お菓子の画像をアップロード
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
      </div>
      <Button
        onClick={handleRegister}
        className="mr-2 bg-purple-700 text-white hover:bg-purple-800"
      >
        登録
      </Button>
      <Button
        onClick={returnToCase1}
        className="bg-purple-700 text-white hover:bg-purple-800"
      >
        戻る
      </Button>
    </div>
  );
}
