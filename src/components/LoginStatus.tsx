"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { organizationMap } from "@/utils/organizationMap";

export default function LoginStatus() {
  const { data: session } = useSession();

  // ユーザー名から organization_id を取得
  const organization_id =
    session?.user?.name && organizationMap[session.user.name]
      ? organizationMap[session.user.name]
      : null;

  return (
    <div className="mb-4">
      {session ? (
        <>
          <p>ようこそ、{session.user?.name}さん！</p>
          <p>組織ID: {organization_id || "不明"}</p>
          <button onClick={() => signOut()}>ログアウト</button>
        </>
      ) : (
        <>
          <p>ログインしていません。</p>
          <button onClick={() => signIn()}>ログイン</button>
        </>
      )}
    </div>
  );
}
