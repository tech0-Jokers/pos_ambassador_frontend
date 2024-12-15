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

    // FastAPIにリクエストを送信 (Cache-Control: no-cacheを追加)
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/api/snacks/?organization_id=${organization_id}`,
      {
        method: "GET", // GETリクエストを明示
        headers: {
          "Cache-Control": "no-cache", // キャッシュコントロール設定
        },
      }
    );

    // レスポンスが正常でない場合はエラーをスロー
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.message || "お菓子データの取得に失敗しました");
    }

    // レスポンスデータをJSONとして取得
    const data = await apiResponse.json();

    // 取得したデータを返す
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("エラー:", error);

    // エラーメッセージを整形して返す
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";

    return NextResponse.json(
      { message: errorMessage || "エラーが発生しました" },
      { status: 500 }
    );
  }
}
