import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get("organization_id");

    if (!organization_id) {
      return NextResponse.json(
        { message: "組織IDが不足しています" },
        { status: 400 }
      );
    }

    // FastAPIにリクエストを送信
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/api/snacks/?organization_id=${organization_id}`
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.message || "お菓子データの取得に失敗しました");
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
