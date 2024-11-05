// app/newSnackRegistration/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewSnackRegistration() {
  const [snackName, setSnackName] = useState("");
  const router = useRouter();
  const { setCurrentSnack } = useRegistration();

  const handleRegister = () => {
    setCurrentSnack(snackName); // 入力されたお菓子の名前を保存
    router.back(); // case1ページに戻る
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新規お菓子登録</h1>
      <Input
        value={snackName}
        onChange={(e) => setSnackName(e.target.value)}
        placeholder="お菓子の名前を入力"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      <Button onClick={handleRegister} className="mr-2">
        登録
      </Button>
      <Button onClick={() => router.back()}>戻る</Button>
    </div>
  );
}
