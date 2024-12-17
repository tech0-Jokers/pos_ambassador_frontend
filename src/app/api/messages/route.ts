import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 静的生成を無効化

export async function GET(request: NextRequest) {
  try {
    // URLクエリパラメータの取得
    const organization_id = request.nextUrl.searchParams.get("organization_id");

    if (!organization_id) {
      return NextResponse.json(
        { message: "組織IDが不足しています" },
        { status: 400 }
      );
    }

    // FastAPIにリクエストを送信
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/api/messages/?organization_id=${organization_id}`,
      {
        method: "GET",
        cache: "no-store", // キャッシュを完全に無効化
        headers: {
          "Cache-Control": "no-store", // クライアント側でのキャッシュ無効化
          Pragma: "no-cache", // 互換性のための設定
          Expires: "0", // キャッシュの期限切れを即座に設定
        },
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(
        errorData.message || "メッセージデータの取得に失敗しました"
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
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
