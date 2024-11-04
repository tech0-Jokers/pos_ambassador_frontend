// src/app/page.tsx

"use client";

import RegistrationApp from "@/components/RegistrationApp";
import LoginStatus from "@/components/LoginStatus";

export default function Home() {
  console.log("Rendering Home component"); // ログ追加
  console.log("RegistrationApp:", RegistrationApp); // ログ追加
  console.log("LoginStatus:", LoginStatus); // ログ追加

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ログイン状態の表示 */}
      <LoginStatus />
      {/* 登録アプリケーションの表示 */}
      <RegistrationApp />
    </main>
  );
}
