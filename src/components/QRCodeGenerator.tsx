"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { userMap } from "@/utils/userMap";
import Image from "next/image";
import QRCode from "qrcode";
import jsPDF from "jspdf";

export default function QRCodeGenerator({
  returnToMain,
}: {
  returnToMain: () => void;
}) {
  const { data: session, status } = useSession();

  // 状態管理
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userData = session?.user?.name ? userMap[session.user.name] : null;
  const organization_id =
    session === null ? 1 : userData?.organization_id ?? 404;

  const generateQRCode = async () => {
    setLoading(true);
    setError(null);

    try {
      if (organization_id === 1) {
        throw new Error("ログインが必要です。");
      }

      if (organization_id === 404) {
        throw new Error(
          "組織IDが見つかりません。サポートにお問い合わせください。"
        );
      }

      // API Routeを通じてトークンを取得
      const tokenResponse = await fetch("/api/getToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organization_id }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.message || "トークンの取得に失敗しました");
      }

      const { token } = await tokenResponse.json();

      // QRコードデータ生成
      const qrData = `https://tech0-gen-7-step4-studentwebapp-pos-37-bxbfgkg5a7gwa7e9.eastus-01.azurewebsites.net?organization_id=${organization_id}&qr_generation_token=${token}`;
      const generatedQRCode = await QRCode.toDataURL(qrData);
      setQrCodeImage(generatedQRCode);
    } catch (err) {
      console.error("QRコード生成エラー:", err);
      setError((err as Error).message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // PDF出力機能
  const downloadPDF = () => {
    if (!qrCodeImage) return;
    const pdf = new jsPDF();
    pdf.text("QRコード", 10, 10);
    pdf.addImage(qrCodeImage, "PNG", 10, 20, 50, 50); // 位置とサイズを調整可能
    pdf.save("QRCode.pdf");
  };

  if (status === "loading") {
    return <p>セッションを確認中...</p>;
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">QRコード</h1>
      <div className="mb-4">
        {loading ? (
          <p className="text-gray-500">読み込み中...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : qrCodeImage ? (
          <Image
            src={qrCodeImage}
            alt="QRコード"
            width={200}
            height={200}
            className="mx-auto"
          />
        ) : (
          <p className="text-gray-500">QRコードはまだ生成されていません</p>
        )}
      </div>
      <Button
        onClick={generateQRCode}
        className="bg-purple-700 text-white hover:bg-purple-800 mb-4 mr-2"
        disabled={loading}
      >
        {loading ? "生成中..." : "QRコードを新たに発行"}
      </Button>
      {qrCodeImage && (
        <Button
          onClick={downloadPDF}
          className="bg-blue-700 text-white hover:bg-blue-800 mb-4 ml-2"
        >
          QRコードをPDFでダウンロード
        </Button>
      )}
      <Button
        onClick={returnToMain}
        className="mt-4 bg-purple-700 text-white hover:bg-purple-800 ml-2"
      >
        戻る
      </Button>
    </div>
  );
}
