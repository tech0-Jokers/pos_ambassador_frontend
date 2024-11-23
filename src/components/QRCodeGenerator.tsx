"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // セッション情報を取得
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { userMap } from "@/utils/userMap"; // ユーザー情報マッピング

export default function QRCodeGenerator({
  returnToMain,
}: {
  returnToMain: () => void;
}) {
  const { data: session } = useSession(); // セッション情報
  const userData = session?.user?.name ? userMap[session.user.name] : null; // ユーザー情報をマップ
  const organization_id = userData?.organization_id || null; // セッションからorganization_idを取得

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // QRコード画像URL
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態
  const [fetching, setFetching] = useState<boolean>(true); // 初回フェッチ状態

  // QRコードを取得する
  useEffect(() => {
    const fetchQRCode = async () => {
      setFetching(true);
      try {
        if (!organization_id) {
          throw new Error("組織IDが不明です");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get_qr/${organization_id}`
        );

        if (!response.ok) {
          throw new Error("QRコードの取得に失敗しました");
        }

        const { qrCodeUrl } = await response.json(); // サーバーからQRコードURLを取得
        setQrCodeUrl(qrCodeUrl); // QRコードURLをステートに保存
      } catch (error) {
        console.error("初回QRコード取得エラー:", error);
        setQrCodeUrl(null); // エラー時はQRコードを非表示
      } finally {
        setFetching(false); // 初回フェッチ終了
      }
    };

    if (organization_id) {
      fetchQRCode(); // organization_idがある場合にのみデータ取得
    }
  }, [organization_id]);

  // QRコードを新規生成する
  const generateQRCode = async () => {
    setLoading(true);
    try {
      if (!organization_id) {
        throw new Error("組織IDが不明のため、QRコードを生成できません");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate_qr`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization_id }), // organization_idを送信
        }
      );

      if (!response.ok) {
        throw new Error("QRコードの生成に失敗しました");
      }

      const { qrCodeUrl } = await response.json(); // 新しいQRコードURLを取得
      setQrCodeUrl(qrCodeUrl); // 新しいQRコードをステートに保存
    } catch (error) {
      console.error("QRコード生成エラー:", error);
      setQrCodeUrl(null); // エラー時はQRコードを非表示
    } finally {
      setLoading(false); // ローディング状態解除
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">QRコード</h1>

      {/* QRコード画像表示エリア */}
      <div className="mb-4">
        {fetching ? (
          <p className="text-gray-500">読み込み中...</p>
        ) : qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            alt="QRコード"
            width={200}
            height={200}
            className="mx-auto"
          />
        ) : (
          <p className="text-gray-500">QRコードはまだ生成されていません</p>
        )}
      </div>

      {/* QRコード発行ボタン */}
      <Button
        onClick={generateQRCode}
        className="bg-purple-700 text-white hover:bg-purple-800 mb-4 mr-2"
        disabled={loading} // ローディング中は無効化
      >
        {loading ? "生成中..." : "QRコードを新たに発行"}
      </Button>

      {/* ホームに戻るボタン */}
      <Button
        onClick={returnToMain}
        className="mt-4 bg-purple-700 text-white hover:bg-purple-800 ml-2"
      >
        戻る
      </Button>
    </div>
  );
}
