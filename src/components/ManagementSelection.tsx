"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ManagementSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">管理画面メニュー</h1>
      <Button
        variant="outline"
        className="w-64 text-lg"
        onClick={() => router.push("/snack-registration")}
      >
        お菓子登録機能
      </Button>
      <Button
        variant="outline"
        className="w-64 text-lg"
        onClick={() => alert("他の開発中ページに移動します")}
      >
        Github_idテストのページ
      </Button>
      <Button
        variant="outline"
        className="w-64 text-lg"
        onClick={() => router.push("/")}
      >
        戻る
      </Button>
    </div>
  );
}
