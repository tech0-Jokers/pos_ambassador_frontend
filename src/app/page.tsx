// src/app/page.tsx

"use client";

import SnackRegistrationApp from "@/components/SnackRegistrationApp";
import LoginStatus from "@/components/LoginStatus";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ログイン状態の表示を分けたコンポーネント */}
      <LoginStatus />

      {/* 認証状態に関係なくSnackRegistrationAppを表示 */}
      <SnackRegistrationApp />
    </main>
  );
}
