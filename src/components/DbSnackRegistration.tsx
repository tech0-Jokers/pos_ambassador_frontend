"use client";

import React, { useState } from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

type DbSnackRegistrationProps = {
  returnToCase1: () => void;
};

type Snack = {
  name: string;
  description: string;
  imageUrl: string;
};

export default function DbSnackRegistration({
  returnToCase1,
}: DbSnackRegistrationProps) {
  const [snackName, setSnackName] = useState("");
  const { setCurrentSnack } = useRegistration();

  // サンプルデータ
  const sampleSnacks: Snack[] = [
    {
      name: "ポテトチップス",
      description: "サクサクのポテトチップス",
      imageUrl:
        "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788728/potechi_veyabd.webp",
    },
    {
      name: "チョコレート",
      description: "濃厚なチョコレート",
      imageUrl:
        "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788236/chocolate_na6lsh.webp",
    },
    {
      name: "グミキャンディー",
      description: "フルーティーなグミ",
      imageUrl:
        "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788535/fruitgumi_hd5flb.webp",
    },
    {
      name: "ポップコーン",
      description: "甘いポッポコーン",
      imageUrl:
        "https://res.cloudinary.com/dftirqnc5/image/upload/v1727788850/carapop_njcrsq.webp",
    },
  ];

  // snackNameが空でないときのみフィルタリング
  const filteredSnacks =
    snackName.trim() !== ""
      ? sampleSnacks.filter((snack) => snack.name.includes(snackName))
      : [];

  const handleRegister = (snack: Snack) => {
    setCurrentSnack(snack.name); // 選択したお菓子の名前を保存
    returnToCase1();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">データベースからお菓子を登録</h1>
      <Input
        value={snackName}
        onChange={(e) => setSnackName(e.target.value)}
        placeholder="お菓子の名前を入力"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      {filteredSnacks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSnacks.map((snack, index) => (
            <Card
              key={index}
              className="flex flex-col items-center p-4 shadow-md transparent-container"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {snack.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center text-center pb-6">
                <p>{snack.description}</p>
                <img
                  src={snack.imageUrl}
                  alt={snack.name}
                  className="mt-2 w-40 h-40 object-cover rounded-md"
                />
              </CardContent>
              <CardFooter className="mt-auto">
                <Button onClick={() => handleRegister(snack)}>登録</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Button onClick={returnToCase1} className="mt-4">
        戻る
      </Button>
    </div>
  );
}
