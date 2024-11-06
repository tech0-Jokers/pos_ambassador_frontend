"use client";

import React, { useState } from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewSnackRegistrationProps = {
  returnToCase1: () => void;
};

export default function NewSnackRegistration({
  returnToCase1,
}: NewSnackRegistrationProps) {
  const [snackName, setSnackName] = useState("");
  const [snackDescription, setSnackDescription] = useState("");
  const [snackImage, setSnackImage] = useState<File | null>(null);
  const { setCurrentSnack } = useRegistration();

  const handleRegister = () => {
    setCurrentSnack(snackName);

    // snackImageを一時的に使用してエラー回避
    if (snackImage) {
      console.log("Selected image:", snackImage.name);
    }

    returnToCase1();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSnackImage(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新しくお菓子を登録</h1>

      <Input
        value={snackName}
        onChange={(e) => setSnackName(e.target.value)}
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

      <Button onClick={handleRegister} className="mr-2">
        登録
      </Button>
      <Button onClick={returnToCase1}>戻る</Button>
    </div>
  );
}
