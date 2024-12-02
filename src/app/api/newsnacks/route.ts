import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const organization_id = formData.get("organization_id");
    const product_name = formData.get("name");
    const description = formData.get("description");
    const image = formData.get("image");

    if (!organization_id || !product_name || !description || !image) {
      return NextResponse.json(
        { message: "すべてのフィールドが必要です" },
        { status: 400 }
      );
    }

    // FastAPIにリクエストを送信
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/api/newsnacks/`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.message || "お菓子登録に失敗しました");
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("エラー:", error);

    // エラーを安全に扱うための処理
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";

    return NextResponse.json(
      { message: errorMessage || "エラーが発生しました" },
      { status: 500 }
    );
  }
}
