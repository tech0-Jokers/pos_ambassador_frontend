import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 静的生成を無効化

export async function GET(request: NextRequest) {
  try {
    // URLクエリパラメータの取得（例: organization_idが必要ならここで取得）
    const organization_id = request.nextUrl.searchParams.get("organization_id");
    if (!organization_id) {
      return NextResponse.json(
        { message: "組織IDが不足しています" },
        { status: 400 }
      );
    }

    // FastAPIへのリクエストURL
    const baseUrl = process.env.API_BASE_URL;

    // 1. メッセージ送信数データを取得
    const sendResponse = await fetch(
      `${baseUrl}/api/messages/send?organization_id=${organization_id}`
    );
    if (!sendResponse.ok)
      throw new Error("メッセージ送信数データの取得に失敗しました");
    const sendData = await sendResponse.json();

    // 2. メッセージ受信数データを取得
    const receiveResponse = await fetch(
      `${baseUrl}/api/messages/receive?organization_id=${organization_id}`
    );
    if (!receiveResponse.ok)
      throw new Error("メッセージ受信数データの取得に失敗しました");
    const receiveData = await receiveResponse.json();

    // 3. お菓子購入数ランキングデータを取得
    const rankingResponse = await fetch(
      `${baseUrl}/api/snacks/ranking?organization_id=${organization_id}`
    );
    if (!rankingResponse.ok)
      throw new Error("お菓子購入数データの取得に失敗しました");
    const rankingData = await rankingResponse.json();

    // 結果をまとめて返す
    return NextResponse.json({
      messageSendData: sendData,
      messageReceiveData: receiveData,
      snackRankingData: rankingData,
    });
  } catch (error: unknown) {
    console.error("エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";

    return NextResponse.json(
      { message: errorMessage || "エラーが発生しました" },
      { status: 500 }
    );
  }
}