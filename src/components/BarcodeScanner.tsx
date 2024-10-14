"use client"; // クライアントサイドでの実行を指定

import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

interface BarcodeScannerProps {
  onScan: (result: string) => void; // スキャン結果を受け取るコールバック関数
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null); // カメラ映像の表示領域

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader(); // ZXingのインスタンス作成

    codeReader
      .decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
        if (result) {
          console.log("スキャン結果:", result.getText());
          onScan(result.getText()); // スキャン結果を親コンポーネントに渡す
          codeReader.reset(); // スキャンを停止
        } else if (err && !(err instanceof NotFoundException)) {
          console.error("スキャンエラー:", err);
        }
      })
      .catch((err) => console.error("初期化エラー:", err));

    return () => {
      codeReader.reset(); // コンポーネントがアンマウントされるときにリセット
    };
  }, [onScan]);

  return <video ref={videoRef} style={{ width: "100%", height: "300px" }} />;
}
