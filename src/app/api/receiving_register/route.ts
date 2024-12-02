import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 必須パラメータのチェック
    if (
      !body.entryDate ||
      !body.purchase_amount ||
      !body.user_id ||
      !body.organization_id ||
      !body.items
    ) {
      return NextResponse.json(
        { message: "必要なデータが不足しています" },
        { status: 400 }
      );
    }

    // FastAPIエンドポイントにリクエストを送信
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/receiving_register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.message || "登録に失敗しました");
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
