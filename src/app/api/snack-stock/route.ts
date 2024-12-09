import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { organization_id } = await request.json();

    if (!organization_id) {
      return NextResponse.json(
        { message: "組織IDが必要です" },
        { status: 400 }
      );
    }

    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/inventory_products/${organization_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!apiResponse.ok) {
      throw new Error("FastAPIで在庫データ取得に失敗しました");
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("在庫データ取得エラー:", error);
    return NextResponse.json(
      { message: "在庫データ取得に失敗しました" },
      { status: 500 }
    );
  }
}