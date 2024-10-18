"use client"; // クライアントサイドでの実行を指定

import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null); // カメラ映像の表示領域
  const [productName, setProductName] = useState<string | null>(null); // 商品名の状態
  const [error, setError] = useState<string | null>(null); // エラーの状態

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader(); // ZXingのインスタンス作成

    codeReader
      .decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
        if (result) {
          console.log("スキャン結果:", result.getText());
          handleScan(result.getText()); // スキャン結果を処理
          codeReader.reset(); // スキャンを停止
        } else if (err && !(err instanceof NotFoundException)) {
          console.error("スキャンエラー:", err);
        }
      })
      .catch((err) => console.error("初期化エラー:", err));

    return () => {
      codeReader.reset(); // コンポーネントがアンマウントされるときにリセット
    };
  }, []);

  // バーコードをスキャンした後の商品名を取得する関数
  const handleScan = async (barcode: string) => {
    try {
      console.log("API URL:", process.env.REACT_APP_API_URL); 
      const response = await fetch(`http://localhost:8000/get_product_name?barcode=${barcode}`);
      if (!response.ok) {
        throw new Error("商品が見つかりません");
      }
      const data = await response.json();
      setProductName(data.product_name); // 商品名を状態に設定
      setError(null); // エラーをリセット
    } catch (error) {
      console.error("エラー:", error);
      setError(error.message); // エラーメッセージを状態に設定
      setProductName(null); // 商品名をリセット
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", height: "300px" }} />
      {productName && <div>商品名: {productName}</div>}
      {error && <div style={{ color: "red" }}>エラー: {error}</div>}
    </div>
  );
}
