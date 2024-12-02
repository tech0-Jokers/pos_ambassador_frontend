import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { organization_id, product_id, sales_amount } = await request.json();

    if (!organization_id || !product_id || !sales_amount) {
      return NextResponse.json(
        { message: "必要な情報が不足しています" },
        { status: 400 }
      );
    }

    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/inventory_products/${organization_id}/update_price/${product_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sales_amount }),
      }
    );

    if (!apiResponse.ok) {
      throw new Error("値段変更に失敗しました");
    }

    return NextResponse.json({ message: "値段変更に成功しました" });
  } catch (error) {
    console.error("値段変更エラー:", error);
    return NextResponse.json(
      { message: "値段変更に失敗しました" },
      { status: 500 }
    );
  }
}
