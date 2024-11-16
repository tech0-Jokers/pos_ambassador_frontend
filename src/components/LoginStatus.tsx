"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { userMap } from "@/utils/userMap";

export default function LoginStatus() {
  const { data: session } = useSession();

  // ユーザー名から user_id と organization_id を取得
  const userData = session?.user?.name ? userMap[session.user.name] : null;
  const organization_id = userData?.organization_id || (session ? 404 : 1); // ログイン中にデータがなければ404、未ログインなら1

  return (
    <div className="mb-4">
      {session ? (
        <>
          <p>ようこそ、{session.user?.name}さん！</p>
          <p>
            組織ID: {organization_id === 404 ? "不明（404）" : organization_id}
          </p>
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
